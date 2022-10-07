const dayJs = require('dayjs');
const fs = require('fs');
const xml2js = require('xml2js');
const { secret_xunhu } = require('../config/key-config');

function Sx (num) {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(num)
}

// spu_no 组成: brandId(2位) + '-' + 分类Id(四位) + '-' + yyyyMMddHHmmss + '-' + uuid(27位)
function get_spu_no (brand_id, category_id) {
  let brandId = `00${brand_id}`.substr(-2)
  let categoryId = `0000${category_id}`.substr(-4)
  let day = dayJs().format('YYYYMMDDHHmmss')
  let res = `${brandId}-${categoryId}-${day}-${Sx(0)}${Sx(0)}${Sx(0)}${Sx(0)}${Sx(0)}${Sx(3)}`
  return res
}

async function upload2Cdn({
  file,
  bucket="",
}) {
  if(!file.name) {
    throw new Error('file信息有误')
  }
  const cdnDir = '/fxsp/image'
  // 对接cdn
  const config = require('../config/upload-config');
  const { BosClient } = require('bce-sdk-js');
  const client = new BosClient(config);
  let result
  const headers = {
    'Content-Length': file.size,
    'Content-Type': file.type
  };
  try {
    const uploadFile = fs.createReadStream(file.path, {start: 0, end: file.size});
    console.log('000000', file.name)
    let res = await client.putObject(bucket, `${cdnDir}/${file.name}`, uploadFile, headers)
    if(res) {
      result = `${config.endpoint}${cdnDir}/${file.name}`
    }
  } catch(err) {
    // 上传失败
  }
  return result
}

function _buildXml(obj) {
  let builder = new xml2js.Builder({
    allowSurrogateChars: true
  });
  let xml = builder.buildObject({
    xml: obj
  });
  console.dir (xml);
  return xml;
}

function _parseXml(xml) {
  return new Promise((resolve, reject) => {
    let parser = new xml2js.Parser({
      trim: true,
      explicitArray: false
    });
    parser.parseString(xml, (err, result) => {
      console.dir(result);
      if (err) reject(err);
      else resolve(result.xml);
    });
  });
}
const getRandomNumber = (minNum = 1000000000, maxNum = 99999999999999) => parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)

const getSign = obj => {
  /*
   * 签名算法
   * 
   * 由于密钥不应该在小程序内出现，因此生产环境下的小程序不应该包含此参数
   */

  let keys = Object.keys(obj)
  keys.sort()

  let params = []

  keys.forEach(e => {
    if (obj[e] != '') {
      params.push(e + '=' + obj[e])
    }
  })

  params.push('key=' + secret_xunhu)

  let paramStr = params.join('&')
  const md5Util = require('./md5.js')
  let signResult = md5Util.md5(paramStr).toUpperCase() 

  return signResult
}

module.exports = {
  get_spu_no,
  upload2Cdn,
  _buildXml,
  _parseXml,
  getRandomNumber,
  getSign
}