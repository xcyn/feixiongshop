const Sequelize = require('sequelize');
module.exports = {
  name: 'goods-sku',
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
    // 商品内容描述
    content:{
      type:Sequelize.TEXT,
      allowNull:true
    }
  },
  options: {
    tableName: 'goods-sku',
    timestamps: true,
    freezeTableName: true
  }
}
