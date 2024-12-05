import { AccountSwitch } from "@/components/account-switch";
import AskAI from "@/components/ask-ai";
import { cn } from "@/lib/utils";
import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "../ui/separator";
import { useAtom } from "jotai";
import Sidebar from "@/components/sidebar";
import { isCollapsedAtom } from "@/lib/atoms";


const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [isCollapsed, setIsCollapsed] = useAtom(isCollapsedAtom);
  const isMobile = useIsMobile();
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen"
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
          "flex flex-col h-screen",
          isCollapsed ||
            (isMobile &&
              "min-w-[50px] transition-all duration-300 ease-in-out"),
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
        <Sidebar
          className="bg-background"
          isCollapsed={isCollapsed || isMobile}
        />
        <div className="flex-1 bg-background flex justify-center items-end pb-20 px-2">
          <AskAI isCollapsed={isCollapsed || isMobile} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      {children}
    </ResizablePanelGroup>
  );
};

export default DashboardLayout;
