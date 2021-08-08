const Sequelize = require('sequelize');
// 商品属性类: 颜色，型号等
module.exports = {
  name: 'goods-attr-key',
  columns: {
    id:{
      type:Sequelize.INTEGER(11),
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    // 商品id
    goods_id:{
      type:Sequelize.INTEGER(20),
      allowNull:false
    },
    // 属性key
    attr_key:{
      type:Sequelize.STRING(50),
      allowNull:false
    }
  },
  options: {
    tableName: 'goods-attr-key',
    timestamps: true,
    freezeTableName: true
  }
}
