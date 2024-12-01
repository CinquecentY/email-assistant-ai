"use client";
import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme-toggle";
import ComposeButton from "@/app/mail/components/compose-button";
import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { House } from "lucide-react";
import { motion } from "framer-motion";

const HoverBar = () => {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  return (
    <motion.div
      layoutId="hover-bar"
      className="fixed bottom-10 left-2 z-10 flex flex-col items-center gap-3 rounded-xl bg-background p-2 shadow-md md:left-3 md:flex-row md:px-4"
    >
      {isSignedIn && pathname === "/mail" && (
        <span className="md:w-56">
          <ComposeButton />
        </span>
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
    </motion.div>
  );
};

export default HoverBar;
