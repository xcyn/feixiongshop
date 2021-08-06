const Sequelize = require('sequelize');
// http://docs.sequelizejs.com/manual/models-definition.html
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
    }
  },
  options: {
    tableName: 'test',
    timestamps: false,
    freezeTableName: true,
  }
}
