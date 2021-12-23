const koa = require('koa');
// 系统中间件
const koaBody = require('koa-body')
const session = require('koa-session')
const store = require('koa-session-local')
const koajwt = require('koa-jwt');
const jsonwebtoken = require('jsonwebtoken');
const appRoute = require('./routes')
const serve = require('koa-static-server')
// 定义全局路径
global.APP_PATH = __dirname

// 业务中间件
let log = require('./middleware/log');
let cross = require('./middleware/cross');
let response = require('./middleware/response');
let catchError = require('./middleware/catch-error')
let orm = require('./middleware/orm')
let cookie = require('./middleware/cookie')

const JWT_SECRET = 'JWT_SECRET'


const app = new koa();
app.use(koaBody({"multipart": true}))
app.use(log)
app.use(cross)
app.use(response)
app.use(catchError)
// 鉴权
app.use(koajwt({ secret: JWT_SECRET}).unless(
     {
          path: [
               '/user/wx-login',
               '/user/login', 
               '/user/wexin-login2',
               '/ormTest',
               '/addOrmTest',
               '/test',
               /^\/goods\/*/,
               /^\/fxapi\/*/
          ]
     })
)
// orm
app.use(orm)
app.use(serve({rootDir: 'public', rootPath: '/public'}))
app.use(appRoute.routes())
app.use(appRoute.allowedMethods());
 
app.listen(3299,() => {
     console.log('服务开始运行，端口为3299')
});
