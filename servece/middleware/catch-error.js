module.exports = (ctx, next) => {
  return next().catch(err => {
    console.log('err', err)
    // 处理鉴权
    if(err && err.status === 401) {
      ctx.state.res({
        errno: 401,
        errmsg: '登录失效，请重新授权登录',
        data: ''
      })
    } else if(err === 'jwt expired') {
      ctx.state.res({
        errno: 401,
        errmsg: '登录失效，请重新授权登录',
        data: ''
      })
    } else {
      ctx.state.log = {
        error: err.dltag,
        info: err.logData,
      }
      ctx.state.res({
        errno: 1000,
        errmsg: err.message,
        data: err.response
      })
    }
  })
}