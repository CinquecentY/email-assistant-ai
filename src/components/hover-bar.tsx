"use client";
import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme-toggle";
import ComposeButton from "@/app/mail/components/compose-button";
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { House } from "lucide-react";

const HoverBar = () => {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  return (
    <div
      className={`absolute bottom-10 left-2 z-10 md:left-3 ${pathname === "/mail" && "bottom-1"}`}
    >
      <div className="flex flex-col items-center gap-3 rounded-xl bg-background p-2 md:flex-row md:px-4">
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
          <span className="md:w-56">
            <ComposeButton />
          </span>
        )}
      </div>
    </div>
  );
};

export default HoverBar;
