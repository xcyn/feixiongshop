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
    this._init()
    app.globalEvent.on('loginSuccess', () => {
      this._init()
    })
  },
  _init() {
    const isLogin = app.globalData.isLogin
    const userInfo = app.globalData.userInfo
    this.setData({
      isLogin: isLogin,
      userInfo: userInfo
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
  handleGoOrderList(ev) {
    const status = ev.currentTarget.dataset.id
    if(status) {
      wx.navigateTo({
        url: `/pages/order-list/index?status=${status}`,
      })
    } else {
      app.wxp.showToast({
        title: '数据有误',
        icon:'error'
      })
    }
  },
  // 售后
  handleGoSale() {
    app.wxp.showToast({
      title: '暂未开放....',
      icon:'error'
    })
  },
  handleGoAddress() {
    wx.navigateTo({
      url: `/pages/address-list/index`,
    })
  }
})
