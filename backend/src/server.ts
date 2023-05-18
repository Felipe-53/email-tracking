import fastify, { FastifyHttpOptions } from "fastify";
import fastifyCors from "@fastify/cors";
import routesPlugin from "./routes/routes";
import { env } from "./env";

const loggerMap = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};

export function buildServer() {
  const app = fastify({
    logger: loggerMap[env.nodeEnv],
  });

  app.register(routesPlugin);
  app.register(fastifyCors);

  return app;
}
