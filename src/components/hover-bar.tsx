"use client";
import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme-toggle";
import ComposeButton from "@/app/mail/components/compose-button";
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { House, Loader2 } from "lucide-react";
import useThreads from "@/app/mail/use-threads";

const HoverBar = () => {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const { isFetching } = useThreads();
  return (
    <div className="fixed bottom-1 left-2 z-10 flex flex-col items-center gap-3 rounded-xl bg-background p-2 shadow-md md:left-0 md:flex-row md:px-4">
      {isSignedIn && pathname === "/mail" && isFetching && (
        <Button
          variant={"ghost"}
          className="rounded-full p-2 md:hidden"
          asChild
        >
          <span>
            <Loader2 className="size-fit h-4 w-4 animate-spin" />
          </span>
        </Button>
      )}
      {isSignedIn && (
        <Button variant={"ghost"} className="rounded-full p-1">
          <UserButton />
        </Button>
      )}
      <Button variant={"ghost"} className="rounded-full p-2" asChild>
        <Link href="/">
          <House className="h-[1.2rem] w-[1.2rem]" />
        </Link>
      </Button>
      <ModeToggle />
      {isSignedIn && pathname === "/mail" && (
        <>
          <span className="md:w-56">
            <ComposeButton />
          </span>
          {isFetching && (
            <Button
              variant={"ghost"}
              className="hidden rounded-full p-2 md:block"
              asChild
            >
              <span>
                <Loader2 className="size-fit h-4 w-4 animate-spin" />
              </span>
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default HoverBar;
