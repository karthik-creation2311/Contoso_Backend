const express = require("express");
const helmet = require("helmet");
const pinoHttp = require("pino-http");
const routes = require("./routes");
const { errorMiddleware } = require("./middlewares/error");

function buildApp(logger) {
  const app = express();
  app.use(express.json());
  app.use(helmet());
  app.use(pinoHttp({ logger }));

  app.get("/healthz", (req, res) => res.send("ok"));
  app.use("/api", routes);

  app.use(errorMiddleware); // last
  return app;
}
module.exports = { buildApp };