import { create, insert, search, type AnyOrama } from "@orama/orama";
import { persist, restore } from "@orama/plugin-data-persistence";
import { db } from "@/server/db";
import { generateEmbedding } from "./ai/rag/embeddings";

export class OramaManager {
  // @ts-expect-error Property 'orama' has no initializer and is not definitely assigned in the constructor.
  private orama: AnyOrama;
  private accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }

  async initialize() {
    const account = await db.accounts.findUnique({
      where: { id: this.accountId },
      select: { binaryIndex: true },
    });
    if (!account) throw new Error("Account not found");

    if (account.binaryIndex) {
      this.orama = await restore("json", account.binaryIndex as string);
    } else {
      this.orama = create({
        schema: {
          subject: "string",
          body: "string",
          rawBody: "string",
          from: "string",
          to: "string[]",
          sentAt: "string",
          embeddings: "vector[768]",
          threadId: "string",
        },
      });
      await this.saveIndex();
    }
  }

  async insert(document: any) {
    await insert(this.orama, document);
    await this.saveIndex();
  }

  async search({ term }: { term: string }) {
    return await search(this.orama, {
      term: term,
    });
  }

  async vectorSearch({
    prompt,
    numResults = 10,
  }: {
    prompt: string;
    numResults?: number;
  }) {
    const embedding = await generateEmbedding(prompt);
    const results = await search(this.orama, {
      mode: "hybrid",
      term: prompt,
      vector: {
        value: embedding, // Convert to Float32Array
        property: "embeddings",
      },
      similarity: 0.8,
      limit: numResults,
    });
    return results;
  }

  async saveIndex() {
    const index = await persist(this.orama, "json");
    await db.accounts.update({
      where: { id: this.accountId },
      data: { binaryIndex: index as Buffer },
    });
  }
}
