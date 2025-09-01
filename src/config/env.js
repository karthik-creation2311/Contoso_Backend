const dotenvFlow = require("dotenv-flow");
dotenvFlow.config();
module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 8000),
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  databaseUrl: process.env.DATABASE_URL || ""
};