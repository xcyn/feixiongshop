// 主页
const app = getApp()
import Dialog from "@vant/weapp/dialog/dialog";
Page({
  data: {
    address: {},
    isLogin: null,
    userInfo: null,
  },
  onLoad(options) {
    const app = getApp()
    const isLogin = app.globalData.isLogin
    const userInfo = app.globalData.userInfo
    console.log('userInfo', userInfo)
    this.getUserDefaultAddress()
    this.setData({
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
    console.log('res', res)
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
    Dialog.confirm({
      title: '确认下单？',
      message: '一共支付金额为4元',
    })
      .then(() => {
        wx.redirectTo({
          url: `/pages/order-list/index`,
        })
        // on confirm
      })
      .catch(() => {
        // on cancel
      });
  }
})
