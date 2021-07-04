// 标准化返回格式
module.exports = async (ctx, next) => {
  ctx.state.res = ({ errno = 0, errmsg = '', data = null }) => {
    ctx.body = {
      errno,
      errmsg,
      data
    }
  }
  await next();
}