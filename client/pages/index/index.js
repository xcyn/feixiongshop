// 主页
const app = getApp()

Page({
  data: {
    background: [{}, {}, {}],
    goods: [{},{},{},{},{}],
    showNoticeDetail: false
  },
  onLoad() {
    if (wx.getUserProfile) {
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  // 查看商品详情
  handleGoDetail(e) {
    let id = e.target.dataset.id
    wx.navigateTo({
      url: `/pages/detail/index?goodId=${id}`,
    })
  },

  // 查看通知详情
  handleNoticeDetail() {
    this.setData({
      showNoticeDetail: true
    })
  },
  handleCloseNotice() {
    this.setData({
      showNoticeDetail: false
    })
  },

  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },

  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  }
})
