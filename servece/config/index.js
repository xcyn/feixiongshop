const config = require('./config');
console.log('数据库环境为:',process.env.ENV)
if(!process.env.ENV) {
  throw new Error(`环境变量设置有误!`)
}
const dbConfig = config[process.env.ENV];
module.exports = {
  dbConfig
}
