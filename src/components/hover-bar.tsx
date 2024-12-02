"use client";
import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme-toggle";
import ComposeButton from "@/app/mail/components/compose-button";
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { House, Loader2, Sparkle, Sparkles } from "lucide-react";
import useThreads from "@/app/mail/use-threads";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import AskAI from "@/app/mail/components/ask-ai";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { isCollapsedAtom } from "./layout/dashboard-layout";

const HoverBar = () => {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const { isFetching } = useThreads();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useAtom(isCollapsedAtom);
  // TODO arial-label all buttons
  return (
    <div
      className={cn(
        "fixed bottom-1.5 left-1 z-10 flex flex-col items-center gap-3 rounded-xl bg-background p-2 shadow-md md:left-0 md:flex-row md:px-4",
        isCollapsed && isMobile && "hidden",
      )}
    >
      {isSignedIn && pathname === "/mail" && isFetching && (
        <Button
          variant={"ghost"}
          className="rounded-full p-2 md:hidden"
          asChild
        >
          <span>
            <Loader2 className="h-[1.2rem] w-[1.2rem] animate-spin" />
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
      {isSignedIn && isMobile && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"ghost"} className="rounded-full p-1">
              <Sparkles className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ask AI</DialogTitle>
            </DialogHeader>
            <AskAI isCollapsed={false} />
          </DialogContent>
        </Dialog>
      )}
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
                <Loader2 className="h-[1.2rem] w-[1.2rem] animate-spin" />
              </span>
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default HoverBar;
