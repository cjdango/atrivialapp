import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const ServerENVSchema = z.object({
  SERVER_HOST: z.enum(["localhost"]),
  SERVER_PORT: z.string().transform((port) => parseInt(port)),
  PEXELS_API_KEY: z.string(),
  PEXELS_API_URL: z.string().transform((url) => new URL(url)),
});

let envData: z.output<typeof ServerENVSchema>;

export function loadEnv() {
  if (envData) return envData;

  const formatErrors = (error: z.ZodError<z.input<typeof ServerENVSchema>>) =>
    Object.entries(error.format())
      .map(([name, value]) => {
        if (value && "_errors" in value)
          return `${name}: ${value._errors.join(", ")}\n`;
      })
      .filter(Boolean);

  const env = ServerENVSchema.safeParse(process.env);

  if (!env.success) {
    console.error(
      "❌ Invalid environment variables:\n",
      ...formatErrors(env.error)
    );

    throw new Error("Invalid environment variables");
  }

  envData = env.data;

  return env.data;
}
