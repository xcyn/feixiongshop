const Router = require('koa-router');
const util = require('util');
const jsonwebtoken = require('jsonwebtoken');
const WeixinAuth = require('../lib/koa2-weixin-auth');
const WXBizDataCrypt = require('../lib/WXBizDataCrypt.js');
const config = require('../config/key-config');

const weixinAuth = new WeixinAuth(config.miniProgramAppid, config.miniProgramAppSecret);

let appRouter = new Router({
  prefix: '/user'
});

appRouter.post('/wx-login', async (ctx, next) => {
  let { code,
    encryptedData,
    iv,
    sessionKeyIsValid } = ctx.request.body
  let sessionKey
  let openId
  // 如果seesonKey未过期，直接取缓存
  if (sessionKeyIsValid) {
    let token = ctx.request.header.authorization;
    token = token.split(' ')[1]
    console.log('token', token)
    // token有可能是空的
    if (token) {
      try {
        let payload = await util.promisify(jsonwebtoken.verify)(token, config.jwtSecret)
        if (payload) {
          sessionKey = payload.sessionKey
        }
      } catch(err) {
        // todo-log
        throw err
      }
    }
  }

  // 如果sessionKey没有过期，但是没有token
  if (!sessionKey) {
    const token = await weixinAuth.getAccessToken(code)
    // 目前微信的 session_key, 有效期3天
    sessionKey = token.data.session_key;
    openId = token.data.openid
  }

  // 解密openId
  let decryptedUserInfo
  var pc = new WXBizDataCrypt(config.miniProgramAppid, sessionKey)
  decryptedUserInfo = pc.decryptData(encryptedData, iv)
  decryptedUserInfo.openId = openId

  // 清楚不必要字段
  if(decryptedUserInfo.watermark) {
    delete decryptedUserInfo.watermark
  }
  let user = await ctx.state.orm.db('fexiong-shop-dev').table('user').select({
    where: {
      openId: decryptedUserInfo.openId
    }
  })
  if (!user || !user.length) {
    console.log('未查到相关用户,开始通过数据库创建用户');
    user = await ctx.state.orm.db('fexiong-shop-dev').table('user').insert(decryptedUserInfo)
    if(user) {
      user = [user]
    }
  } else {
    console.log('数据库中查到用户:', user[0].id, user[0].nickName);
  }

  // 添加openId与sessionKey今天jwt
  let authorizationToken = jsonwebtoken.sign({
    uid: user[0].id,
    nickName: decryptedUserInfo.nickName,
    avatarUrl: decryptedUserInfo.avatarUrl,
    openId: decryptedUserInfo.openId,
    sessionKey: sessionKey
  },
    config.jwtSecret,
    { expiresIn: '3d' } //修改为3天，这是sessionKey的有效时间
  )

  Object.assign(decryptedUserInfo, { authorizationToken })

  ctx.state.res({
    errmsg: '获取用户成功',
    data: decryptedUserInfo
  })
})

module.exports = appRouter.routes()
