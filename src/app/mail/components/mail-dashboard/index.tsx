"use client";
import React from "react";
import { useSearchParams, redirect } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardLayout from "@/components/layout/dashboard-layout";
import MailDisplay from "./components/mail-display";
import MailMobile from "./components/mail-mobile";
/*import dynamic from "next/dynamic";

const MailMobile = dynamic(() => import("./components/mail-mobile"), {
  ssr: false,
});
const MailDisplay = dynamic(() => import("./components/mail-display"), {
  ssr: false,
});
const DashboardLayout = dynamic(
  () => import("@/components/layout/dashboard-layout"),
  {
    ssr: false,
  },
);*/
const MailDashboard = () => {
  const searchParams = useSearchParams();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
  const isMobile = useIsMobile();

 /* React.useEffect(() => {
    const accountIdParams = searchParams.get("accountId");
    if (accountIdParams && accountIdParams !== accountId) {
      setAccountId(accountIdParams);
      redirect("/mail");
    }
  }, [accountId, searchParams, setAccountId]);*/
  return (
    <DashboardLayout>
      {isMobile ? <MailMobile /> : <MailDisplay />}
    </DashboardLayout>
  );
};

export default MailDashboard;
