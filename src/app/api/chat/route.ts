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
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}

const getDataKnowledge = async () => {
  const clients = await api.data.getClients();
  const documents = await api.data.getDocuments();
  const events = await api.data.getEvents();
  const history = await api.data.getHistory();
  const notes = await api.data.getNotes();

  const clientData = clients.map((client, i) => {
    return `Client ${i}:\n -name: ${client.name}\n - email: ${client.email}\n  - phoneNumber: ${client.phoneNumber}\n  - city: ${client.city}\n  - country: ${client.country}\n  - status: ${client.status}\n `;
  });
  const documentData = documents.map((document, i) => {
    return `Document ${i}:\n - type: ${document.type}\n  - status: ${document.status}\n  - amount: ${document.amount}\n  - products: ${document.products}\n `;
  });
  const eventData = events.map((event, i) => {
    return `Event ${i}:\n  - name: ${event.name}\n - description: ${event.description}\n- startingAt: ${event.startingAt.toLocaleDateString()}\n `;
  });
  const historyData = history.map((history, i) => {
    return `History ${i}:\n clientId: ${history.clientId}\n  - action: ${history.action}\n - created At: ${history.createdAt.toLocaleDateString()}\n `;
  });
  const notesData = notes.map((note, i) => {
    return `Note ${i};\n - clientId: ${note.clientId}\n  - description: ${note.description}\n  - createdAt: ${note.createdAt.toLocaleDateString()}\n `;
  });
  return [
    "This is the data related to the definitions provided",
    clientData,
    documentData,
    eventData,
    historyData,
    notesData,
  ].join("\n");
};
