import { googleModel } from "@/lib/ai/models/google";
import { chatPrompt } from "@/lib/ai/prompts/prompts";
import { OramaManager } from "@/lib/orama";
import { auth } from "@clerk/nextjs/server";
import { type CoreMessage, type Message, streamText } from "ai";
import { NextResponse } from "next/server";

interface RequestBody {
  messages: CoreMessage[];
  accountId: string;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const result = streamText({
      model: googleModel,
      ...chatPrompt(
        hits.map((hit) => JSON.stringify(hit.document)).join("\n"),
        messages,
        //messages.filter((message: CoreMessage) => message.role === "user"),
      ),
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
