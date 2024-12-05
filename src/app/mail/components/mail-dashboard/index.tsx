"use client";
import React from "react";
import { useSearchParams, redirect } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import { useIsMobile } from "@/hooks/use-mobile";
import MailDesktop from "./components/mail-desktop";
import MailMobile from "./components/mail-mobile";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const DashboardLayout = dynamic(
  () => import("@/components/layout/dashboard-layout"),
  {
    loading: () => (
      <section className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-32 animate-spin" />
      </section>
    ),
    ssr: false,
  },
);
const MailDashboard = () => {
  /*const searchParams = useSearchParams();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");*/
  const isMobile = useIsMobile();

  /*React.useEffect(() => {
    const accountIdParams = searchParams.get("accountId");
    if (accountIdParams && accountIdParams !== accountId) {
      setAccountId(accountIdParams);
      redirect("/mail");
    }
  }, [accountId, searchParams, setAccountId]);*/
  return (
    <DashboardLayout>
      {isMobile ? <MailMobile /> : <MailDesktop />}
    </DashboardLayout>
  );
};

export default MailDashboard;
