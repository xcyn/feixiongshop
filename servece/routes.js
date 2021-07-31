let Router = require('koa-router')
let appRouter = new Router();

// 模块分层
let index = require('./controller/index')

// 用户系统
let user = require('./controller/user')

appRouter.use(index)
appRouter.use(user)

module.exports = appRouter
