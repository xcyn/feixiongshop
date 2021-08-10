const Sequelize = require('sequelize');
// 商品属性类: 颜色，型号等
module.exports = {
  name: 'goods-attr-value',
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
    // attr_key_id
    attr_key_id:{
      type:DataTypes.INTEGER(20),
      allowNull:false
    },
    // 属性value
    attr_value:{
      type:Sequelize.STRING(50),
      allowNull:false
    }
  },
  options: {
    tableName: 'goods-attr-value',
    timestamps: true,
    freezeTableName: true
  }
}
