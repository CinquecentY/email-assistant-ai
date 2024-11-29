import { google } from "@ai-sdk/google";
import { embed } from "ai";

export async function getEmbeddings(text: string) {
  try {
    const { embedding } = await embed({
      model: google.textEmbeddingModel("text-embedding-004"),
      value: text.replace(/\n/g, " "),
    });
    return embedding;
  } catch (error) {
    console.log("error embeddings api", error);
    throw error;
  }
}
