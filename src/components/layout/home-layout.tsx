import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import React from "react";

const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <nav className="inline-flex w-full items-center p-2">
        <span className="flex-1">
          <Link
            href="/"
            className="border-b-2 px-2 font-semibold lowercase md:text-2xl"
          >
            Mail Assistant ᴀɪ
          </Link>
        </span>
      </nav>
      <main className="flex flex-1 flex-col">{children}</main>
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
              <Github />
            </Link>
            <Link
              href="https://www.linkedin.com/in/yassine-a-476616232/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin />
            </Link>
          </span>
        </div>
        <span className="inline-flex gap-2">
          <span className="opacity-10" >© Yassine A.</span>
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
            <Github />
          </Link>
          <Link
            href="https://www.linkedin.com/in/yassine-a-476616232/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin />
          </Link>
        </span>
      </footer>
    </>
  );
};

export default HomeLayout;
