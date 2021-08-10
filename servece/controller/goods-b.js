// 商品B端接口
let Router = require('koa-router');
const { dbConfig } = require('../config/index');
const { get_spu_no } = require('../lib/utils')
let database = dbConfig.database;
let appRouter = new Router({
  prefix: '/goods'
});

// 创建品牌
appRouter.post('/create-brand', async(ctx, next) => {
  let { brand_name } = ctx.request.body
  let brand = await ctx.state.orm.db(database).table('brand').findOrCreate({
    where: {
      brand_name: brand_name
    }
  })
  ctx.state.res({
    data: brand[0]
  })
})

// 创建商品分类
appRouter.post('/create-goods-category', async(ctx, next) => {
  let { category_name } = ctx.request.body
  let category = await ctx.state.orm.db(database).table('goods-category').findOrCreate({
    where: {
      category_name: category_name
    }
  })
  ctx.state.res({
    data: category[0]
  })
})

// 创建商品(商品表 + 商品详情表)
appRouter.post('/create-goods', async(ctx, next) => {
  let { 
    goods_name,
    goods_desc,
    start_price,
    category_id,
    brand_id,
    content
  } = ctx.request.body
  const sequelize = await ctx.state.orm.db(database).sequelize()
  // 开启事务
  let t = await sequelize.transaction()
  try {
    // 生产商品编码
    const spu_no = get_spu_no(brand_id, category_id)
    const Goods = await ctx.state.orm.db(database).table('goods').getTable('goods', sequelize)
    await Goods.sync({ force: false }); //创建表
    let goods = await Goods.create({
      spu_no,
      goods_name,
      goods_desc,
      start_price,
      category_id,
      brand_id
    }, {transaction: t})
    let res = await ctx.state.orm.db(database).table('goods-info').findOrCreate({
      where: {
        goods_id: String(goods.id),
        content: content
      }
    }, { transaction: t })
    t.commit();
    ctx.state.res({
      data: {
        goods: goods,
        goodsInfo: res[0]
      }
    })
  } catch (error) {
    t.rollback();
    ctx.state.res({
      errno: 1000,
      errmsg: "创建商品失败",
    })
  }
})

module.exports = appRouter.routes()
