import useThreads from "@/app/mail/use-threads";
import { api } from "@/trpc/react";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import EmailDisplay from "../../email-display";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";

const ReplyBox = dynamic(() => import("../../reply-box"), {});

interface ThreadDisplayProps {
  threadId?: string;
}

const ThreadDisplay = ({ threadId }: ThreadDisplayProps) => {
  const { threads } = useThreads();
  const _thread = threads?.find((t) => t.id === threadId);

  const [accountId] = useLocalStorage("accountId", "");

  const { data: foundThread } = api.mail.getThreadById.useQuery(
    {
      accountId: accountId,
      threadId: threadId ?? "",
    },
    { enabled: !!!_thread && !!threadId },
  );
  const thread = _thread ?? foundThread;

  return (
    <article className="h-full max-h-[calc(100vh-50px)] w-full bg-background">
      <>
        {thread ? (
          <div
            data-testid="thread"
            className="flex h-full max-h-full flex-col overflow-auto bg-background"
          >
            <div
              data-testid="thread-subject"
              className="line-clamp-3 w-full p-4 font-bold"
            >
              {thread.subject}
            </div>
            <Separator />
            <div className="flex flex-1 flex-col overflow-auto">
              <div className="flex flex-col gap-4">
                {thread.emails.map((email) => {
                  return <EmailDisplay key={email.id} email={email} />;
                })}
              </div>
            </div>
            <Separator />
            <ReplyBox />
          </div>
        ) : (
          <>
            <div className="h-full bg-background p-8 text-center text-muted-foreground">
              No message selected
            </div>
          </>
        )}
      </>
    </article>
  );
};

export default ThreadDisplay;
