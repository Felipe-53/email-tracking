import { FastifyPluginAsync } from "fastify";
import authPlugin from "../plugins/auth";
import {
  createEmailTrackerHandler,
  createEmailTrackerSchema,
} from "../controllers/createEmailTracker";
import { listEmailTrackersHandler } from "../controllers/listEmailTrackers";
import { trackingHandler, trackingSchema } from "../controllers/tracking";
import { signInHandler, signInSchema } from "../controllers/signIn";

const openRoutes: FastifyPluginAsync = async (app, opts) => {
  app.route({
    url: "/google-sign-in",
    method: "POST",
    handler: signInHandler,
    schema: {
      body: signInSchema,
    },
  });

  app.route({
    url: "/tracking",
    method: "GET",
    handler: trackingHandler,
    schema: {
      querystring: trackingSchema,
    },
  });
};

const authRoutes: FastifyPluginAsync = async (app) => {
  app.register(authPlugin);

  app.route({
    url: "/emails",
    method: "GET",
    handler: listEmailTrackersHandler,
  });

  app.route({
    url: "/emails",
    method: "POST",
    handler: createEmailTrackerHandler,
    schema: {
      body: createEmailTrackerSchema,
    },
  });
};

const routesPlugin: FastifyPluginAsync = async (app) => {
  app.register(openRoutes);
  app.register(authRoutes);
};

export default routesPlugin;
