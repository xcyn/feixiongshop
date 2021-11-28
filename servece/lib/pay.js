const WXPay = require('weixin-pay')
const fs = require('fs')
const config = require('../config/key-config');
const path = require('path');
const pfxPath = path.resolve(__dirname, '../', './config/apiclient_cert.p12');
const wxpay = WXPay({
  appid: config.miniProgramAppid,
  mch_id: config.mch_id,
  notify_url: config.notify_url, // 支付成功通知地址
  partner_key: config.partner_key, //微信商户平台 API secret，非小程序 secret
  pfx: fs.readFileSync(pfxPath), 
  passphrase: '飞熊商铺'
});

module.exports = wxpay