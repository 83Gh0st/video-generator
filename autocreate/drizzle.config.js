import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./config/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:L0hJn1FVjRKa@ep-tiny-snowflake-a1pcm6ln.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"    ,
  },
  out: "./drizzle",
});
