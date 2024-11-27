import React from "react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { Inbox, Send, File } from "lucide-react";

type SidebarProps = { isCollapsed: boolean };

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const [tab] = useLocalStorage("email-assistant-ai-tab", "inbox");
  const [accountId] = useLocalStorage("accountId", "");

  return (
    <>
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Inbox",
            label: "1",
            icon: Inbox,
            variant: tab === "inbox" ? "default" : "ghost",
          },
          {
            title: "Drafts",
            label: "4",
            icon: File,
            variant: tab === "drafts" ? "default" : "ghost",
          },
          {
            title: "Sent",
            label: "0",
            icon: Send,
            variant: tab === "sent" ? "default" : "ghost",
          },
        ]}
      />
    </>
  );
};

export default Sidebar;
