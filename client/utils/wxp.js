import {
  promisifyAll
} from 'miniprogram-api-promise';
// const { promisifyAll } = require("miniprogram-api-promise");

let wxp = {}
promisifyAll(wx, wxp)

export default wxp