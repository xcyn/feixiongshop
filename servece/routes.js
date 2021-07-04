let Router = require('koa-router')
let appRouter = new Router();

// 模块分层
let index = require('./controller/index')

appRouter.use(index)

module.exports = appRouter
