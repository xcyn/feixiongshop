const Sequelize = require('sequelize');
// 用来测试的
module.exports = {
  name: 'test',
  columns: {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    testIndex: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
  },
  options: {
    tableName: 'test',
    timestamps: true,
    freezeTableName: true,
    indexes: [
      // Create a unique index on email
      {
        unique: true,
        fields: ['testIndex']
      }
    ]
  },
}
