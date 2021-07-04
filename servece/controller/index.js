var Router = require('koa-router')
var appRouter = new Router();

appRouter.get('/test', (ctx, next) => {
  console.log(ctx.query)
  ctx.state.res({
    data: {
      query: ctx.query
    }
  })
})

appRouter.get('/ormTest', async(ctx, next) => {
  const res = await ctx.state.orm.db('fexiong-shop-dev').table('user').select({
    where: {
      'name': 'xiongchuanyu'
    }
  })
  ctx.state.res({
    data: res
  })
})

appRouter.get('/addOrmTest', async(ctx, next) => {
  const res = await ctx.state.orm.db('fexiong-shop-dev').table('user').insert({
    name: 'xiongchuanyu3',
  })
  ctx.state.res({
    data: res
  })
})

module.exports = appRouter.routes()
