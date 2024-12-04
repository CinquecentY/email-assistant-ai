"use server";
import { streamText } from "ai";
import { googleModel } from "@/lib/ai/models/google";
import { OramaManager } from "@/lib/orama";
import {
  autocompletePrompt,
  composePrompt,
  polishTextPrompt,
  replyEmailPrompt,
} from "@/lib/ai/prompts/prompts";
import { api } from "@/trpc/server";

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
  const dataKnowledge = await getDataKnowledge();
  const result = streamText({
    model: googleModel,
    ...composePrompt(
      [
        "This is the data related to the user's emails",
        hits.map((hit) => JSON.stringify(hit.document)).join("\n"),
        "-----------",
        dataKnowledge,
        "-----------",
      ].join("\n"),
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

export async function polishText(prompt: string) {
  const result = streamText({
    model: googleModel,
    ...polishTextPrompt(prompt),
  });

  return result.textStream;
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
