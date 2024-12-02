import { AccountSwitch } from "@/app/mail/components/account-switch";
import AskAI from "@/app/mail/components/ask-ai";
import { cn } from "@/lib/utils";
import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "../ui/tooltip";
import { Separator } from "../ui/separator";
import { atom, useAtom } from "jotai";
import Sidebar from "@/app/mail/components/sidebar";

export const isCollapsedAtom = atom(false);

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [isCollapsed, setIsCollapsed] = useAtom(isCollapsedAtom);
  const isMobile = useIsMobile();
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full min-h-screen items-stretch"
    >
      <ResizablePanel
        collapsedSize={isMobile ? 0 : 4}
        defaultSize={20}
        collapsible={true}
        minSize={20}
        maxSize={isMobile ? 20 : 40}
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
          isCollapsed ||
            (isMobile &&
              "min-w-[50px] transition-all duration-300 ease-in-out"),
        )}
      >
        <div
          className={cn(
            "flex h-full flex-1 flex-col",
            isMobile && "border-r-2 border-solid",
          )}
        >
          <div
            className={cn(
              "flex h-11 items-center justify-center",
              isCollapsed || isMobile ? "h-11" : "px-2",
            )}
          >
            <AccountSwitch isCollapsed={isCollapsed || isMobile} />
          </div>
          <Separator />
          <Sidebar isCollapsed={isCollapsed || isMobile} />
          <div className="flex-1 bg-background"></div>
          <AskAI isCollapsed={isCollapsed || isMobile} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      {children}
    </ResizablePanelGroup>
  );
};

export default DashboardLayout;
