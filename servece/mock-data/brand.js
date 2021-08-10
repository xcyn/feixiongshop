const request = require("../lib/request")
// 品牌数据
const brands = [{
  "brand_name": "飞熊商城"
},{
  "brand_name": "飞熊网"
}]

async function createTable() {
  try {
    let resArr = []
    for(let i=0; i<=brands.length; i++) {
      let brand = brands[i]
      if(brand) {
        const res = await request.post({
          url: 'http://localhost:3099/goods/create-brand', 
          data: brand
        })
        resArr.push(res)
      }
    }
    console.log(`成功创建${resArr.length}条,brand表数据:${resArr}`)
  } catch (error) {
    console.log('创建brand表失败!!!')
  }
}

module.exports = {
  createTable
}