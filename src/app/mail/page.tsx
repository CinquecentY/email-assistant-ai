import React, { Suspense } from "react";
import MailDashboard from "./components/mail-dashboard";

function MailPage() {
  return (
    <Suspense>
      <MailDashboard />
    </Suspense>
  );
}

export default MailPage;
