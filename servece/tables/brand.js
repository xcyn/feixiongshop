const Sequelize = require('sequelize');
// 商品属性类: 颜色，型号等
module.exports = {
  name: 'brand',
  columns: {
    id:{
      type:Sequelize.INTEGER(11),
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    // 品牌名称
    brand_name:{
      type:Sequelize.STRING(50),
      allowNull:false
    }
  },
  options: {
    tableName: 'brand',
    timestamps: true,
    freezeTableName: true
  }
}
