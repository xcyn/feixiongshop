// 商品C端接口
let Router = require('koa-router');
const { dbConfig } = require('../config/index');
const { upload2Cdn } = require('../lib/utils');
let database = dbConfig.database;
let appRouter = new Router();

// 创建地址
appRouter.post('/upload', async(ctx, next) => {
    // 上传单个文件
    const file = ctx.request.files.file;
    const res = await upload2Cdn({
      file
    })
    ctx.state.res({
      data: res
    })
})

module.exports = appRouter.routes()
