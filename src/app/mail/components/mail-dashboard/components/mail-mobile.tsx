import { Tabs, TabsContent } from "@/components/ui/tabs";
import React, { Suspense } from "react";
import { useThread } from "@/app/mail/use-thread";
import useThreads from "@/app/mail/use-threads";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";
import { ResizablePanel } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SearchBar from "../../search-bar";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import { useLocalStorage } from "usehooks-ts";
import EmailDisplay from "../../email-display";
import ReplyBox from "../../reply-box";
import SearchDisplay from "../../search-display";
import { isSearchingAtom, tabAtom } from "@/lib/atoms";
import ThreadList from "./thread-list";
import ThreadDisplay from "./thread-display";

const MailMobile = () => {
  const [tab, setTab] = useAtom(tabAtom);

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
    setTab("threads");
  }

  return (
    <ResizablePanel>
      <Tabs defaultValue="inbox" value={tab} className="h-screen">
        <TabsContent value="inbox" className="h-full">
          <div className="flex items-center gap-4 px-4 py-1">
            <h1 data-testid="tab" className="text-lg font-bold">
              Mail
            </h1>
          </div>
          <Separator />
          <SearchBar />
          {isSearching ? (
            <SearchDisplay />
          ) : (
            <ThreadList selectThreadeHandle={selectThreadeHandle} />
          )}
        </TabsContent>
        <TabsContent value="threads" className="h-screen w-full">
          <div className="flex min-h-11 items-center p-2">
            <Button
              data-testid="switch-tab"
              className={"h-7 md:hidden"}
              variant={"outline"}
              onClick={() => setTab("inbox")}
            >
              <h1 className="text-lg font-bold">Inbox</h1>
            </Button>
          </div>
          <Suspense>
            <ThreadDisplay threadId={threadId ?? ""} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  );
};

export default MailMobile;
