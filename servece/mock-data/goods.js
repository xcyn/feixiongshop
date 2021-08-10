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
        "0": "http://pan.iqiyi.com/file/reliao/xY5hJsGqH_MLySEjooWKhfy-hTLDj5UXeU6r7OI_vFXEYo_w2ngqN300ODZyJmkIHA5snvsdQE4kzrijYNrhXA.png",
        // "1": "http://pan.iqiyi.com/file/reliao/gynfOye0n7NcNYCBMpUifUrBfVNsUZUGW101pAxast3yuNl-F70cTRPya94WR0EovZbs9428dEpT0hTbSwERvg.png"
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
        0: "http://pan.iqiyi.com/file/reliao/Uq1YyYQ7DGLkYnAsbsIM9Mz6b179xvJltaSFds7EISg5fqDfDegsqcMRxEd41wdk1NV8ztMvEIsfWpAeLjDL1Q.png"
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
        0: "http://pan.iqiyi.com/file/reliao/HpW_VML6nCGOkm4d-cZtUPYsRlb3rwcmfj6TYcuYD1kY2FECrk8AlsfTm-y2QZ9CK9rnobIB_NUbuTv4fTsHtw.png"
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
          url: 'http://localhost:3099/goods/create-goods', 
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