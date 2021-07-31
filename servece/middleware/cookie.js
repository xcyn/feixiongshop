module.exports = async (ctx, next) => {
  try {
      const n =  ~~ctx.cookies.get('view') + 1;
      ctx.cookies.set('view', n, { httpOnly: false }); // httpOnly 设置为false， 在客户端才能取出来
      // ctx.session[n] = n
      await next();
  } catch (err) {
      ctx.state.log.error(err)
  }
};
