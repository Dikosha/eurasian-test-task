module.exports = (sequelize, Sequelize) => {
  const sessions = sequelize.define("sessions", {
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    }
  });

  return sessions;
};
