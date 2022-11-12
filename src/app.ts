import { loadEnv } from "./utils/env";
import { initServer } from "./utils/server";

const envConfig = loadEnv();
initServer(envConfig);