import { OramaManager } from "@/lib/orama";
import { embed, embedMany } from "ai";
import { googleEmbeddingModel } from "../models/google";

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: googleEmbeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({
    content: chunks[i]!,
    embedding: e as number[],
  }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: googleEmbeddingModel,
    value: input,
  });
  return embedding;
};

