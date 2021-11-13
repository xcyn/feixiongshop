// 商品C端接口
let Router = require('koa-router');
const { Op } = require("sequelize");
const { dbConfig } = require('../config/index');
const _ = require('lodash');
let database = dbConfig.database;
let appRouter = new Router({
  prefix: '/goods-c'
});


// 地址
const address = require('./address');
appRouter.use(address);
// 上传
const upload = require('./upload');
appRouter.use(upload);
// 订单
const order = require('./order');
appRouter.use(order);

// 通过分组查询商品列表
appRouter.get('/select-goodList-category', async(ctx, next) => {
  let { 
    category_id
   } = ctx.query
  //  表关联声明
  const goodModel = await ctx.state.orm.db(database).model('goods');
  const goodsCategoryMapModel = await ctx.state.orm.db(database).model('goods-category-map');
  const goodsInfoModel = await ctx.state.orm.db(database).model('goods-info');
  goodsCategoryMapModel.belongsTo(goodsInfoModel, {foreignKey: 'goods_id', targetKey: 'goods_id', as: 'info'});
  goodsCategoryMapModel.belongsTo(goodModel, {foreignKey: 'goods_id', targetKey: 'id'});

  const goodsDb = await goodsCategoryMapModel.findAll({
    where: {
      category_id,
    },
    include: [{
      model: goodModel,
      attributes: { exclude: ['createdAt', 'updatedAt']}
    },{
      model: goodsInfoModel,
      attributes: { exclude: ['createdAt', 'updatedAt']},
      as: 'info'
    }],
    attributes: { exclude: ['createdAt', 'updatedAt', 'category_id', 'goods_id'] }
  })
  let goods = []
  goodsDb.map(item => {
    if(item.good) {
      let good = item.good.get()
      let info = item.info
      if(info) {
        // 取轮播第一张图片
        let url = info.content && info.content.carousels && info.content.carousels[0]
        good.url = url
      }
      goods.push(good)
    }
  })
  ctx.state.res({
    data: goods
  })
})


// 通过商品id查详情
appRouter.get('/select-goodInfo', async(ctx, next) => {
  let { 
    goods_id
   } = ctx.query

  //  表关联声明
  const goodModel = await ctx.state.orm.db(database).model('goods');
  const goodsInfoModel = await ctx.state.orm.db(database).model('goods-info');
  const goodsSkuModel = await ctx.state.orm.db(database).model('goods-sku');
  goodModel.hasOne(goodsInfoModel, {foreignKey: 'goods_id', targetKey: 'id', as: 'info'});
  goodModel.hasMany(goodsSkuModel, {foreignKey: 'goods_id', targetKey: 'id', as: 'sku'});
  let goods = await goodModel.findOne({
    where: {
      id: goods_id
    },
    include: [{ 
      model: goodsInfoModel,
      attributes: ['content'],
      as: 'info'
    },{ 
      model: goodsSkuModel,
      as: 'sku',
      attributes: ['id', 'goods_id', 'goods_attr_path', 'price', 'stock'],
    }],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    returning: true
  })
  if(goods && goods.sku && goods.sku.length) {
    // 后续可用redis优化
    const goodsAttrKeyModel = await ctx.state.orm.db(database).model('goods-attr-key');
    const goodsAttrValueModel = await ctx.state.orm.db(database).model('goods-attr-value');
    goodsAttrKeyModel.hasMany(goodsAttrValueModel, {foreignKey: 'attr_key_id', targetKey: 'id', as: 'values'});
    const goodAttrMap = await goodsAttrKeyModel.findAll({
      where: {
        id: {
          [Op.gt]: 0
        }
      },
      include: [{ 
        model: goodsAttrValueModel,
        attributes: ['id', 'attr_value', 'attr_key_id'],
        as: 'values'
      }],
      attributes: ['id', 'attr_key'],
    })
    // 生成arrtMap
    let keyMap = {}
    let valMap = {}
    if(goodAttrMap && goodAttrMap.length) {
      goodAttrMap.map(item => {
        if(item && !keyMap[item.id]) {
          keyMap[item.id] = item.attr_key
          if(item.values && item.values.length) {
            item.values.map(valItem => {
              if(valItem && !valMap[`${item.id}|${valItem.id}`]) {
                valMap[`${item.id}|${valItem.id}`] = valItem.attr_value
              }
            })
          }
        }
      })
    }
    let skuMap = {}
    // 映射前端方便可用的数据结构
    let sku = goods.sku
    let skuClient = []
    if(sku && sku.length) {
      sku.map(skuItem => {
        let skuPath = skuItem.goods_attr_path
        let skuMapKey = skuPath.join('|')
        if(!skuMap[skuMapKey]) {
          skuMap[skuMapKey] = {
            price: skuItem.price,
            stock: skuItem.stock
          }
        }
        
        skuPath.map(pathItem => {
          let attrAll = pathItem.split(':')
          if(!attrAll || attrAll.length !==2) {
            throw new Error('sku表数据有误')
          }
          let skuKey = attrAll[0]
          let skuVal = attrAll[1]
          const hasSkuKey = _.findIndex(skuClient, (o)=> o.id === skuKey);
          if(hasSkuKey !== -1) {
            const hasModelKey = _.findIndex(skuClient[hasSkuKey].models, (o)=> o.skuId === skuVal);
            if(hasModelKey === -1) {
              skuClient[hasSkuKey].models.push({
                skuId: skuVal,
                skuName: valMap[`${skuKey}|${skuVal}`]
              })
            }
          } else {
            skuClient.push({
              id: skuKey,
              name: keyMap[skuKey],
              models: [{
                skuId: skuVal,
                skuName: valMap[`${skuKey}|${skuVal}`]
              }]
            })
          }
        })
      })
    }
    goods = goods.get();
    goods['sku'] = skuClient
    goods['skuMap'] = skuMap
    ctx.state.res({
      data: {
        goods: goods
      }
    })
    return
  }
  ctx.state.res({
    data: {
      goods
    }
  })

})



module.exports = appRouter.routes()
