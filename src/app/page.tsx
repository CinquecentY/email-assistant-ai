import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { HydrateClient } from "@/trpc/server";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <div className="absolute left-0 top-0 z-[-1] h-screen w-screen bg-gradient-to-b from-blue-500 via-purple-500 to-purple-100 opacity-50 dark:to-[#121212] md:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] md:from-0% md:via-50% md:to-80%"></div>
        <nav className="inline-flex w-full items-center p-2">
          <span className="flex-1">
            <Link
              href="/"
              className="border-b-2 px-2 font-semibold lowercase md:text-2xl"
            >
              Mail Assistant 🇦🇮
            </Link>
          </span>
          <span className="inline-flex gap-8">
            <ModeToggle />
            <UserButton />
          </span>
        </nav>
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
              <span className="text-sm">(it's free)</span>
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
        <footer className="inline-flex flex-col justify-center p-2 text-xs md:flex-row md:justify-between md:gap-4 md:text-base">
          <div className="mb-2 inline-flex w-full justify-center md:hidden">
            <span
              className="inline-flex w-1/4 justify-between"
              aria-label="socials"
            >
              <Link
                href="https://github.com/CinquecentY"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/github.svg" alt="GitHub" width={26} height={26} />
              </Link>
              <Link
                href="https://www.linkedin.com/in/yassine-a-476616232/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/linkedin.svg"
                  alt="LinkedIn"
                  width={26}
                  height={26}
                />
              </Link>
            </span>
          </div>
          <span className="inline-flex gap-2">
            <span>© 2024 Y.Ah, Inc</span>
            <Link className="font-bold" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="font-bold" href="/terms">
              Terms of Service
            </Link>
          </span>
          <span className="hidden gap-2 md:inline-flex" aria-label="socials">
            <Link
              href="https://github.com/CinquecentY"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/github.svg" alt="GitHub" width={32} height={32} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/yassine-a-476616232/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/linkedin.svg"
                alt="LinkedIn"
                width={32}
                height={32}
              />
            </Link>
          </span>
        </footer>
      </main>
    </HydrateClient>
  );
}
