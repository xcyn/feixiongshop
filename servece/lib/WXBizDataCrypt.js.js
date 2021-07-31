let crypto = require('crypto')

function WXBizDataCrypt(appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode
  let sessionKey = new Buffer.from(this.sessionKey, 'base64')
  encryptedData = new Buffer.from(encryptedData, 'base64')
  iv = new Buffer.from(iv, 'base64')
  let decoded

  try {
     // 解密
    let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    // 问题是cipher.update(data, 'binary')输出一个缓冲区，该缓冲区自动字符串化为十六进制编码的字符串
    decoded = decipher.update(encryptedData,'binary',"utf8")
    // 这里有一个错误发生：
    // error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt
    // 本质是由于sessionKey与code不匹配造成的
    decoded += decipher.final('utf8')
    decoded = JSON.parse(decoded)

  } catch (err) {
    console.log('err',err);
    throw new Error('Illegal Buffer')
  }

  if (decoded.watermark.appid !== this.appId) {
    throw new Error('Illegal Buffer')
  }

  return decoded
}

module.exports = WXBizDataCrypt