import { db } from "@/server/db";

export const POST = async (req: Request) => {
    const { data } = await req.json();
    const emailAddress = data.email_addresses[0].email_address;
    const id = data.id;
console.log(emailAddress,id);

    /*await db.users.upsert({
        where: { id },
        update: {email: emailAddress},
        create: { id,email: emailAddress},
    });*/

    return new Response('Webhook received', { status: 200 });
}