"use client"
import DashboardLayout from "@/components/layout/dashboard-layout";
import React from "react";
import TemplatesMobile from "./components/templates-mobile";

const TemplatesDashboard = () => {
  return (
    <DashboardLayout>
      <TemplatesMobile/>
    </DashboardLayout>
  );
};
// Swap useLocalStorage with Atom
export default TemplatesDashboard;
