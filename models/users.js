module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    login: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    hashedPassword: {
      type: Sequelize.STRING(32),
      allowNull: false,
    }
  });

  return users;
};
