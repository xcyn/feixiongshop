const API_BASE_URL = 'https://www.feixiongwang.cn/fxapi'
// const API_BASE_URL = 'http://10.2.147.53:3299'
// const API_BASE_URL = 'http://112.74.86.53:3299'
// const API_BASE_URL = 'http://192.168.1.2:3299'
const request = ({
  url, method, header={}, data
}) => {
  const _url = API_BASE_URL + url
  let token = wx.getStorageSync('token')
  let defHeader =  {
    'content-type': 'application/json',
    'Authorization': `Bearer ${token || ''}`
  }
  header = Object.assign({},defHeader, header)
  return new Promise((resolve, reject) => {
      wx.request({
          url: _url,
          method: method,
          data: data,
          header: header,
          success(request) {
              // 全局处理登录失效
              let resData = request && request.data
              console.log('resData', resData)
              if(resData && resData.errno === 401) {
                if(wx) {
                  wx.showToast({
                    title: resData.errmsg || '登录失败，请重新登录!',
                    icon:'error'
                  })
                  const app = getApp()
                  app.globalData = {}
                  wx.setStorageSync('token', '')
                  setTimeout(() => {
                    wx.switchTab({
                      url: `/pages/index/index`,
                    })
                  }, 1000);
                } else {
                  console.log('非微信环境')
                }
              }
              resolve(resData)
          },
          fail(error) {
            console.log('error', error)
              reject(error)
          },
          complete(aaa) {
              // 加载完成
          }
      })
  })
}

module.exports = {
  request: request
}