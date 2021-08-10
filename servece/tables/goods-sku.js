const Sequelize = require('sequelize');
module.exports = {
  name: 'goods-sku',
  columns: {
    // skuId
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
    // sku属性
    goods_attr_path:{
      type:Sequelize.JSON,
      allowNull:false
    },
    // sku描述
    goods_sku_desc:{
      type:Sequelize.TEXT('tiny'),
      allowNull:false,
    },
    // 价格
    price:{
      type:Sequelize.INTEGER(11),
      allowNull:false
    },
    // 库存
    stock:{
      type:Sequelize.INTEGER(4),
      allowNull:false,
      defaultValue:0
    }
  },
  options: {
    tableName: 'goods-sku',
    timestamps: true,
    freezeTableName: true
  }
}
