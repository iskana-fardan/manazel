const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().default(""),
  JWT_SECRET: z.string().default(""),
  CORS_ORIGIN: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Bad environment configuration:", result.error.format());
  process.exit(1);
}

const env = result.data;

module.exports = {
  env: env.NODE_ENV,
  port: env.PORT,
  mongo: { uri: env.MONGO_URI },
  jwt: { secret: env.JWT_SECRET, expiresIn: "1d" },
  cors: { origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(",") : true },
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
};
