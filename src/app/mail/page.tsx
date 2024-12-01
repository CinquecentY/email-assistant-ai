import React, { Suspense } from "react";
import Mail from "./components/mail";

function MailDashboard() {
  return (
    <Suspense>
      <Mail defaultLayout={[20, 32, 48]} navCollapsedSize={4} />
    </Suspense>
  );
}

export default MailDashboard;
