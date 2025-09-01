const pino = require("pino");
const { port } = require("./config/env");
const { buildApp } = require("./app");

const logger = pino();
const app = buildApp(logger);

const server = app.listen(port, () => logger.info({ port }, "listening"));

process.on("SIGTERM", () => {
  logger.info("shutting down");
  server.close(() => process.exit(0));
});