// 主页
// 主页
import Dialog from "@vant/weapp/dialog/dialog";
Page({
  data: {},
  onLoad(options) {
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
