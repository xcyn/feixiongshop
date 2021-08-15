// 商品C端接口
let Router = require('koa-router');
let Address = require('./address');
const { dbConfig } = require('../config/index');
let database = dbConfig.database;
let appRouter = new Router({
  prefix: '/goods-c'
});

// 地址
appRouter.use(Address)


module.exports = appRouter.routes()
