const Sequelize = require('sequelize');
// 商品分类
module.exports = {
  name: 'goods-category',
  columns: {
    // 分类id
    id:{
      type:Sequelize.INTEGER(11),
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    // 分类名称
    category_name:{
      type:Sequelize.STRING(50),
      allowNull:false
    }
  },
  options: {
    tableName: 'goods-category',
    timestamps: true,
    freezeTableName: true
  }
}
