// app.js
import wxp from './utils/wxp'
import Event from './utils/event'
const { request } = require('./utils/request')
const util = require('./utils/util')
App({
  wxp: (wx.wxp = wxp),
  globalData: {},
  request: request,
  util,
  globalEvent: (wx.globalEvent = new Event()),
  checkLoginStatus: async function() {
    const res = await request({
      url: '/user/checkLogin',
      method: 'get'
    })
    if(res.errno === 0) {
      this.globalData.isLogin = true
      this.globalData.userInfo = res.data
    }
  },
  onLaunch() {
    console.log('进入主app完毕')
    this.checkLoginStatus()
  }
})
