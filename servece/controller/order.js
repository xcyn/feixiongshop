// 商品C端接口
let Router = require('koa-router');
const { dbConfig } = require('../config/index');
let database = dbConfig.database;
let appRouter = new Router();
const short = require('short-uuid');
// 微信支付相关
const wxpay = require('../lib/pay');
const config = require('../config/key-config');
appRouter.post('/create-order', async ctx => {
  let {
    openId,
    userId,
    totalFee,
    addressId,
    addressDesc,
    goodsCartsIds,
    goodsNameDesc,
   } = ctx.request.body
   if(!userId || !totalFee || !addressId ||
    !addressDesc || !goodsCartsIds || !goodsNameDesc
    ) {
      throw new Error('参数有误')
  }
  // 为测试方便，所有金额支付数均为1分
  totalFee = 1
  let payState = 0
  // 依照Order模型接收参数
  let outTradeNo = `${new Date().getFullYear()}${short().new()}`
  console.log('outTradeNo', outTradeNo);
  console.log('ctx.request.i', ctx.request.ip)
  console.log('openId', openId)
  // 获取订单的预支付信息
  var trade = {
    openid: openId,
    body: goodsNameDesc.substr(0, 127), //最长127字节
    out_trade_no: outTradeNo, //
    total_fee: totalFee, //以分为单位，货币的最小金额
    spbill_create_ip: ctx.request.ip, //ctx.request.ip
    notify_url: config.notify_url, // 支付成功通知地址
    trade_type: 'JSAPI',
  };
  let params = await (() => {
    return new Promise((resolve, reject) => {
      wxpay.getBrandWCPayRequestParams(trade, ( err, result) => {
        console.log(err, result);
        if (err) {
          reject(err);
        }else {
          resolve(result);
        }
      });
    })
  })()
  let errRes = '';
  let res = '';
  if (params && params.package && params.paySign) {
    // 创建记录
    res = await ctx.state.orm.db(database).table('order').findOrCreate({
      where: {
        userId,
        outTradeNo,
        payState,
        totalFee,
        addressId,
        addressDesc,
        goodsCartsIds,
        goodsNameDesc,
      }
    })
    if (!res) {
      errRes = 'db create error';
    }
  } else {
    errRes = 'error! getBrandWCPayRequestParams() return null!'
    console.log(errRes);
  }
  ctx.status = 200
  ctx.body = {
    code: 200,
    msg: !errRes ? 'ok' : '',
    data: {
      res,
      params
    }
  }
})

// 创建地址
appRouter.post('/create-order2', async(ctx, next) => {
  let { 
    userId,
    outTradeNo,
    transactionId,
    payState,
    totalFee,
    addressId,
    addressDesc,
    goodsCartsIds,
    goodsNameDesc,
   } = ctx.request.body
   if(!userId || !outTradeNo ||
    (!payState && typeof payState != 'number') || !totalFee || !addressId ||
    !addressDesc || !goodsCartsIds || !goodsNameDesc
    ) {
      throw new Error('参数有误')
   }
  let order = await ctx.state.orm.db(database).table('order').findOrCreate({
    where: {
      userId,
      outTradeNo,
      transactionId,
      payState,
      totalFee,
      addressId,
      addressDesc,
      goodsCartsIds,
      goodsNameDesc,
    }
  })
  ctx.state.res({
    data: order && order[0] || null
  })
})


module.exports = appRouter.routes()
