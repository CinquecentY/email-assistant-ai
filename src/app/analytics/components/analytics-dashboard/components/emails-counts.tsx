import { Card } from "@/components/ui/card";
import React from "react";

const EmailsCounts = () => {
  return (
    <>
      <Card className="relative z-30 flex w-fit flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
        <span className="text-xs text-muted-foreground">Inbox</span>
        <span className="text-lg font-bold leading-none sm:text-3xl">34</span>
      </Card>
      <Card className="relative z-30 flex w-fit flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
        <span className="text-xs text-muted-foreground">Sent</span>
        <span className="text-lg font-bold leading-none sm:text-3xl">0</span>
      </Card>
      <Card className="relative z-30 flex w-fit flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
        <span className="text-xs text-muted-foreground">Draft </span>
        <span className="text-lg font-bold leading-none sm:text-3xl">0</span>
      </Card>
    </>
  );
};

export default EmailsCounts;
