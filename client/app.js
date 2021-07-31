// app.js
import wxp from './utils/wxp'
import Event from './utils/event'
App({
  wxp: (wx.wxp = wxp),
  globalData: {},
  globalEvent: (wx.globalEvent = new Event()),
  onLaunch() {
    console.log(1)
  }
})
