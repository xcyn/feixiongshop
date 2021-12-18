const request = require("../lib/request")
// 商品数据
const goods =  [
  {
    // spu_no 组成: brandId(2位) + 分类Id(四位) + yyyyMMddHHmmss + uuid(30位)
    "goods_name": "前端入门课",
    "goods_desc": "带你成为前端工程师",
    "start_price": "1.00",
    "category_id": "1",
    "brand_id": "1",
    "content": {
      "carousels": {
        "0": "",
      },
      "activity": "具体价格优惠，请联系客服。微信号: 18811742305"
    }
  },
  {
    // spu_no 组成: brandId(2位) + 分类Id(四位) + yyyyMMddHHmmss + uuid(30位)
    "goods_name": "前端框架vue",
    "goods_desc": "让我们成为企业级开发人才",
    "start_price": "2.00",
    "category_id": "2",
    "brand_id": "1",
    "content": {
      "carousels": {
        0: ""
      },
      "activity": "具体价格优惠，请联系客服。微信号: 18811742305"
    }
  },
  {
    // spu_no 组成: brandId(2位) + 分类Id(四位) + yyyyMMddHHmmss + uuid(30位)
    "goods_name": "跟着架构师学shell",
    "goods_desc": "让你成为懂shell的前端",
    "start_price": "3.00",
    "category_id": "3",
    "brand_id": "2",
    "content": {
      "carousels": {
        0: ""
      },
      "activity": "具体价格优惠，请联系客服。微信号: 18811742305"
    }
  },
]

async function createTable() {
  try {
    let resArr = []
    for(let i=0; i<=goods.length; i++) {
      let good = goods[i]
      if(good) {
        const res = await request.post({
          url: 'http://localhost:3299/goods/create-goods', 
          data: good
        })
        resArr.push(res)
      }
    }
    console.log(`成功创建${resArr.length}条,goods和goods-info数据:${resArr}`)
  } catch (error) {
    console.log('创建goods表和goods-info失败!!!')
  }
}

module.exports = {
  createTable
}