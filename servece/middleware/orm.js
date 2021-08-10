const util =  require('util');
const execP = util.promisify(require('child_process').exec);
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const { dbConfig } = require('../config/index');

// 维护已经连接好数据库
let sqlConnectMap = {}

module.exports = async function Orm (ctx, next) {
  ctx.state.orm = {
    /**
     * 初始化配置
     * @return {this}
     */
    connect () {
      this.__config__ = dbConfig
      return this
    },
    /**
     * 根据给出数据名，确定操作数据库名
     * @param  {String} dbname 连接数据库名
     * @return {this}
     */
    db (dbname = 'default') {
      if (!this.__config__) {
        this.connect()
      }
      this.__config__.database= dbname
      return this
    },
    /**
     * 确定操作表明
     * @param  {String} tableName table名
     * @return {this}
     */
    table (tableName) {
      this.__config__.table= tableName
      return this
    },
    /**
     * 获取sequelize实例
     * @return {sequelize}
     */
    async sequelize() {
      const sequelize = await mysqlConnect(this.__config__);
      return sequelize
    },
    /**
     * insert 操作
     * @param  {Object} data 数据
     * @return {this}
     */
    async insert (data, opt) {
      const sequelize = await mysqlConnect(this.__config__)
      try {
        const Table = getTable(this.__config__.table, sequelize)
        await Table.sync({ force: false }); //创建表
        const res = await Table.create(data, opt)
        return res
      } catch (err) {
        throw new Error(`插入数据库失败:${err}`)
      }
    },
    /**
     * findOrCreate 操作
     * @param  {Object} data 数据
     * @return {this}
     */
      async findOrCreate (data) {
        const sequelize = await mysqlConnect(this.__config__);
        try {
          const Table = getTable(this.__config__.table, sequelize);
          await Table.sync({ force: false }); //创建表
          let res = await Table.findOrCreate(data);
          return res
        } catch (err) {
          throw new Error(`findOrCreate语句执行失败:${err}`)
        }
      },
    /**
     * select 操作
     * @param  {Object} options.where      where 语句
     * @param  {Number} options.limit      limit 语句
     * @param  {Number} options.offset     offset 语句
     * @param  {Array} options.attributes 返回字段配置
     * @return {this}
     */
    async select ({ where, limit, offset, attributes }) {
      const sequelize = await mysqlConnect(this.__config__)
      try {
        const Table = getTable(this.__config__.table, sequelize)
        console.log('创建table...', this.__config__.table)
        // 避免并行Table.sync
        await Table.sync({ force: false }); //创建表
        // http://docs.sequelizejs.com/manual/models-usage.html
        // http://docs.sequelizejs.com/manual/querying.html
        const res = await Table.findAll({
          where,
          limit,
          offset,
          attributes
        })
        return res
      } catch (error) {
        console.log('select命令出错:', error)
        throw new Error('select命令出错', error)
      }
    },
    getTable
  }
  await next()
}
/**
 * 连接数据库
 * @param  {String} options.name     数据库配置项key
 * @param  {String} options.host     数据库地址
 * @param  {Number} options.port     数据库端口
 * @param  {String} options.username 用户名
 * @param  {String} options.password 密码
 * @param  {String} options.database 数据库名
 * @return {Sequelize Instance}
 */
async function mysqlConnect({ name = 'default', host = '127.0.0.1', port = 3306, username = 'root', password = '', database = 'default', }) {
  if (name in sqlConnectMap) {
    return sqlConnectMap[name]
  }
  try {
    // 如果没有数据库自动创建数据库
    await execP(`./node_modules/.bin/sequelize-cli db:create ${database}`)
    const sequelize = new Sequelize(database, username, password, {
      host,
      port,
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
    await sequelize.sync({ force: false })
    sqlConnectMap[name] = sequelize
    return sequelize
  } catch (error) {
    console.log('error', error)
    throw new Error('数据库连接失败:', error)
  }
}

/**
 * 获取table model实例
 * @param  {String} tableName table name
 * @param  {Instance} sequelize sequelize instance
 * @return {Sequelize define Instance}
 */
 function getTable (tableName, sequelize) {
  let tableFile = `../tables/${tableName}.js`
  if (!fs.existsSync(path.resolve(__dirname, tableFile))) {
    throw new Error('模型文件没有找到')
  }
  let tableConfig = require(tableFile)
  tableConfig.options.tableName = tableConfig.name
  console.log('sequelize', sequelize)
  return sequelize.define(...Object.values(tableConfig))
}
