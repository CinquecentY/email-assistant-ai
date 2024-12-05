import { Tabs, TabsContent } from "@/components/ui/tabs";
import React, { Suspense } from "react";
import { useThread } from "@/app/mail/use-thread";
import { ResizablePanel } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SearchBar from "../../search-bar";
import { useAtom } from "jotai";
import SearchDisplay from "../../search-display";
import { isSearchingAtom, mailTabAtom } from "@/lib/atoms";
import ThreadList from "./thread-list";
import ThreadDisplay from "./thread-display";
import { ArrowLeft } from "lucide-react";

const MailMobile = () => {
  const [tab, setTab] = useAtom(mailTabAtom);

  const [threadId, setThreadId] = useThread();

  const [isSearching] = useAtom(isSearchingAtom);

  function selectThreadHandle(id: string) {
    setThreadId(id);
    setTab("threads");
  }

  return (
    <ResizablePanel>
      <Tabs defaultValue="mail" value={tab} className="h-screen">
        <TabsContent value="mail" className="h-full">
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
            <ThreadList selectThreadHandle={selectThreadHandle} />
          )}
        </TabsContent>
        <TabsContent value="threads" className="h-screen w-full">
          <div className="flex min-h-11 items-center p-2 pb-0">
            <Button
              aria-label="mail-button"
              data-testid="switch-tab"
              className={
                "h-7 rounded-b-none rounded-t-lg font-bold shadow md:hidden"
              }
              variant={"outline"}
              onClick={() => setTab("mail")}
            >
              <ArrowLeft /> Mail
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
