const Sequelize = require('sequelize');

// http://docs.sequelizejs.com/manual/models-definition.html
module.exports = {
  name: 'session_key',
  columns: {
    id: {
      type: Sequelize.INTEGER(11),
      // 允许为空
      allowNull: false,
      // 主键
      primaryKey: true,
      // 自增
      autoIncrement: true,
    },
    uid: {
      type: Sequelize.INTEGER(11),
      references: {
        model: User,
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      },
      allowNull: false
    },
    sessionKey: {
      type: Sequelize.STRING(24),
      allowNull: false
    }
  },
  options: {
    tableName: 'session_key',
    timestamps: false,
    freezeTableName: true
  }
}