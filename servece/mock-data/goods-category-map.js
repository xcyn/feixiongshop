const request = require("../lib/request")
// 品牌数据
const categoryMaps = [
  // 不指定分类，到默认分类
  {
    category_id: 1,
    goods_id: 1
  },
  {
    category_id: 1,
    goods_id: 2
  }, 
  {
    category_id: 2,
    goods_id: 1
  },
  {
    category_id: 2,
    goods_id: 3
  },
  {
    category_id: 3,
    goods_id: 3
  }
]

async function createTable() {
  try {
    let resArr = []
    for(let i=0; i<=categoryMaps.length; i++) {
      let category = categoryMaps[i]
      if(category) {
        const res = await request.post({
          url: 'http://localhost:3099/goods/create-goods-category-map', 
          data: category
        })
        resArr.push(res)
      }
    }
    console.log(`成功创建${resArr.length}条,goods-category-map表数据:${resArr}`)
  } catch (error) {
    console.log('创建goods-category表失败!!!', error)
  }
}

createTable()

module.exports = {
  createTable
}