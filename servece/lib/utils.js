const dayJs = require('dayjs');

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

module.exports = {
  get_spu_no
}