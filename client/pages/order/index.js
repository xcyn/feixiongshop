// 主页
const app = getApp()
const qs = require('qs');
import Dialog from "@vant/weapp/dialog/dialog";
Page({
  data: {
    address: {},
    isLogin: null,
    userInfo: null,
  },
  onShow() {
    this.getUserDefaultAddress()
  },
  onLoad(options) {
    const app = getApp()
    const isLogin = app.globalData.isLogin
    const userInfo = app.globalData.userInfo
    this.getUserDefaultAddress()
    let goodInfoBriefs = []
    let goodInfoBrief = qs.parse(options).goodInfoBrief
    goodInfoBrief.desc = decodeURIComponent(goodInfoBrief.desc)
    goodInfoBrief.title = decodeURIComponent(goodInfoBrief.title)
    goodInfoBrief.thumb = decodeURIComponent(goodInfoBrief.thumb)
    if(goodInfoBrief) {
      goodInfoBriefs.push(goodInfoBrief)
    }
    // 生成购物车数据 (目前只有详情页过来的数据)
    let goodsCartsIds = [
      {
        goodId: options.goodId,
        skuInfo: decodeURIComponent(qs.parse(options).skuInfo || '').split('|'),
        goodInfoBrief,
      }
    ]
    this.setData({
      totalFee: options.totalFee,
      goodInfoBriefs,
      goodsCartsIds,
      isLogin: isLogin,
      userInfo: userInfo
    })
  },
  async getUserDefaultAddress() {
    const userInfo = app.globalData.userInfo
    const res = await app.request({
      url: '/goods-c/get-user-default-address',
      method: 'get',
      data:{
        userId: userInfo.id
       }
    })
    if(res && res.data) {
      this.setData({
        address: res.data || {}
      })
    }
  },
  showPopup() {
  },
  onClose() {
  },
  handleGoAddress() {
    wx.navigateTo({
      url: `/pages/address-list/index`,
    })
  },
  // 下单
  handleSubmit() {
    const { openId, id } = this.data.userInfo
    const { address, totalFee, goodsCartsIds, goodInfoBriefs } = this.data
    let addressDesc = '地址详情备注' //先写死，后面再开发
    if(!address) {
      app.wxp.showToast({
        title: '请选择地点...',
        icon:'error'
      })
      return
    }
    let addressId = address.id
    let goodsNameDesc = goodInfoBriefs[0].desc
    console.log('下单数据:openId',openId)
    console.log('下单数据:userId',id)
    console.log('下单数据:addressId', addressId)
    console.log('下单数据:totalFee', totalFee)
    console.log('下单数据:addressDesc', addressDesc)
    console.log('下单数据:goodsCartsIds', goodsCartsIds)
    console.log('下单数据:goodsNameDesc', goodsNameDesc)
    if(!addressId) {
      app.wxp.showToast({
        title: '请选择地址',
        icon:'error'
      })
      return
    }
    Dialog.confirm({
      title: '确认下单？',
      message: `一共支付金额为${totalFee}元`,
    })
      .then(async() => {
        const res = await app.request({
          url: '/goods-c/create-order',
          method: 'post',
          data:{
            openId: openId,
            userId: id,
            addressId: addressId,
            totalFee: totalFee,
            addressDesc: addressDesc,
            goodsCartsIds: goodsCartsIds,
            goodsNameDesc: goodsNameDesc
           }
        })
        console.log('res', res)
        let payParmas = res && res.data && res.data.params || {}
        console.log('payParmas', payParmas)
        wx.requestPayment({
          nonceStr: payParmas.nonceStr,
          package: payParmas.package,
          paySign: payParmas.paySign,
          timeStamp: payParmas.timeStamp,
          signType: 'MD5',
          success: async(res) => {
            if(res && res.errMsg === 'requestPayment:ok') {
              app.wxp.showToast({
                title: '支付成功',
              })
              // 跳转支付成功列表
              wx.redirectTo({
                url: `/pages/order-list/index`,
              })
            } else {
              app.wxp.showToast({
                title: '支付失败',
                icon:'error'
              })
              // 跳转未支付列表
              wx.redirectTo({
                url: `/pages/order-list/index`,
              })
            }
          },
          fail: (err) => {
            console.log('err', err)
          }
        })
        console.log('payRes', payRes)
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
  }
})
