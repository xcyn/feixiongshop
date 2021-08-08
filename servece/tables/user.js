const Sequelize = require('sequelize');
// http://docs.sequelizejs.com/manual/models-definition.html
// 此模型主要用的是微信返回的数据模型
module.exports = {
  name: 'user',
  columns: {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // 昵称
    nickName: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    // 头像
    avatarUrl: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // 性别
    gender: {
      type: Sequelize.INTEGER
    },
    // 语言
    language: {
      type: Sequelize.STRING(10)
    },
    // 城市
    city: {
      type: Sequelize.STRING(20)
    },
    // 省
    province: {
      type: Sequelize.STRING(20)
    },
    // 国家
    country: {
      type: Sequelize.STRING(10)
    },
    openId: {
      type: Sequelize.STRING(32),
      allowNull: false
    }
  },
  options: {
    tableName: 'user',
    timestamps: true,
    freezeTableName: true,
    indexes: [
      // Create a unique index on email
      {
        unique: true,
        fields: ['openId']
      }
    ]
  }
}
