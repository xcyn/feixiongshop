// 主页
const app = getApp()

Page({
  data: {
    isLogin: app.globalData.isLogin,
    userInfo: app.globalData.userInfo,
    showabout:false
  },
  // 事件处理函数
  bindViewTap() {
  },
  onLoad() {
    app.globalEvent.on('loginSuccess', () => {
      this.setData({
        isLogin: app.globalData.isLogin,
        userInfo: app.globalData.userInfo
      })
    })
  },
  onUnload() {
    app.globalEvent.off('loginSuccess')
  },
  // 关于我们
  handleAboutAs() {
    this.setData({ showabout: true });
  },
  handleCloseAbout() {
    this.setData({ showabout: false });
  },
  handleGoOrderList() {
    wx.navigateTo({
      url: `/pages/order-list/index`,
    })
  },
  handleGoAddress() {
    wx.navigateTo({
      url: `/pages/address-list/index`,
    })
  }
})
