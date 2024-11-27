import Link from "next/link";

import { api, HydrateClient } from "@/trpc/server";
import AuthorizationButton from "@/components/authorization-button";

export default async function Home() {

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <AuthorizationButton/>
      </main>
    </HydrateClient>
  );
}
