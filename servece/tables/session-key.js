const Sequelize = require('sequelize');
// 后期如果把session存储到服务器，会用此model
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
    // sessionKey
    sessionKey: {
      type: Sequelize.STRING(24),
      allowNull: false
    }
  },
  options: {
    tableName: 'session_key',
    timestamps: true,
    freezeTableName: true
  }
}