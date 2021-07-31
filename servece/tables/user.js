const Sequelize = require('sequelize');
// http://docs.sequelizejs.com/manual/models-definition.html
module.exports = {
  name: 'user',
  columns: {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nickName: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    avatarUrl: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gender: {
      type: Sequelize.INTEGER
    },
    language: {
      type: Sequelize.STRING(10)
    },
    city: {
      type: Sequelize.STRING(20)
    },
    province: {
      type: Sequelize.STRING(20)
    },
    country: {
      type: Sequelize.STRING(10)
    },
    openId: {
      type: Sequelize.STRING(32),
      allowNull: false
    }
  },
  options: {
    tableName: 'user',
    timestamps: false,
    freezeTableName: true,
    // indexes: [
    //   // Create a unique index on email
    //   {
    //     unique: true,
    //     fields: ['openId']
    //   }
    // ]
  }
}
