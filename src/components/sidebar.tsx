import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { Inbox, Send, File, Archive, ChartNetwork } from "lucide-react";
import { api } from "@/trpc/react";

type SidebarProps = { isCollapsed: boolean; className?: string };

const Sidebar = ({ isCollapsed, className }: SidebarProps) => {
  const [tab] = useLocalStorage("email-assistant-ai-tab", "inbox");
  const [accountId] = useLocalStorage("accountId", "");

  const refetchInterval = 12000;
  const { data: inboxThreads } = api.mail.getNumThreads.useQuery(
    {
      accountId,
      tab: "inbox",
    },
    { enabled: !!accountId && !!tab, refetchInterval },
  );

  const { data: draftsThreads } = api.mail.getNumThreads.useQuery(
    {
      accountId,
      tab: "drafts",
    },
    { enabled: !!accountId && !!tab, refetchInterval },
  );

  const { data: sentThreads } = api.mail.getNumThreads.useQuery(
    {
      accountId,
      tab: "sent",
    },
    { enabled: !!accountId && !!tab, refetchInterval },
  );

  return (
    <>
      <Nav
        className={className}
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Inbox",
            path: "/mail",
            label: inboxThreads?.toString() ?? "0",
            icon: Inbox,
            variant: tab === "inbox" ? "default" : "ghost",
          },
          {
            title: "Drafts",
            path: "/mail",
            label: draftsThreads?.toString() ?? "0",
            icon: File,
            variant: tab === "drafts" ? "default" : "ghost",
          },
          {
            title: "Sent",
            path: "/mail",
            label: sentThreads?.toString() ?? "0",
            icon: Send,
            variant: tab === "sent" ? "default" : "ghost",
          },
          {
            title: "Mail Templates",
            path: "/templates",
            icon: Archive,
            variant: tab === "mail templates" ? "default" : "ghost",
          },
          {
            title: "Analytics",
            path: "/analytics",
            icon: ChartNetwork,
            variant: tab === "analytics" ? "default" : "ghost",
          },
        ]}
      />
    </>
  );
};

export default Sidebar;
