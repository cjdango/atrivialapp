import { createServer } from "./server";

import { loadEnv } from "./utils/env";
import prisma from "./utils/prisma";

const envConfig = loadEnv();

async function start() {
  

  try {
    const server = await createServer();
    server.listen(envConfig.SERVER_PORT, envConfig.SERVER_HOST, () => {
      console.log(
        `🚀 Server started at http://${envConfig.SERVER_HOST}:${envConfig.SERVER_PORT}`
      );
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

start();
