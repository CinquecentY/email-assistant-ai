import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import React, { Suspense } from "react";
import SearchBar from "../../search-bar";
import { Separator } from "@/components/ui/separator";
import { useThread } from "@/app/mail/use-thread";
import { useAtom } from "jotai";
import SearchDisplay from "../../search-display";
import { isSearchingAtom } from "@/lib/atoms";
import ThreadList from "./thread-list";
import ThreadDisplay from "./thread-display";

const MailDesktop = () => {
  const [threadId, setThreadId] = useThread();

  const [isSearching] = useAtom(isSearchingAtom);

  function selectThreadHandle(id: string) {
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
        <ThreadList selectThreadHandle={selectThreadHandle} />
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
