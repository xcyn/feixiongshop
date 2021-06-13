// 主页
const app = getApp()

Page({
  data: {
    isLogin: true,
    showabout:false
  },
  // 事件处理函数
  bindViewTap() {
  },
  onLoad() {
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
