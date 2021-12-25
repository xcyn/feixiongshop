// 商品C端接口
let Router = require('koa-router');
const { dbConfig } = require('../config/index');
let database = dbConfig.database;
let appRouter = new Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op

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
      isDefault: 0
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
        userId
      }
    }, {transaction: t})
    for(let i = 0; i < curAddress.length; i++) {
      let idIns = curAddress[i].id
      const isDefault = id === idIns
      await addressTable.update({
        isDefault: isDefault || false
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
  console.log(`日志:${userId}获取address数据，结果为: ${address && address[0] && address[0].get()}`);
  if(address && address[0]) {
    address = address[0].get();
    const {
      cityCode,
      counCode,
      provCode
    } = address.region
    console.log(`日志:userId:${userId}获取addressInfo数据，入参数为: cityCode:${cityCode},counCode:${counCode},provCode:${provCode}`);
    let addressInfo = await ctx.state.orm.db(database).table('address-code').select({
      where: {
        cityCode,
        counCode,
        provCode
      }
    })
    console.log(`日志:userId:${userId}获取addressInfo数据，结果为: ${addressInfo && addressInfo[0] && JSON.stringify(addressInfo[0].get())}`);
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

let allAddress = null

// 查询所有地址
appRouter.get('/select-all-address', async(ctx, next) => {
  if(allAddress) {
    ctx.state.res({
      data: allAddress
    })
    return
  }
  let allAddrs = await ctx.state.orm.db(database).table('address-code').select({
    where: {
      id: {
        [Op.gt]: 0
      }
    }
  })
  let province_list = {}
  let city_list = {}
  let county_list = {}
  for(let i = 0; i< allAddrs.length; i++) {
    let item = allAddrs[i]
    if(item) {
      if(item.provCode && !province_list[item.provCode]) {
        province_list[item.provCode] = item.provName
      }
      if(item.cityCode && !city_list[item.cityCode]) {
        city_list[item.cityCode] = item.cityName
      }
      // 支持前端组件处理
      if(!item.counCode) {
        county_list[`${item.cityCode}${i}`] = item.cityName
      } else {
        if(!county_list[item.counCode]) {
          county_list[item.counCode] = item.counName
        }
      }
    }
  }
  const areaList = {
    province_list,
    city_list,
    county_list,
  }
  allAddress = areaList
  ctx.state.res({
    data: areaList
  })
})


module.exports = appRouter.routes()
