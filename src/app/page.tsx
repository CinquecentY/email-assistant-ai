import HomeLayout from "@/components/layout/home-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <HomeLayout>
      <div className="absolute left-0 top-0 z-[-1] h-screen w-screen bg-gradient-to-b from-blue-500 via-purple-500 to-purple-100 opacity-50 dark:to-[#121212] md:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] md:from-0% md:via-50% md:to-80%"></div>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-2">
        <h1 className="text-center text-4xl capitalize md:text-7xl">
          The only email assistant you will ever need
        </h1>
        <div className="inline-flex flex-wrap justify-center gap-2 lowercase md:text-3xl">
          <h2>Check your emails.</h2>
          <h2>Talk to your emails.</h2>
          <h2>Do more with your emails.</h2>
        </div>
        <Button
          variant={"secondary"}
          className="font-semi-bold size-fit p-4 text-xl md:mt-2 md:size-1/4 md:rounded-2xl md:py-4 md:text-4xl"
          asChild
        >
          <Link href="/mail">
            Get started
            <span className="text-sm">it&apos;s free</span>
          </Link>
        </Button>
        <sub className="text-center text-sm text-muted-foreground md:text-base">
          Powered by{" "}
          <a
            href="https://github.com/CinquecentY/email-assistant-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            ❤️ & AI
          </a>
        </sub>
      </div>
    </HomeLayout>
  );
}
