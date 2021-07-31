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
app.use(koajwt({ secret: JWT_SECRET}).unless(
     {
          path: [
               '/user/wx-login',
               '/user/login', 
               '/user/wexin-login2',
               '/ormTest',
               '/test'
          ]
     })
)
app.use(orm)
// app.use(cookie)
app.keys=['koakeys'];
const seesionConfig = {
     store: new store(),
     key: 'koa:sess',   //cookie key (default is koa:sess)
     maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
     autoCommit: true,
     overwrite: true,  //是否可以overwrite    (默认default true)
     httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
     signed: true,   //签名默认true
     rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
     renew: false,  //(boolean) renew session when session is nearly expired,
     secure: false, // 加密cookie
     sameSite: null
}
app.use(session(seesionConfig, app));
app.use(serve({rootDir: 'public', rootPath: '/public'}))
app.use(appRoute.routes())
app.use(appRoute.allowedMethods());
 
app.listen(3099,() => {
     console.log('服务开始运行，端口为3099')
});
