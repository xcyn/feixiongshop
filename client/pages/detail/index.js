// 主页
const app = getApp()
const qs = require('qs')

Page({
  data: {
    isLogin: app.globalData.isLogin,
    goodId: '',
    show: false,
    goodsInfo: {}
  },
  onLoad(options) {
    this._init(options);
    app.globalEvent.on('loginSuccess', () => {
      this.setData({
        isLogin: app.globalData.isLogin
      })
    })
  },
  _init(options) {
    let goodId = JSON.parse(options.goodId);
    this.setData({
      goodId
    })
    this.getGoodsDetail()
  },
  async getGoodsDetail() {
    const { goodId } = this.data
    const res = await app.request({
      url: '/goods-c/select-goodInfo',
      method: 'get',
      data:{
        goods_id: goodId
       }
    })
    if(res.errno === 0) {
      let goods = res.data && res.data.goods
      // 寻找sku，默认选中第一个，
      if(goods.sku && goods.sku.length > 0) {
        let copySku = JSON.parse(JSON.stringify(goods.sku))
        for(let k = 0; k < copySku.length; k++) {
          copySku[k].checked = true
          if(copySku[k].models[0]) {
            copySku[k].models[0].checked = true
          }
        }
        goods.sku = copySku
        goods = this._updatePriceStockFromSku(goods)
      }
      this.setData({
        goodsInfo: goods || []
      })
    }
  },
  // 通过选中的价格，更新price和stock
  _updatePriceStockFromSku(goods) {
    if(!goods) {
      return goods
    }
    if(goods.sku && goods.sku.length > 0) {
      let skuMap = goods.skuMap
      let skuMapKey = ''
      for(let k = 0; k < goods.sku.length; k++) {
        let skuItem = goods.sku[k];
        if(skuItem.checked) {
          if(!k) {
            skuMapKey = skuItem.id
          } else {
            skuMapKey = `${skuMapKey}|${skuItem.id}`
          }
        }
        let models = skuItem.models;
        for(let j = 0; j < models.length; j++) {
          let modelItem = models[j];
          if(modelItem.checked) {
            skuMapKey = `${skuMapKey}:${modelItem.skuId}`
          }
        }
      }
      if(skuMapKey) {
        let skuInfo = skuMap[skuMapKey]
        goods.start_price = skuInfo.price
        goods.stock = skuInfo.stock
      }
    }
    return goods;
  },
  // 选择sku
  handleCheckSku(e) {
    let item = e.currentTarget.dataset.item
    let id = e.currentTarget.dataset.id
    if(item) {
      let { goodsInfo } = this.data
      let copySku = JSON.parse(JSON.stringify(goodsInfo.sku))
      for(let k = 0; k < copySku.length; k++) {
        let skuItem = copySku[k]
        for(let j = 0; j < copySku[k].models.length; j++) {
          let modelItem = copySku[k].models[j]
          // 同级处理
          if(+id === +skuItem.id) {
            if(modelItem && modelItem.skuId === item.skuId) {
              copySku[k].models[j].checked = true
            } else {
              copySku[k].models[j].checked = false
            }
          }
        }
      }
      goodsInfo.sku = copySku
      goodsInfo = this._updatePriceStockFromSku(goodsInfo)
      this.setData({
        goodsInfo: goodsInfo || []
      })
    }
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  getCheckedSku() {
    const { goodsInfo, goodId } = this.data
    let sku = goodsInfo && goodsInfo.sku || []
    let skuMapKey = ''
    sku.map((item, key) => {
      if(!!item.checked) {
        let models = item.models || []
        models.map(model => {
          if(!!model.checked) {
            let curKey = `${item.id}:${model.skuId}`
            if(key === 0) {
              skuMapKey = curKey
            } else {
              skuMapKey = `${skuMapKey}|${curKey}`
            }
          }
        })
      }
    })
    let skuMap = goodsInfo && goodsInfo.skuMap || {}
    let checkedSkuMapItem = skuMap[skuMapKey] || {}
    console.log('goodsInfo', goodsInfo)
    let num = 1 // 目前是写死的一个
    return {
      totalFee: (checkedSkuMapItem.price && checkedSkuMapItem.price * num || goodsInfo.start_price) || 0,
      skuInfo: skuMapKey,
      goodId: goodId,
      num: num,
      price: checkedSkuMapItem.price || goodsInfo.start_price,
      desc: goodsInfo.goods_desc,
      title: goodsInfo.goods_name,
      thumb: goodsInfo.info && goodsInfo.info.content && goodsInfo.info.content.carousels && goodsInfo.info.content.carousels[0]
    }
  },
  // 跳转确认订单
  handleBuy() {
    const info = this.getCheckedSku()
    console.log('info', info)
    if(info && info.goodId && info.skuInfo) {
      const urlParmas = qs.stringify(info)
      wx.navigateTo({
        url: `/pages/order/index?${urlParmas}`,
      })
      this.onClose()
    } else {
      if(info) {
        const urlParmas = qs.stringify(info)
        wx.navigateTo({
          url: `/pages/order/index?${urlParmas}`,
        })
      } else {
        app.wxp.showToast({
          title: '购买失败,请联系管理员',
          icon:'error'
        })
      }
    }

  },
})
