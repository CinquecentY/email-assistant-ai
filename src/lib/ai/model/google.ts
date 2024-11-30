import { google } from "@ai-sdk/google";

export const googleModel = google("gemini-1.5-flash");
export const googleEmbeddingModel =
  google.textEmbeddingModel("text-embedding-004");
