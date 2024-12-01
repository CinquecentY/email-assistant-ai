import React, { Suspense } from "react";
import Mail from "./components/mail";

function MailDashboard() {
  return (
    <Suspense>
      <Mail />
    </Suspense>
  );
}

export default MailDashboard;
