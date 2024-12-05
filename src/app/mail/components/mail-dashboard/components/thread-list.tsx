import React, { Fragment } from "react";
import { useThread } from "@/app/mail/use-thread";
import useThreads from "@/app/mail/use-threads";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";

interface ThreadListProps {
  selectThreadHandle: (threadId: string) => void;
}

const ThreadList = ({ selectThreadHandle }: ThreadListProps) => {
  const { threads } = useThreads();

  const [threadId] = useThread();

  const groupedThreads = threads?.reduce(
    (acc, thread) => {
      const date = format(thread.lastMessageDate ?? new Date(), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(thread);
      return acc;
    },
    {} as Record<string, typeof threads>,
  );

  return (
    <article className="flex h-full max-h-[calc(100vh-50px)] flex-1 flex-col gap-2 overflow-y-auto bg-background p-4 pt-0">
      {threads?.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground">No threads found</div>
        </div>
      )}
      {Object.entries(groupedThreads ?? {}).map(([date, threads]) => (
        <Fragment key={date}>
          <div className="mt-4 text-xs font-medium text-muted-foreground first:mt-0">
            {format(new Date(date), "MMMM d, yyyy")}
          </div>
          {threads.map((thread) => (
            <button
              id={`thread-${thread.id}`}
              key={thread.id}
              data-testid="show-thread-button"
              className={cn(
                "relative flex h-auto flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all",
              )}
              onClick={() => {
                selectThreadHandle(thread.id);
              }}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">
                      {thread.emails.at(-1)?.from?.name}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "ml-auto text-xs",
                      threadId === thread.id
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {formatDistanceToNow(
                      thread.emails.at(-1)?.sentAt ?? new Date(),
                      {
                        addSuffix: true,
                      },
                    )}
                  </div>
                </div>
                <div className="text-xs font-medium">{thread.subject}</div>
              </div>
              <div
                className="line-clamp-2 text-xs text-muted-foreground"
                dangerouslySetInnerHTML={{
                  // HACK Dangerously sanitzed using DOMPurify
                  __html: DOMPurify.sanitize(
                    thread.emails.at(-1)?.bodySnippet ?? "",
                    {
                      USE_PROFILES: { html: true },
                    },
                  ),
                }}
              ></div>
            </button>
          ))}
        </Fragment>
      ))}
    </article>
  );
};

export default ThreadList;
