import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import prisma from "../db/db";
import { OAuth2Client } from "google-auth-library";
import { sign } from "jsonwebtoken";
import { randomUUID } from "crypto";
import { env } from "../env";
import { Type as T, Static } from "@sinclair/typebox";

const client = new OAuth2Client(env.googleClientId);

export const signInSchema = T.Object({
  token: T.String({
    minLength: 16,
    maxLength: 5 * 1024,
  }),
});

type SignInSchema = Static<typeof signInSchema>;

export async function signInHandler(
  req: FastifyRequest<{ Body: SignInSchema }>,
  reply: FastifyReply
) {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    return reply.status(401);
  }

  const userExists = await prisma.user.findUnique({
    where: {
      googleId: payload.sub,
    },
  });

  if (userExists) {
    const jwt = sign(
      {
        userId: userExists.id,
      },
      env.secretKey
    );

    return {
      token: jwt,
    };
  }

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ? payload.name : "Usuário",
    },
  });

  const jwt = sign(
    {
      userId: user.id,
    },
    env.secretKey
  );

  return {
    token: jwt,
  };
}
