const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: process.env.DIALECT,
  port: process.env.PGPORT
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users.js")(sequelize, Sequelize);
db.sessions = require("./sessions.js")(sequelize, Sequelize);
db.files = require("./files.js")(sequelize, Sequelize);

db.users.hasMany(db.sessions);
db.users.hasMany(db.files);

module.exports = db;
