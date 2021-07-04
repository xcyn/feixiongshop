const Sequelize = require('sequelize');
// http://docs.sequelizejs.com/manual/models-definition.html
module.exports = {
  name: 'user',
  columns: {
    // http://docs.sequelizejs.com/manual/data-types.html
    name: {
        type: new Sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
  },
  options: {
    tableName: 'user',
    define: { freezeTableName: true }
    // http://docs.sequelizejs.com/manual/models-definition.html#configuration
  }
}
