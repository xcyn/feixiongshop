let Router = require('koa-router');
const { dbConfig } = require('../config/index');
let database = dbConfig.database;
let appRouter = new Router();

appRouter.get('/test', (ctx, next) => {
  console.log(ctx.query)
  console.log('123123')
  console.log(ctx.session)
  ctx.state.res({
    data: {
      query: ctx.query
    }
  })
})

appRouter.get('/ormTest', async(ctx, next) => {
  const res = await ctx.state.orm.db(database).table('test').select({
    where: {
      'name': 'xiongchuanyu',
    }
  })
  ctx.session.user = 'xiongchuanyu'
  ctx.state.res({
    data: res
  })
})

appRouter.get('/addOrmTest', async(ctx, next) => {
  let data = {
    name: 'xiongchuanyu3',
    testIndex: `${+Math.random()}`
  }
  await ctx.state.orm.db(database).table('test').insert(data)
  ctx.state.res({
    data: ctx.session
  })
})

module.exports = appRouter.routes()
