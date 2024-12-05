"use client";
import React from "react";
import TemplatesMobile from "./components/templates-mobile";
import { useIsMobile } from "@/hooks/use-mobile";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import TemplatesDesktop from "./components/templates-desktop";

const DashboardLayout = dynamic(
  () => import("@/components/layout/dashboard-layout"),
  {
    loading: () => (
      <section className="flex min-h-screen items-center bg-background justify-center">
        <Loader2 className="size-32 animate-spin" />
      </section>
    ),
    ssr: false,
  },
);

const TemplatesDashboard = () => {
  const isMobile = useIsMobile();
  return (
    <DashboardLayout>
      {isMobile ? <TemplatesMobile /> : <TemplatesDesktop />}
    </DashboardLayout>
  );
};
export default TemplatesDashboard;
