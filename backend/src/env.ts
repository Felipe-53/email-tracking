import assert from "assert";
import { config } from "dotenv";
config();

const environments = ["development", "production", "test"] as const;
export type NodeEnv = (typeof environments)[number];

interface Environment {
  databaseUrl: string;
  pixelUrl: string;
  secretKey: string;
  googleClientId: string;
  nodeEnv: NodeEnv;
  port: number;
}

const env: Environment = {
  databaseUrl: process.env.DATABASE_URL!,
  pixelUrl: process.env.PIXEL_URL!,
  secretKey: process.env.SECRET_KEY!,
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  nodeEnv: process.env.NODE_ENV as NodeEnv,
  port: Number(process.env.PORT || 3500),
} as const;

type Key = keyof Environment;

for (const key of Object.keys(env) as Key[]) {
  assert(env[key] !== undefined, `${key} must be defined`);
}

assert(
  environments.includes(env.nodeEnv),
  `NODE_ENV must be one of ${environments.join(", ")}, found: ${env.nodeEnv}`
);

export { env };
