import { googleModel } from "@/lib/ai/model/google";
import { chatPrompt } from "@/lib/ai/prompt/prompts";
import { OramaManager } from "@/lib/orama";
import { auth } from "@clerk/nextjs/server";
import { Message, streamText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { messages, accountId } = await req.json();
    const oramaManager = new OramaManager(accountId);
    await oramaManager.initialize();

    const lastMessage = messages[messages.length - 1];
    const { hits } = await oramaManager.vectorSearch({
      prompt: lastMessage.content,
    });
    chatPrompt(
      hits,
      messages.filter((message: Message) => message.role === "user"),
    );
    const result = streamText({
      model: googleModel,
      ...chatPrompt(
        hits,
        messages.filter((message: Message) => message.role === "user"),
      ),
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
