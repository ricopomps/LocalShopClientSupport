import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().nonempty(),
    CLERK_WEBHOOK_KEY: z.string().nonempty(),
    STREAM_SECRET: z.string().nonempty(),
    WEB_PUSH_PRIVATE_KEY: z.string().nonempty(),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().nonempty(),
    NEXT_PUBLIC_STREAM_KEY: z.string().nonempty(),
    NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY: z.string().nonempty(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STREAM_KEY: process.env.NEXT_PUBLIC_STREAM_KEY,
    NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  },
});
