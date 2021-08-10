let Router = require('koa-router')
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

module.exports = appRouter.routes()
