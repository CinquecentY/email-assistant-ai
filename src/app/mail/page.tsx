import React, { Suspense } from "react";
import Mail from "./components/mail";
import { UserButton } from "@clerk/nextjs";
import ComposeButton from "./components/compose-button";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

function MailDashboard() {
  return (
    <>
      <div className="absolute bottom-3 left-3 z-10">
        <div className="flex items-center rounded bg-background p-2 backdrop-blur-sm">
          <span className="flex items-center gap-3">
            <Button variant={"secondary"} className="rounded-full p-1">
              <UserButton />
            </Button>
            <ModeToggle />
          </span>
          <span className="ml-12 w-56">
            <ComposeButton />
          </span>
        </div>
      </div>
      <Suspense>
        <Mail defaultLayout={[20, 32, 48]} navCollapsedSize={4} />
      </Suspense>
    </>
  );
}

export default MailDashboard;
