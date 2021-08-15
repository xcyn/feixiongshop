const Sequelize = require('sequelize');
module.exports = {
  name: 'address-code',
  columns: {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // 省名称
    provName: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    // 省编码
    provCode: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    // 城市名称
    cityName: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    // 城市编码
    cityCode: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    // 县名称
    counName: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    // 县编码
    counCode: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
  },
  options: {
    tableName: 'address-code',
    freezeTableName: true,
    timestamps: true
  }
}
