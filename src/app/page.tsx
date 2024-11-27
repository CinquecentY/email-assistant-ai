import Link from "next/link";

import { api, HydrateClient } from "@/trpc/server";
import AuthorizationButton from "@/components/authorization-button";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });


  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <AuthorizationButton/>
      </main>
    </HydrateClient>
  );
}
