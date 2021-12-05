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
  onLaunch() {
    console.log('进入主app完毕')
  }
})
