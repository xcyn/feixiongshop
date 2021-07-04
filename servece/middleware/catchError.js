module.exports = (ctx, next) => {
  return next().catch(err => {
    ctx.state.log = {
      error: err.dltag,
      info: err.logData,
    }
    ctx.state.res({
      errno: 1000,
      errmsg: err.message,
      data: err.response
    })
  })
}