// 主页
const app = getApp()

Page({
  data: {
    active: 0,
    status: 'all', // all, unPay, isPay, cancel
    list: []
  },
  // 事件处理函数
  bindViewTap() {
  },
  async getOrderStatus(status = 'all') {
    const userInfo = app.globalData.userInfo
    const res = await app.request({
      url: '/goods-c/get-orders',
      method: 'get',
      data:{ 
        userId: userInfo.id,
        status: status
       }
    })
    if(res && res.errno === 0) {
      console.log('res.data', res.data)
      this.setData({
        list: res.data || []
      })
    }
  },
  onChange(event) {
    let statusMap = {
      0: 'all',
      1: 'unPay',
      2: 'isPay',
      3: 'cancel',
    }
    let active = event.detail.name
    let status = statusMap[active]
    this.getOrderStatus(status)
    this.setData({
      status,
      active
    })
  },
  onLoad(options={}) {
    const { status = 'all' } = options
    let statusToActiveMap = {
      'all': 0,
      'unPay': 1,
      'isPay': 2,
      'cancel': 3,
    }
    let active = statusToActiveMap[status]
    console.log('status', status)
    console.log('active', active)
    this.getOrderStatus(status)
    this.setData({
      status,
      active
    })
  }
})
