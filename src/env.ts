import { z } from "zod";

const envSchema = z.object({
  OMDB_API_KEY: z.string({
    required_error: "OMDB_API_KEY is required. Please obtain one from http://www.omdbapi.com/apikey.aspx"
  }),
  PORT: z.string().default("3000"),
});

const env = envSchema.parse(process.env);

export default env;
