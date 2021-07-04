const koa = require('koa');
// 系统中间件
const koaBody = require('koa-body')
const appRoute = require('./routes')
const serve = require('koa-static-server')
// 定义全局路径
global.APP_PATH = __dirname

// 业务中间件
let log = require('./middleware/log');
let cross = require('./middleware/cross');
let response = require('./middleware/response');
let catchError = require('./middleware/catchError')
let orm = require('./middleware/orm')


const app = new koa();
app.use(koaBody({"multipart": true}))
app.use(log)
app.use(cross)
app.use(response)
app.use(catchError)
app.use(orm)
app.use(serve({rootDir: 'public', rootPath: '/public'}))
app.use(appRoute.routes())
app.use(appRoute.allowedMethods());
 
app.listen(3099,() => {
     console.log('服务开始运行，端口为3099')
});
