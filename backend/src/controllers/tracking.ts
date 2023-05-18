import { Type as T, Static } from "@sinclair/typebox";
import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db/db";
import { randomUUID } from "crypto";
import { env } from "../env";

export const trackingSchema = T.Object({
  id: T.String({
    format: "uuid",
  }),
});

type TrackingSchema = Static<typeof trackingSchema>;

export async function trackingHandler(
  req: FastifyRequest<{ Querystring: TrackingSchema }>,
  reply: FastifyReply
) {
  const emailId = req.query.id;

  const email = await prisma.email.findUnique({
    where: {
      id: emailId,
    },
  });

  if (!email) {
    reply.status(404);
    return reply.send();
  }

  const emailUpdatesCount = await prisma.emailUpdate.count({
    where: {
      emailId: emailId,
    },
  });

  if (emailUpdatesCount >= 2) {
    await prisma.emailUpdate.create({
      data: {
        id: randomUUID(),
        emailId,
        event: "OPENED",
      },
    });
  } else {
    await prisma.emailUpdate.create({
      data: {
        id: randomUUID(),
        emailId,
        event: "REGISTERED",
      },
    });
  }

  return reply.redirect(env.pixelUrl);
}
