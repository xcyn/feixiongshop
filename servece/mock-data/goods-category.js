const request = require("../lib/request")
// 品牌数据
const categorys = [
  // 不指定分类，到默认分类
  {
    category_name: '默认分类'
  },
  {
    category_name: '首页轮播图'
  }, 
  {
    category_name: '首页推荐'
  }
]

async function createTable() {
  try {
    let resArr = []
    for(let i=0; i<=categorys.length; i++) {
      let category = categorys[i]
      if(category) {
        const res = await request.post({
          url: 'http://localhost:3099/goods/create-goods-category', 
          data: category
        })
        resArr.push(res)
      }
    }
    console.log(`成功创建${resArr.length}条,goods-category表数据:${resArr}`)
  } catch (error) {
    console.log('创建goods-category表失败!!!')
  }
}

module.exports = {
  createTable
}