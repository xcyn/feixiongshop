const Sequelize = require('sequelize');
module.exports = {
  name: 'address',
  columns: {
    // 地址id
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // 用户id
    userId: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    // 用户名称
    userName: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    // 电话
    telNumber: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    // 地址地区
    region: {
      type: Sequelize.JSON,
      allowNull: false
    },
    // 地址详情
    detailInfo: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    // 地址地区
    isDefault: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
  },
  options: {
    tableName: 'address',
    indexes: [{
      // unique: true, // 唯一索引
      fields: ['telNumber']
    }],
    freezeTableName: true,
    timestamps: true
  }
}
