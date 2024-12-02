"use client";
import DashboardLayout from "@/components/layout/dashboard-layout";
import React from "react";
import MailDisplay from "./components/mail-display";
import { useSearchParams, redirect } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { useIsMobile } from "@/hooks/use-mobile";
import MailMobile from "./components/mail-mobile";

const MailDashboard = () => {
  const searchParams = useSearchParams();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");

  React.useEffect(() => {
    const accountIdParams = searchParams.get("accountId");
    if (accountIdParams && accountIdParams !== accountId) {
      setAccountId(accountIdParams);
      redirect("/mail");
    }
  }, [accountId, searchParams, setAccountId]);
  const isMobile = useIsMobile();
  return (
    <DashboardLayout>
      {isMobile ? <MailMobile /> : <MailDisplay />}
    </DashboardLayout>
  );
};

export default MailDashboard;
