const Router = require('koa-router');
const util = require('util');
const jsonwebtoken = require('jsonwebtoken');
const WeixinAuth = require('../lib/koa2-weixin-auth');
const WXBizDataCrypt = require('../lib/WXBizDataCrypt.js');
const config = require('../config/key-config');
const { dbConfig } = require('../config/index');
let database = dbConfig.database;


const weixinAuth = new WeixinAuth(config.miniProgramAppid, config.miniProgramAppSecret);

let appRouter = new Router({
  prefix: '/user'
});

appRouter.post('/wx-login', async (ctx, next) => {
  let { code,
    userInfo,
    encryptedData,
    iv,
    sessionKeyIsValid } = ctx.request.body
  let sessionKey
  let openId
  // 解密openId
  let decryptedUserInfo = {}
  // 如果seesonKey未过期，直接取缓存
  if (sessionKeyIsValid) {
    let token = ctx.request.header.authorization;
    token = token.split(' ')[1]
    // token有可能是空的
    if (token) {
      try {
        let payload = await util.promisify(jsonwebtoken.verify)(token, config.jwt_secret)
        console.log('payload', payload)
        if (payload) {
          sessionKey = payload.sessionKey
          openId = payload.openId
        }
      } catch(err) {
        throw err
      }
    }
  }

  // 如果sessionKey没有过期，但是没有token
  if (!sessionKey) {
    const token = await weixinAuth.getAccessToken(code)
    // 目前微信的 session_key, 有效期3天
    sessionKey = token.data.session_key;
    openId = token.data.openid;
    let pc = new WXBizDataCrypt(config.miniProgramAppid, sessionKey)
    let info = pc.decryptData(encryptedData, iv)
    info = Object.assign({}, info, userInfo)
    decryptedUserInfo = info
    decryptedUserInfo.openId = openId
    // 清楚不必要字段
    if(decryptedUserInfo.watermark) {
      delete decryptedUserInfo.watermark
    }
  }

  let user = await ctx.state.orm.db(database).table('user').select({
    where: {
      openId: openId
    }
  })

  if (!user || !user.length) {
    console.log('未查到相关用户,开始通过数据库创建用户');
    user = await ctx.state.orm.db(database).table('user').insert(decryptedUserInfo)
    if(user) {
      console.log('创建用户成功');
      user = [user]
    }
    user = user && user[0]
    user = user.get()
    decryptedUserInfo = user
    console.log('创建用户成功: decryptedUserInfo', decryptedUserInfo)
  } else {
    user = user && user[0]
    user = user.get()
    decryptedUserInfo = user
    console.log('数据库中查到用户:', user.id, user.nickName);
  }

  // 添加openId与sessionKey今天jwt
  let authorizationToken = jsonwebtoken.sign({
    uid: user.id,
    nickName: decryptedUserInfo.nickName,
    avatarUrl: decryptedUserInfo.avatarUrl,
    openId: decryptedUserInfo.openId,
    sessionKey: sessionKey
  },
    config.jwt_secret,
    { expiresIn: '2d' } //修改为2天，比微信短一点
  )

  Object.assign(decryptedUserInfo, { authorizationToken })

  ctx.state.res({
    errmsg: '获取用户成功',
    data: decryptedUserInfo
  })
})

// 检测登录状态
appRouter.get('/checkLogin', async(ctx, next) => {
  let token = ctx.request.header.authorization;
  token = token.split(' ')[1]
  let payload = await util.promisify(jsonwebtoken.verify)(token, config.jwt_secret)
  let user = await ctx.state.orm.db(database).table('user').select({
    where: {
      openId: payload.openId
    }
  })
  user = user && user[0]
  ctx.state.res({
    errmsg: '用户已是登录状态',
    data: user
  })
})

// 骗微信审核
appRouter.get('/isWxAudit', async(ctx, next) => {
  ctx.state.res({
    data: false
  })
})

module.exports = appRouter.routes()
