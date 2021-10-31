const app = getApp()
// 主页
import Dialog from "@vant/weapp/dialog/dialog";
Page({
  data: {
    isLogin: null,
    userInfo: null,
  },
  onLoad(options) {
    const isLogin = app.globalData.isLogin
    const userInfo = app.globalData.userInfo
    console.log('userInfo', userInfo)
    this.setData({
      isLogin: isLogin,
      userInfo: userInfo
    })
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
