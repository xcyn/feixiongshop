// 商品C端接口
let Router = require('koa-router');
const { dbConfig } = require('../config/index');
let database = dbConfig.database;
let appRouter = new Router();
const short = require('short-uuid');
// 微信支付相关
const wxpay = require('../lib/pay');
const config = require('../config/key-config');
const { _buildXml, _parseXml, getRandomNumber, getSign } = require('../lib/utils');

// 创建订单
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
  totalFee = totalFee * 100
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

// 创建订单-新版-对接第三方迅虎支付
appRouter.post('/create-order-new', async ctx => {
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
  totalFee = totalFee * 100
  let payState = 0
  // 依照Order模型接收参数
  let outTradeNo = `${new Date().getFullYear()}${short().new()}`
  console.log('outTradeNo', outTradeNo);
  console.log('ctx.request.i', ctx.request.ip)
  console.log('openId', openId)
  console.log('openId', openId)
  console.log('getRandomNumber', getRandomNumber)
  console.log('getSign', getSign)
  // 获取订单的预支付信息
  let paramsObject = {
    'mchid': config.mch_id_xunhu, // 商户号
    'out_trade_no': outTradeNo,
    'total_fee': totalFee,
    'body': '飞熊学习支付',
    'notify_url': config.notify_url_xunhu,
    'attach': '',
    'goods_detail': '',
    'nonce_str': getRandomNumber(),
  }
  let sign = getSign(paramsObject)
  paramsObject.sign = sign
  ctx.status = 200
  ctx.body = {
    code: 200,
    msg: 'ok',
    data: {
      res: paramsObject,
    }
  }
})

// 取消订单
appRouter.post('/cancel-order', async ctx => {
  let {
    userId,
    outTradeNo,
   } = ctx.request.body
   if(!userId || !outTradeNo) {
      throw new Error('参数有误')
  }
  let orderRes = await ctx.state.orm.db(database).table('order').update({
    data: {
      payState: 2,
    },
    where: {
      outTradeNo
    }
  })

  ctx.state.res({
    data: orderRes
  })

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
  console.log('get-orders:userId', userId)
  console.log('get-orders:isAll', isAll)
  if(isAll) {
    orders = await ctx.state.orm.db(database).table('order').select({
      where: {
        userId
      },
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
  let isTest = ctx.request.query.test
  try {
    let raw = ctx.request.body;
    if(isTest) {
      raw = isTest
    }
    console.log('serve-log:微信支付回调接口:入参request.body:', ctx.request.body)
    let retobj = await _parseXml(raw)
    console.log('serve-log:微信支付回调接口: _parseXml成功:', retobj)
    if(retobj) {
      // 商户单号
      let outTradeNo = retobj.out_trade_no
      let resultCode = retobj.result_code
      // 交易单号
      let transactionId = retobj.transaction_id
      console.log(`serve-log:微信支付回调接口: 
        retobj相关参数:
        outTradeNo-${outTradeNo},
        resultCode-${resultCode},
        transactionId-${transactionId}
      `)
      let payState = 0
      if (resultCode === 'SUCCESS'){
        payState = 1
      }else{
        payState = 2
      }
      let orderRes = await ctx.state.orm.db(database).table('order').update({
        data: {
          payState,
          transactionId
        },
        where: {
          outTradeNo
        }
      })
      console.log(`serve-log:微信支付回调接口: 
        订单状态更新成功:
        orderRes-${orderRes}
      `)
    }
    // 成功
    let xml = _buildXml({return_code: 'SUCCESS', return_msg: 'OK'})
    ctx.body = xml;
  } catch (error) {
    console.log(`serve-log:微信支付回调接口: 
      支付回调接收失败:
      error-${error}
    `)
    // 失败
    let xml = _buildXml({return_code: 'FAILURE', return_msg: 'FAIL'})
    ctx.body = xml;
  }
})


// 微信支付回调接口-迅虎支付
appRouter.all('/pay_notify_xunhu', async (ctx) => {
  let isTest = ctx.request.query.test
  try {
    let raw = ctx.request.body;
    if(isTest) {
      raw = isTest
    }
    console.log('serve-log:微信支付回调接口:入参request.body:', ctx.request.body)
    let retobj = raw
    console.log('serve-log:微信支付回调接口: _parseXml成功:', retobj)
    if(retobj) {
      // 商户单号
      let outTradeNo = retobj.out_trade_no
      let resultCode = retobj.return_code
      // 交易单号
      let transactionId = retobj.transaction_id
      console.log(`serve-log:微信支付回调接口: 
        retobj相关参数:
        outTradeNo-${outTradeNo},
        resultCode-${resultCode},
        transactionId-${transactionId}
      `)
      let payState = 0
      if (resultCode === 'SUCCESS'){
        payState = 1
      }else{
        payState = 2
      }
      let orderRes = await ctx.state.orm.db(database).table('order').update({
        data: {
          payState,
          transactionId
        },
        where: {
          outTradeNo
        }
      })
      console.log(`serve-log:微信支付回调接口: 
        订单状态更新成功:
        orderRes-${orderRes}
      `)
    }
    // 成功
    let xml = 'success'
    ctx.body = xml;
  } catch (error) {
    console.log(`serve-log:微信支付回调接口: 
      支付回调接收失败:
      error-${error}
    `)
    // 失败
    let xml = 'failure'
    ctx.body = xml;
  }
})

// 微信退款接口
appRouter.get('/pay_refund', async (ctx) => {
  let {out_trade_no:out_trade_no} = ctx.request.query
  const sequelize = await ctx.state.orm.db(database).sequelize()
  // 开启事务
  let t = await sequelize.transaction()
  console.log(1)
  try {
    const orderModel = await ctx.state.orm.db(database).table('order').getTable('order', sequelize)
  console.log(2)
    await orderModel.sync({ force: false }); //创建表
  console.log(3)
    let orderRes = await orderModel.findAll({
      where: {
        outTradeNo: out_trade_no,
      }
    }, {transaction: t})
    let totalFee =  orderRes[0].totalFee
    let data = {
      out_trade_no,
      out_refund_no: short().new(),
      total_fee: totalFee,
      refund_fee: totalFee
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
    // 退款成功，更新订单状态
    await orderModel.update({
      payState: 2,
    },{
      where: {
        outTradeNo: out_trade_no,
      }
    }, {transaction: t})
    t.commit();
    ctx.state.res({
      data: res
    })
  } catch(err) {
    t.rollback();
  }













})

module.exports = appRouter.routes()
