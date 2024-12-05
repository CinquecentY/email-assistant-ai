import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import React, { Suspense } from "react";
import SearchBar from "../../search-bar";
import { Separator } from "@/components/ui/separator";
import { useThread } from "@/app/mail/use-thread";
import useThreads from "@/app/mail/use-threads";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";
import EmailDisplay from "../../email-display";
import ReplyBox from "../../reply-box";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import { useLocalStorage } from "usehooks-ts";
import SearchDisplay from "../../search-display";
import { isSearchingAtom } from "@/lib/atoms";
import ThreadList from "./thread-list";
import ThreadDisplay from "./thread-display";

const MailDesktop = () => {
  const { threads } = useThreads();

  const [threadId, setThreadId] = useThread();

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

  const [isSearching] = useAtom(isSearchingAtom);

  function selectThreadeHandle(id: string) {
    setThreadId(id);
  }

  return (
    <>
      <ResizablePanel defaultSize={32} minSize={30} className="h-screen w-full">
        <div className="flex items-center gap-4 px-4 py-2">
          <h1 data-testid="tab" className="text-xl font-bold">
            Mail
          </h1>
        </div>
        <Separator />
        <SearchBar />
        <ThreadList selectThreadeHandle={selectThreadeHandle} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={48} minSize={30} className="h-screen w-full">
        <div className="flex min-h-11 items-center p-2"></div>
        <article className="flex h-full max-h-[calc(100vh-50px)] w-full flex-1 flex-col gap-2 bg-background p-4 pt-0">
          {isSearching ? (
            <SearchDisplay />
          ) : (
            <Suspense>
              <ThreadDisplay threadId={threadId ?? ""} />
            </Suspense>
          )}
        </article>
      </ResizablePanel>
    </>
  );
};

export default MailDesktop;
