import { db } from "@/server/db";
import { type UserJSON } from "@clerk/nextjs/server";

export const POST = async (req: Request) => {
  const { data } = (await req.json()) as { data: UserJSON };
  if (!data.email_addresses[0]) return new Response("NO DATA", { status: 400 });
  const emailAddress = data.email_addresses[0].email_address;
  const id = data.id;

  await db.users.upsert({
    where: { id },
    update: { email: emailAddress },
    create: { id, email: emailAddress },
  });

  return new Response("Webhook received", { status: 200 });
};
