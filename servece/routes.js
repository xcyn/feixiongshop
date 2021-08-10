let Router = require('koa-router')
let appRouter = new Router();

// 模块分层(test相关)
let index = require('./controller/index')

// 用户系统
let user = require('./controller/user')

// 商品创建模块
let goodsB = require('./controller/goods-b')

appRouter.use(index)
appRouter.use(user)
appRouter.use(goodsB)

module.exports = appRouter
