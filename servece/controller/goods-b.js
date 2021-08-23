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

// 创建商品分类关系表
appRouter.post('/create-goods-category-map', async(ctx, next) => {
  let { category_id, goods_id } = ctx.request.body
  let categoryMaps = await ctx.state.orm.db(database).table('goods-category-map').findOrCreate({
    where: {
      category_id: category_id,
      goods_id: goods_id
    },
    data: {
      category_id: category_id,
      goods_id: goods_id
    }
  })
  ctx.state.res({
    data: categoryMaps[0]
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


// 创建sku类型表（sku-key表 + sku-val表）
appRouter.post('/create-skuBreed', async(ctx, next) => {
  let { 
    attr_key,
    attr_values
  } = ctx.request.body
  const sequelize = await ctx.state.orm.db(database).sequelize()
  // 开启事务
  let t = await sequelize.transaction()
  try {
    const SkuKey = await ctx.state.orm.db(database).table('goods-attr-key').getTable('goods-attr-key', sequelize)
    await SkuKey.sync({ force: false }); //创建表
    let skuKeyRes = await SkuKey.create({
      attr_key
    }, {transaction: t})
    const SkuVal = await ctx.state.orm.db(database).table('goods-attr-value').getTable('goods-attr-value', sequelize)
    await SkuVal.sync({ force: false }); //创建表
    let skuValArr = []
    for(let k = 0; k < attr_values.length; k++) {
      let attrVal = attr_values[k]
      let res = await SkuVal.create({
        attr_key_id: String(skuKeyRes.id),
        attr_value: attrVal
      }, {transaction: t})
      if(res) {
        skuValArr.push(res)
      }
    }
    t.commit();
    ctx.state.res({
      data: {
        skuKey: skuKeyRes,
        skuVal: skuValArr
      }
    })
  } catch (error) {
    t.rollback();
    ctx.state.res({
      errno: 1000,
      errmsg: `创建sku品类失败:${error}`,
    })
  }
})


// 创建sku
appRouter.post('/create-goods-sku', async(ctx, next) => {
  let { 
    goods_id,
    goods_attr_path,
    goods_sku_desc,
    price,
    stock
   } = ctx.request.body
  let sku = await ctx.state.orm.db(database).table('goods-sku').findOrCreate({
    where: {
      goods_id,
      goods_attr_path,
      goods_sku_desc,
      price,
      stock
    }
  })
  ctx.state.res({
    data: sku[0]
  })
})

// 创建中国国家行政区划及行政编码接口
appRouter.post('/create-address-code', async(ctx, next) => {
  let { 
    provName,
    provCode,
    cityName,
    cityCode,
    counName,
    counCode,
   } = ctx.request.body
  let addressCodeRes = await ctx.state.orm.db(database).table('address-code').findOrCreate({
    where: {
      provName,
      provCode,
      cityName,
      cityCode,
      counName,
      counCode
    }
  })
  ctx.state.res({
    data: addressCodeRes[0]
  })
})



module.exports = appRouter.routes()
