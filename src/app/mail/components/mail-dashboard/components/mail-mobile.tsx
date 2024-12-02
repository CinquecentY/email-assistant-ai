import { Tabs, TabsContent } from "@/components/ui/tabs";
import React from "react";
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

  return (
    <ResizablePanel>
      <Tabs defaultValue="inbox" value={tab} className="h-screen">
        <TabsContent value="inbox" className="h-full">
          <div className="flex items-center gap-4 px-4 py-1">
            <h1 className="text-lg font-bold">Inbox</h1>
          </div>
          <Separator />
          <SearchBar />
          {isSearching ? (
            <SearchDisplay />
          ) : (
            <article className="flex h-full max-h-[calc(100vh-50px)] flex-1 flex-col gap-2 overflow-y-auto bg-background p-4 pt-0">
              {threads?.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <div className="text-muted-foreground">No threads found</div>
                </div>
              )}
              {Object.entries(groupedThreads ?? {}).map(([date, threads]) => (
                <React.Fragment key={date}>
                  <div className="mt-4 text-xs font-medium text-muted-foreground first:mt-0">
                    {format(new Date(date), "MMMM d, yyyy")}
                  </div>
                  {threads.map((item) => (
                    <button
                      id={`thread-${item.id}`}
                      key={item.id}
                      className={cn(
                        "relative flex h-auto flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all",
                      )}
                      onClick={() => {
                        setTab("threads");
                        setThreadId(item.id);
                      }}
                    >
                      <div className="flex w-full flex-col gap-1">
                        <div className="flex items-center">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">
                              {item.emails.at(-1)?.from?.name}
                            </div>
                          </div>
                          <div
                            className={cn(
                              "ml-auto text-xs",
                              threadId === item.id
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {formatDistanceToNow(
                              item.emails.at(-1)?.sentAt ?? new Date(),
                              {
                                addSuffix: true,
                              },
                            )}
                          </div>
                        </div>
                        <div className="text-xs font-medium">
                          {item.subject}
                        </div>
                      </div>
                      <div
                        className="line-clamp-2 text-xs text-muted-foreground"
                        dangerouslySetInnerHTML={{
                          // HACK Dangerously sanitzed using DOMPurify
                          __html: DOMPurify.sanitize(
                            item.emails.at(-1)?.bodySnippet ?? "",
                            {
                              USE_PROFILES: { html: true },
                            },
                          ),
                        }}
                      ></div>
                    </button>
                  ))}
                </React.Fragment>
              ))}
            </article>
          )}
        </TabsContent>
        <TabsContent value="threads" className="h-screen w-full">
          <div className="flex min-h-11 items-center p-2">
            <Button
              className={"h-7 md:hidden"}
              variant={"outline"}
              onClick={() => setTab("inbox")}
            >
              <h1 className="text-lg font-bold">Inbox</h1>
            </Button>
          </div>
          <article className="h-full max-h-[calc(100vh-50px)] w-full bg-background">
            <>
              {thread ? (
                <div className="flex h-full max-h-full flex-col overflow-auto bg-background">
                  <div className="line-clamp-3 w-full p-4 font-bold">
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
                    No message selected {threadId}
                  </div>
                </>
              )}
            </>
          </article>
        </TabsContent>
      </Tabs>
    </ResizablePanel>
  );
};

export default MailMobile;
