const request = require("../lib/request")
// 品牌数据
const goodsAttr = [
  {
    "attr_key": "品类",
    "attr_values": ["暂无"]
  },
  {
    "attr_key": "颜色",
    "attr_values": ["红色", "蓝色", "绿色"]
  },
  {
    "attr_key": "尺码",
    "attr_values": ["L", "xL", "xxL"]
  }
]

async function createTable() {
  try {
    let resArr = []
    for(let i=0; i<=goodsAttr.length; i++) {
      let goodVal = goodsAttr[i]
      if(goodVal) {
        const res = await request.post({
          url: 'http://localhost:3299/goods/create-skuBreed', 
          data: goodVal
        })
        resArr.push(res)
      }
    }
    console.log(`成功创建${resArr.length}条,sku-key和sku-val数据:${resArr}`)
  } catch (error) {
    console.log('创建sku-key表和sku-val失败!!!')
  }
}

module.exports = {
  createTable
}

