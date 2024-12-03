"use client";
import { ResizablePanel } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";

import React from "react";
import EmailsChart from "./components/emails-chart";
import EmailsPie from "./components/emails-pie";
import ClientsDataTable from "./components/clients-data-table";
import EmailsCounts from "./components/emails-counts";
import EventsDataTable from "./components/events-data-table";
import dynamic from "next/dynamic";

const DashboardLayout = dynamic(
  () => import("@/components/layout/dashboard-layout"),
  {
    ssr: false,
  },
);
const AnalyticsDashboard = () => {
  return (
    <DashboardLayout>
      <ResizablePanel>
        <div className="flex items-center gap-4 px-4 py-2">
          <h1 className="text-xl font-bold">Analytics</h1>
        </div>
        <Separator />
        <section className="flex h-full max-h-[calc(100vh-50px)] flex-col flex-nowrap gap-2 overflow-y-auto bg-background p-4">
          <h1 className="text-lg font-bold">Emails</h1>
          <Separator />
          <section className="inline-flex flex-wrap items-center justify-evenly gap-2">
            <EmailsCounts />
          </section>
          <section className="flex flex-col flex-wrap justify-evenly gap-2 md:flex-row">
            <EmailsChart />
            <EmailsPie />
          </section>
          <Separator className="my-2" />
          <section className="flex w-full flex-col gap-2 md:flex-row">
            <ClientsDataTable />
            <EventsDataTable />
          </section>
        </section>
      </ResizablePanel>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
