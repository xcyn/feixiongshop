// 商品C端接口
let Router = require('koa-router');
const { dbConfig } = require('../config/index');
let database = dbConfig.database;
let appRouter = new Router();

// 获取地址
appRouter.get('/select-address-item', async(ctx, next) => {
  let {
    cityCode,
    counCode,
    provCode
   } = ctx.query
  if(!cityCode || !counCode || !provCode) {
    throw new Error('获取地址失败，参数有误')
  } 
  let address = await ctx.state.orm.db(database).table('address-code').select({
    where: {
      cityCode,
      counCode,
      provCode
    }
  })
  ctx.state.res({
    data: address && address[0] || null
  })
})

// 创建地址
appRouter.post('/create-address', async(ctx, next) => {
  let { 
    userId,
    userName,
    telNumber,
    region,
    detailInfo,
    isDefault
   } = ctx.request.body
   if(!region || !region.provCode || !region.cityCode || !region.counCode) {
    throw new Error('创建地址失败，参数有误')
   }
  let address = await ctx.state.orm.db(database).table('address').findOrCreate({
    where: {
      userId,
      userName,
      telNumber,
      region,
      detailInfo,
      isDefault
    }
  })
  ctx.state.res({
    data: address[0]
  })
})

// 删除地址
appRouter.post('/delete-address', async(ctx, next) => {
  let { 
    userId,
    userName,
    telNumber,
    region,
    detailInfo,
   } = ctx.request.body
  let address = await ctx.state.orm.db(database).table('address').destroy({
    where: {
      userId,
      userName,
      telNumber,
      region,
      detailInfo,
    }
  })
  ctx.state.res({
    data: address[0]
  })
})

// 编辑地址
appRouter.post('/update-address', async(ctx, next) => {
  let { 
    userId,
    userName,
    telNumber,
    region,
    detailInfo,
   } = ctx.request.body
  let address = await ctx.state.orm.db(database).table('address').update({
    data: {
      userId,
      userName,
      telNumber,
      region,
      detailInfo,
    },
    where: {
      userId,
      userName,
      region
    }
  })
  ctx.state.res({
    data: address[0]
  })
})

// 编辑默认地址
appRouter.post('/update-default-address', async(ctx, next) => {
  let { 
    userId,
    telNumber,
    id
  } = ctx.request.body
  const sequelize = await ctx.state.orm.db(database).sequelize()
  // 开启事务
  let t = await sequelize.transaction()
  try {
    const addressTable = await ctx.state.orm.db(database).table('address').getTable('address', sequelize)
    await addressTable.sync({ force: false }); //创建表
    let curAddress = await addressTable.findAll({
      where: {
        userId,
        telNumber,
      }
    }, {transaction: t})
    for(let i = 0; i < curAddress.length; i++) {
      let idIns = curAddress[i].id
      const isDefault = id === idIns
      await addressTable.update({
        isDefault: isDefault
      }, {
        where: {
          id: idIns
        }
      });
    }
    t.commit();
    ctx.state.res({
      data: {
        curAddress
      }
    })
  } catch (error) {
    t.rollback();
    ctx.state.res({
      errno: 1000,
      errmsg: `更新默认地址:${error}`,
    })
  }
})

// 获取默认地址
appRouter.get('/get-user-default-address', async(ctx, next) => {
  let {
    userId
   } = ctx.query
  let address = await ctx.state.orm.db(database).table('address').select({
    where: {
      isDefault: true,
      userId
    }
  })
  if(address && address[0]) {
    address = address[0].get();
    const {
      cityCode,
      counCode,
      provCode
    } = address.region
    let addressInfo = await ctx.state.orm.db(database).table('address-code').select({
      where: {
        cityCode,
        counCode,
        provCode
      }
    })
    if(addressInfo && addressInfo[0]) {
      addressInfo = addressInfo[0].get()
    } else {
      throw new Error('请求失败')
    }
    address.provName = addressInfo.provName
    address.cityName = addressInfo.cityName
    address.counName = addressInfo.counName
    address.address = `${addressInfo.provName}${addressInfo.cityName}${addressInfo.counName}`
    ctx.state.res({
      data: address
    })
  } else {
    throw new Error('请求失败')
  }
})

// 查询地址
appRouter.get('/select-user-address', async(ctx, next) => {
  let { 
    userId
   } = ctx.query
  let address = await ctx.state.orm.db(database).table('address').select({
    where: {
      userId
    }
  })
  ctx.state.res({
    data: address
  })
})


module.exports = appRouter.routes()
