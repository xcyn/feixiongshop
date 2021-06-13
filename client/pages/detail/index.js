// 主页
const app = getApp()

Page({
  data: {
    goodId: '',
    show: false,
  },
  onLoad(options) {
    let goodId = JSON.parse(options.goodId);
    this.setData({
      goodId,
    })
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  // 跳转确认订单
  handleBuy() {
    const { goodId } = this.data
    console.log('goodIdgoodId', goodId)
    if(goodId) {
      wx.navigateTo({
        url: `/pages/order/index?goodId=${goodId}`,
      })
      this.onClose()
    }
  },
})
