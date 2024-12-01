"use client";
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import React from "react";
import ThreadList from "./thread-list";
import ThreadDisplay from "./thread-display";
import SearchBar from "./search-bar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import DashboardLayout from "@/components/layout/dashboard-layout";

export function Mail() {
  const searchParams = useSearchParams();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");

  React.useEffect(() => {
    document.title = "Email Assistant AI";
    const accountIdParams = searchParams.get("accountId");
    if (accountIdParams && accountIdParams !== accountId) {
      setAccountId(accountIdParams);
      redirect("/mail");
    }
  }, [accountId, searchParams, setAccountId]);
  // TODO Keep an eye on this one
  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
}

export default Mail;
