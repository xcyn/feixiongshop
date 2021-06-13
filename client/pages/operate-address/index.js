// 主页
// const app = getApp()

Page({
  data: {
    show: false,
    areaVal: "110101",
    areaList: {
      province_list: {
        110000: '北京市',
        120000: '天津市',
      },
      city_list: {
        110100: '北京市',
        120100: '天津市',
      },
      county_list: {
        110101: '东城区',
        110102: '西城区',
      },
    }
  },
  onLoad(options) {
  },
  showPopup() {
    this.setData({
      show: true
    })
  },
  // 下单
  handleClose(value) {
    console.log('handleClose', value)
  },
  handleConfirm(event) {
    this.setData({
      show: false
    })
  },
  handleSaveAddress() {
    wx.navigateBack({
      delta: 1
    })
  }
})
