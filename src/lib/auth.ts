import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../db";
import { authSchema } from "../db/schema";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

if (!secret) {
  throw new Error("BETTER_AUTH_SECRET must be set");
}

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL must be set");
}

export const auth = betterAuth({
  secret,
  baseURL,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});

export type Auth = typeof auth;
