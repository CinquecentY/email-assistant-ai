"use server";
import { streamText } from "ai";
import { googleModel } from "@/lib/ai/models/google";
import { OramaManager } from "@/lib/orama";
import {
  autocompletePrompt,
  composePrompt,
  replyEmailPrompt,
} from "@/lib/ai/prompts/prompts";

export async function replyToEmail(context: string, prompt: string) {
  const result = streamText({
    model: googleModel,
    ...replyEmailPrompt(context, prompt),
  });
  return result.textStream;
}

export async function composeEmail(
  context: string,
  prompt: string,
  accountId: string,
) {
  const oramaManager = new OramaManager(accountId);
  await oramaManager.initialize();

  const { hits } = await oramaManager.vectorSearch({
    prompt,
  });
  const result = streamText({
    model: googleModel,
    ...composePrompt(
      hits.map((hit) => JSON.stringify(hit.document)).join("\n"),
      context,
      prompt,
    ),
  });
  return result.textStream;
}

export async function autoComplete(context: string, prompt: string) {
  const result = streamText({
    model: googleModel,
    ...autocompletePrompt(context, prompt),
  });

  return result.textStream;
}
