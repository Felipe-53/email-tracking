import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { promisify } from "util";
import * as jwt from "jsonwebtoken";
import { env } from "../env";

const promisifiedVerify = promisify(jwt.verify);

declare module "fastify" {
  interface FastifyRequest {
    jwt: {
      userId: string;
    };
  }
}

const authPlugin: FastifyPluginAsync = async (app) => {
  app.decorateRequest("jwt", null);

  app.addHook("onRequest", async (req, reply) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return reply.status(401).send();
    }

    let payload;
    try {
      // @ts-ignore
      payload = await promisifiedVerify<{ userId: sting }>(
        token,
        env.secretKey
      );
    } catch (e) {
      return reply.status(403).send();
    }

    // @ts-ignore
    req.jwt = payload;
  });
};

export default fp(authPlugin);
