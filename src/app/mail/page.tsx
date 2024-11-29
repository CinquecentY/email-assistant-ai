import React from "react";
import Mail from "./components/mail";
import { UserButton } from "@clerk/nextjs";
import ComposeButton from "./components/compose-button";
import { ModeToggle } from "@/components/theme-toggle";

const MailDashboard = () => {
  return (
    <>
      <div className="absolute bottom-4 left-3 z-10">
        <div className="flex items-center">
          <span className="flex items-center gap-3">
          <UserButton />
          <ModeToggle />
          </span>
          <span className="ml-12 w-56">
          <ComposeButton />
          </span>
        </div>
      </div>
      <Mail defaultLayout={[20, 32, 48]} navCollapsedSize={4} />
    </>
  );
};

export default MailDashboard;
