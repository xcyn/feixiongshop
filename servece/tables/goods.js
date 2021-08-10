const Sequelize = require('sequelize');
module.exports = {
  name: 'goods',
  columns: {
    id: {
      type:Sequelize.INTEGER(11),
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    // 商品编码
    spu_no:{
      type:Sequelize.STRING(50),
      allowNull:false
    },
    // 商品名称
    goods_name:{
      type:Sequelize.STRING(50),
      allowNull:false
    },
    // 商品描述
    goods_desc:{
      type:Sequelize.TEXT("tiny"),
      allowNull:false
    },
    // 起始价格
    start_price:{
      type:Sequelize.DECIMAL(9,2),
      allowNull:false
    },
    // 商品分类
    category_id:{
      type:Sequelize.BIGINT(11),
      allowNull:false
    },
    // 品牌 （相当于业务编码）
    brand_id:{
      type:Sequelize.BIGINT(11),
      allowNull:false
    }
  },
  options: {
    tableName: 'goods',
    timestamps: true,
    freezeTableName: true
  }
}
