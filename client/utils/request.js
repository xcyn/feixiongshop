const API_BASE_URL = 'http://localhost:3099'
const request = ({
  url, method, header={}, data
}) => {
  const _url = API_BASE_URL + url
  let token = wx.getStorageSync('token')
  console.log('data', data)
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
              console.log("response url:",_url)
              console.log("response data:",request.data)
              resolve(request.data)
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