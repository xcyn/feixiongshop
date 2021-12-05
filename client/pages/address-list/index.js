// 主页
const app = getApp()

Page({
  data: {
    selectId: 1,
    addressList: []
  },
  onLoad(options) {
    this.getAddressList()
    app.globalEvent.on('loginSuccess', () => {
      this.getAddressList()
    })
  },
  async getAddressList() {
    const userInfo = app.globalData.userInfo
    const res = await app.request({
      url: '/goods-c/select-user-address',
      method: 'get',
      data:{ 
        userId: userInfo.id
       }
    })
    let uiList = []
    if(res.errno === 0) {
      let list = res.data || []
      // 如果只有一条数据并且不是默认，那么默认变成defalut
      if(list.length === 1) {
        let data = list[0]
        if(!data.isDefault) {
          const res2 = await app.request({
            url: '/goods-c/update-default-address',
            method: 'post',
            data:{ 
              userId: userInfo.id,
              telNumber: data.telNumber,
              id: data.id,
             }
          })
          if(res2 && res2.errno === 0) {
            this.getAddressList()
          }
          return
        }
      }
      for(let i = 0; i < list.length; i++) {
        let item = list[i];
        const {
          cityCode,
          counCode,
          provCode
        } = item.region
        if(!!item.isDefault) {
          this.setData({
            selectId: item.id
          })
        }
        let res = await app.request({
          url: '/goods-c/select-address-item',
          method: 'get',
          data:{ 
            cityCode,
            counCode,
            provCode
           }
        })
        if(res && res.data) {
          item.title = `${res.data.provName}${res.data.cityName}${res.data.provName}`
          uiList.push(item)
        }
      }
      console.log('uiList', uiList)
      this.setData({
        addressList: res.data || []
      })
    }
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
  async handleSelectAddress(e) {
    let postItem
    let addressList = this.data.addressList
    addressList.map(item => {
      if(item.id === e.detail) {
        postItem = item
      }
    })
    console.log('postItem', postItem)
    const userInfo = app.globalData.userInfo
    const res = await app.request({
      url: '/goods-c/update-default-address',
      method: 'post',
      data:{ 
        userId: userInfo.id,
        telNumber: postItem.telNumber,
        id: postItem.id
       }
    })
    if(res && res.errno === 0) {
      wx.navigateBack({
        delta: 1,
        success: function () {
          let page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      }) 
    }
  }
})
