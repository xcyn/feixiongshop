// 主页
const app = getApp()

Page({
  data: {},
  onLoad(options) {
  },
  showPopup() {
  },
  onClose() {
  },
  handleGoAddAddress() {
    wx.navigateTo({
      url: `/pages/operate-address/index?status=add`,
    })
  },
  handleSelectAddress() {
    wx.navigateBack({
      delta: 1
    })
  }
})
