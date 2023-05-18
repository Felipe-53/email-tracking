import { Type as T, Static } from "@sinclair/typebox";
import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db/db";
import { randomUUID } from "crypto";

export const createEmailTrackerSchema = T.Object({
  title: T.String({
    minLength: 1,
    maxLength: 100,
  }),
});

type CreateEmailTrackerSchema = Static<typeof createEmailTrackerSchema>;

export async function createEmailTrackerHandler(
  req: FastifyRequest<{ Body: CreateEmailTrackerSchema }>,
  reply: FastifyReply
) {
  const { userId } = req.jwt;
  const { title } = req.body;

  await prisma.email.create({
    data: {
      id: randomUUID(),
      userId,
      title,
      emailUpdates: {
        create: {
          event: "CREATED",
          id: randomUUID(),
        },
      },
    },
  });

  reply.status(201);
  return {
    ok: true,
  };
}
