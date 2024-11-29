"use client";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React from "react";
import { AccountSwitch } from "./account-switch";
import Sidebar from "./sidebar";
import ThreadList from "./thread-list";
import ThreadDisplay from "./thread-display";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/theme-toggle";
import ComposeButton from "./compose-button";
import SearchBar from "./search-bar";
import AskAI from "./ask-ai";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface MailProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="h-full min-h-screen items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={40}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true,
            )}`;
          }}
          onResize={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false,
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div className="flex h-full flex-1 flex-col">
            <div
              className={cn(
                "flex h-11 items-center justify-center",
                isCollapsed ? "h-11" : "px-2",
              )}
            >
              <AccountSwitch isCollapsed={isCollapsed} />
            </div>
            <Separator />
            <Sidebar isCollapsed={isCollapsed} />
            <div className="flex-1"></div>
            <AskAI isCollapsed={isCollapsed} />
            <ComposeButton />
            <ModeToggle />
            {
              // TODO Move these out man!
            }
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="flex items-center gap-4 px-4 py-2">
            <Button className={cn("h-7")} variant={"secondary"}>
              <ChevronLeft />
            </Button>
            <h1 className="text-xl font-bold">Inbox</h1>
          </div>
          <Separator />
          <SearchBar />
          <ThreadList />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <ThreadDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

export default Mail;
