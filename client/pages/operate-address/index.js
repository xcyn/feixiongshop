// 主页
const app = getApp()

Page({
  data: {
    show: false,
    des: '北京市北京市东城区',
    telNumber: '',
    userName: '',
    detailInfo: '',
    region: {
      provCode: '110000',
      provName: '北京市',
      cityCode: '110100',
      cityName: '北京市',
      counCode: '110101',
      counName: '东城区'
    },
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
    this.getAreaList()
  },
  async getAreaList() {
    const res = await app.request({
      url: '/goods-c/select-all-address',
      method: 'get',
      data:{
       }
    })
    if(res && res.errno === 0) {
      const areaList = res.data || {}
      console.log('areaList', areaList)
      this.setData({
        areaList
      })
    }
  },
  showPopup() {
    this.setData({
      show: true
    })
  },
  // 关闭地址
  handleClose(value) {
    this.setData({
      show: false
    })
  },
  handleConfirm(event) {
    let values = event.detail && event.detail.values || []
    let areaVal = ''
    if(!!values[2]) {
      areaVal = values[2].code
    } else if(!!values[1]) {
      areaVal = values[1].code
    } else if(!!values[0]) {
      areaVal = values[0].code
    }
    let region = {
      provCode: values[0].code || '',
      provName: values[0].name || '',
      cityCode: values[1].code || '',
      cityName: values[1].name || '',
      counCode: values[2].code || '',
      counName: values[2].name || '',
    }
    let des = `${region.provName}${region.cityName}${region.counName}`
    this.setData({
      show: false,
      region,
      des,
      areaVal: areaVal
    })
  },
  async handleSaveAddress() {
    const {
      telNumber,
      userName,
      detailInfo,
      region
    } = this.data
    const isNotPhone = !/^1[3-9]\d{9}$/.test(telNumber)
    if(!telNumber || !userName || !detailInfo || isNotPhone) {
      app.wxp.showToast({
        title: '信息填写有误',
        icon:'error'
      })
      return
    }
    const userInfo = app.globalData.userInfo
    const res = await app.request({
      url: '/goods-c/create-address',
      method: 'post',
      data:{
        userId: userInfo.id,
        userName,
        telNumber,
        region,
        detailInfo,
       }
    })
    if(res && res.errno === 0) {
      wx.navigateBack({
        delta: 1,
        success: function (e) {
          let page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })
    }
  }
})
