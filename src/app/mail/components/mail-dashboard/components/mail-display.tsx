import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import React from "react";
import SearchBar from "../../search-bar";
import ThreadDisplay from "../../thread-display";
import ThreadList from "../../thread-list";
import { Separator } from "@/components/ui/separator";

const MailDisplay = () => {
  return (
    <>
      <ResizablePanel defaultSize={32} minSize={30}>
        <div className="flex items-center gap-4 px-4 py-2">
          <h1 className="text-xl font-bold">Inbox</h1>
        </div>
        <Separator />
        <SearchBar />
        <ThreadList />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={48} minSize={30}>
        <ThreadDisplay />
      </ResizablePanel>
    </>
  );
};

export default MailDisplay;
