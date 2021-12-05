// 商品C端接口
let Router = require('koa-router');
const { dbConfig } = require('../config/index');
let database = dbConfig.database;
let appRouter = new Router();
const short = require('short-uuid');
// 微信支付相关
const wxpay = require('../lib/pay');
const config = require('../config/key-config');
const getRawBody = require( 'raw-body');
const { _buildXml } = require('../lib/utils')
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

// 获取订单
appRouter.get('/get-orders', async(ctx, next) => {
  let {
    status,
    userId
   } = ctx.query
  //  订单状态map
  let statusMap = {
    'all': 'isAll',
    'unPay': 0,
    'isPay': 1,
    'cancel': 2,
  }
  if(!status || !userId) {
    throw new Error('状态不对')
  }
  let statusItem = statusMap[status]
  if(!statusMap) {
    throw new Error('参数错误')
  }
  let isAll = statusItem === 'isAll'
  let orders = []
  if(isAll) {
    orders = await ctx.state.orm.db(database).table('order').select({
      userId,
      options: {
        'order': [['id', 'DESC']]
      }
    })
  } else {
    orders = await ctx.state.orm.db(database).table('order').select({
      where: {
        userId,
        payState: statusItem
      },
      options: {
        order: [['id', 'DESC']]
      }
    })
  }  
  ctx.state.res({
    data: orders
  })
})

// 微信支付回调接口
appRouter.all('/pay_notify', async (ctx) => {
  console.log('获取到接口..', ctx.request.query)
  try {
    let raw = await getRawBody(ctx.req, {
        encoding: 'utf-8'
    });
    console.log('获取到接口1..', raw)
    let retobj = JSON.parse(raw);
    console.log('获取到接口2..', retobj)
    if(retobj) {
      console.log('----------', retobj)
    }
    // 成功
    let xml = _buildXml({return_code: 'SUCCESS', return_msg: 'OK'})
    // 失败
    // _buildXml({return_code: 'FAILURE', return_msg: 'FAIL'})
    console.log('xml', xml);
  } catch (error) {
    console.log('error----', error)
  }

})

// 微信退款接口
appRouter.get('/pay_refund', async (ctx) => {
  let {out_trade_no:out_trade_no} = ctx.request.query
  console.log('----', out_trade_no)
  let data = {
      out_trade_no,
      out_refund_no: short().new(),
      total_fee: 1,
      refund_fee: 1
  };
  // 尝试退款，封装原方法
  let res = await (()=>{
    return new Promise((resolve, reject)=>{
      wxpay.refund(data,(err, result) => {
        if (err) reject(err)
        else resolve(result)
      });
    })
  })()
  ctx.state.res({
    data: res
  })
})

module.exports = appRouter.routes()
