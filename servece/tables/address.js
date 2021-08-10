const Sequelize = require('sequelize');
module.exports = {
  name: 'address',
  columns: {
    // 地址id
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // 用户id
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    // 用户名称
    userName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    // 电话
    telNumber: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    // 地址地区
    region: {
      type: DataTypes.JSON,
      allowNull: false
    },
    // 地址详情
    detailInfo: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  },
  options: {
    tableName: 'address',
    indexes: [{
      unique: true, // 唯一索引
      fields: ['telNumber']
    }],
    freezeTableName: true,
    timestamps: true
  }
}
