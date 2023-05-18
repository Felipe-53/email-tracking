import { env } from "./env";
import { buildServer } from "./server";

const app = buildServer();

async function main() {
  try {
    await app.listen({
      port: env.port,
      host: "0.0.0.0",
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
