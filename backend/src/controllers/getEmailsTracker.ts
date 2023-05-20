import { Type as T, Static } from "@sinclair/typebox";
import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db/db";

export const getEmailTrackerSchema = T.Object({
  id: T.String({
    format: "uuid",
  }),
});

type GetEmailTrackerSchema = Static<typeof getEmailTrackerSchema>;

export async function getEmailTrackerHandler(
  req: FastifyRequest<{ Params: GetEmailTrackerSchema }>,
  reply: FastifyReply
) {
  const { userId } = req.jwt;
  const { id } = req.params;

  const email = await prisma.email.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      emailUpdates: true,
    },
  });

  if (!email) {
    reply.status(404);
    return {
      ok: false,
      message: "not found",
    };
  }

  return {
    data: email,
  };
}
