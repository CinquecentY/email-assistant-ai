import { getDataKnowledge } from "@/lib/ai/action";
import { googleModel } from "@/lib/ai/models/google";
import { chatPrompt } from "@/lib/ai/prompts/prompts";
import { OramaManager } from "@/lib/orama";
import { api } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import { type CoreMessage, streamText } from "ai";
import { NextResponse } from "next/server";

interface RequestBody {
  messages: CoreMessage[];
  accountId: string;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { messages: "User not logged in" },
        { status: 401 },
      );
    }
    const { messages, accountId }: RequestBody =
      (await req.json()) as RequestBody;
    const oramaManager = new OramaManager(accountId);
    await oramaManager.initialize();

    const lastMessage = messages[messages.length - 1];
    let searchResult;
    if (lastMessage && typeof lastMessage.content === "string") {
      searchResult = await oramaManager.vectorSearch({
        prompt: lastMessage.content,
      });
    }
    const hits = searchResult ? searchResult.hits : [];
    const dataKnowledge = await getDataKnowledge();
    const result = streamText({
      model: googleModel,
      ...chatPrompt(
        [
          "This is the data related to the user's emails",
          hits.map((hit) => JSON.stringify(hit.document)).join("\n"),
          "-----------",
          dataKnowledge,
          "-----------",
        ].join("\n"),
        messages,
      ),
    });
    return result.toDataStreamResponse();
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: `Error getting chat response.`,
      },
      { status: 500 },
    );
  }
}
