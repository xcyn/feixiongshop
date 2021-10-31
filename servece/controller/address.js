// 商品C端接口
let Router = require('koa-router');
const { dbConfig } = require('../config/index');
let database = dbConfig.database;
let appRouter = new Router();

// 创建地址
appRouter.post('/create-address', async(ctx, next) => {
  let { 
    userId,
    userName,
    telNumber,
    region,
    detailInfo,
    isDefault
   } = ctx.request.body
  let address = await ctx.state.orm.db(database).table('address').findOrCreate({
    where: {
      userId,
      userName,
      telNumber,
      region,
      detailInfo,
      isDefault
    }
  })
  ctx.state.res({
    data: address[0]
  })
})

// 删除地址
appRouter.post('/delete-address', async(ctx, next) => {
  let { 
    userId,
    userName,
    telNumber,
    region,
    detailInfo,
   } = ctx.request.body
  let address = await ctx.state.orm.db(database).table('address').destroy({
    where: {
      userId,
      userName,
      telNumber,
      region,
      detailInfo,
    }
  })
  ctx.state.res({
    data: address[0]
  })
})

// 编辑地址
appRouter.post('/update-address', async(ctx, next) => {
  let { 
    userId,
    userName,
    telNumber,
    region,
    detailInfo,
   } = ctx.request.body
  let address = await ctx.state.orm.db(database).table('address').update({
    data: {
      userId,
      userName,
      telNumber,
      region,
      detailInfo,
    },
    where: {
      userId,
      userName,
      region
    }
  })
  ctx.state.res({
    data: address[0]
  })
})

// 查询地址
appRouter.get('/select-address', async(ctx, next) => {
  let { 
    userId,
    userName
   } = ctx.query
  let address = await ctx.state.orm.db(database).table('address').select({
    where: {
      userId,
      userName
    }
  })
  ctx.state.res({
    data: address
  })
})


module.exports = appRouter.routes()
