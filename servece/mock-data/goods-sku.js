const request = require("../lib/request")
// 商品数据
const skus = [
  {
    goods_id: "1",
    goods_attr_path: ['1:1'],
    goods_sku_desc: "品类-暂无",
    price: "1.00",
    stock: 11
  },
  {
    goods_id: "2",
    goods_attr_path: ['2:2','2:3'],
    goods_sku_desc: "品类-暂无|颜色-红色|颜色-蓝色",
    price: "2.00",
    stock: 12
  },
  {
    goods_id: "2",
    goods_attr_path: ['2:4'],
    goods_sku_desc: "颜色-绿色",
    price: "3.00",
    stock: 15
  },
  {
    goods_id: "2",
    goods_attr_path: ['3:5','3:6'],
    goods_sku_desc: "尺码-L|尺码-xL",
    price: "2.00",
    stock: 16
  },
  {
    goods_id: "3",
    goods_attr_path: ['2:2','2:3'],
    goods_sku_desc: "品类-暂无|颜色-红色|颜色-蓝色",
    price: "4.00",
    stock: 10
  }
]

async function createTable() {
  try {
    let resArr = []
    for(let i=0; i<=skus.length; i++) {
      let sku = skus[i]
      if(sku) {
        const res = await request.post({
          url: 'http://localhost:3099/goods/create-goods-sku', 
          data: sku
        })
        resArr.push(res)
      }
    }
    console.log(`成功创建${resArr.length}条,sku数据:${resArr}`)
  } catch (error) {
    console.log('创建sku表失败!!!')
  }
}

module.exports = {
  createTable
}
