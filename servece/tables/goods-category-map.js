const Sequelize = require('sequelize');
// 商品-分类-关系表
module.exports = {
  name: 'goods-category-map',
  columns: {
    // 分类id
    id:{
      type:Sequelize.INTEGER(11),
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    // 分类名称
    category_id:{
      type:Sequelize.STRING(50),
      allowNull:false
    },
    // 商品id
    goods_id:{
      type:Sequelize.STRING(50),
      allowNull:false
    }
  },
  options: {
    tableName: 'goods-category-map',
    timestamps: true,
    freezeTableName: true
  }
}
