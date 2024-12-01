"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { googleModel } from "@/lib/ai/model/google";
import { OramaManager } from "@/lib/orama";

export async function replyToEmail(context: string, prompt: string) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model: googleModel,
      prompt: `
            You are an AI email assistant embedded in an email client app. Your purpose is to help the user compose emails by providing suggestions and relevant information based on the context of their previous emails.
            
            THE TIME NOW IS ${new Date().toLocaleString()}
            
            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK
            
            USER PROMPT:
            ${prompt}
            
            When responding, please keep in mind:
            - Be helpful, clever, and articulate. 
            - Rely on the provided email context to inform your response.
            - If the context does not contain enough information to fully address the prompt, politely give a draft response.
            - Avoid apologizing for previous responses. Instead, indicate that you have updated your knowledge based on new information.
            - Do not invent or speculate about anything that is not directly supported by the email context.
            - Keep your response focused and relevant to the user's prompt.
            - Don't add fluff like 'Heres your email' or 'Here's your email' or anything like that.
            - Directly output the email, no need to say 'Here is your email' or anything like that.
            - No need to output subject
            `,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}

export async function composeEmail(prompt: string, accountId: string) {
  const stream = createStreamableValue("");
  const oramaManager = new OramaManager(accountId);
  await oramaManager.initialize();

  const { hits } = await oramaManager.vectorSearch({
    prompt,
  });
  (async () => {
    const { textStream } = await streamText({
      model: googleModel,
      ...composeEmail(
        hits.map((hit) => JSON.stringify(hit.document)).join("\n"),
        prompt,
      ),
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
