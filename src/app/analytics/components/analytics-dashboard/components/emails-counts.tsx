import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

const EmailsCounts = () => {
  const [accountId] = useLocalStorage("accountId", "");
  const refetchInterval = 30000;
  const { data: inboxThreads } = api.mail.getNumThreads.useQuery(
    {
      accountId,
      tab: "inbox",
    },
    { enabled: !!accountId, refetchInterval },
  );

  const { data: draftsThreads } = api.mail.getNumThreads.useQuery(
    {
      accountId,
      tab: "drafts",
    },
    { enabled: !!accountId, refetchInterval },
  );

  const { data: sentThreads } = api.mail.getNumThreads.useQuery(
    {
      accountId,
      tab: "sent",
    },
    { enabled: !!accountId, refetchInterval },
  );
  return (
    <>
      <Card className="relative z-30 flex w-fit flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
        <span className="text-xs text-muted-foreground">Inbox</span>
        <span className="text-lg font-bold leading-none sm:text-3xl">
          {inboxThreads ? inboxThreads : 0}
        </span>
      </Card>
      <Card className="relative z-30 flex w-fit flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
        <span className="text-xs text-muted-foreground">Sent</span>
        <span className="text-lg font-bold leading-none sm:text-3xl">
          {inboxThreads ? sentThreads : 0}
        </span>
      </Card>
      <Card className="relative z-30 flex w-fit flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
        <span className="text-xs text-muted-foreground">Draft </span>
        <span className="text-lg font-bold leading-none sm:text-3xl">
          {inboxThreads ? draftsThreads : 0}
        </span>
      </Card>
    </>
  );
};

export default EmailsCounts;
