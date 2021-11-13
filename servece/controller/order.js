// 商品C端接口
let Router = require('koa-router');
const { dbConfig } = require('../config/index');
let database = dbConfig.database;
let appRouter = new Router();

// 创建地址
appRouter.post('/create-order', async(ctx, next) => {
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
