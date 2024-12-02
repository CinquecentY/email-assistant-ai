"use client"
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ResizablePanel } from "@/components/ui/resizable";
import React from "react";

const TemplatesDashboard = () => {
  return (
    <DashboardLayout>
      <ResizablePanel>
        <div>TemplatesDashboard</div>
      </ResizablePanel>
    </DashboardLayout>
  );
};

export default TemplatesDashboard;
