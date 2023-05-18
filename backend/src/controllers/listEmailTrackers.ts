import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db/db";

export async function listEmailTrackersHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = req.jwt;

  const rv = prisma.email.findMany({
    where: {
      userId,
    },
    include: {
      emailUpdates: true,
    },
  });

  return rv;
}
