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
    // TODO setAccount ID
    const result = streamText({
      model: googleModel,
      ...chatPrompt(
        messages.filter((message: Message) => message.role === "user"),
      ),
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
