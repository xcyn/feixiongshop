// 模拟创建表结构
const fs = require('fs');
function readDir(globPath) {
  return fs.readdirSync(globPath, function (err, lists) {
      if (err) {
          return;
      }
      return lists;
  });
};

// 读取当前目录
function generateTable(globPath) {
  const lists = readDir(globPath);
  for(let i = 0; i < lists.length; i++) {
    let tableName = lists[i]
    let tableModal = require(`./${tableName}`)
    const { createTable } = tableModal
    // 创建表
    if(createTable) {
      createTable()
    }
  }
};

generateTable(__dirname);