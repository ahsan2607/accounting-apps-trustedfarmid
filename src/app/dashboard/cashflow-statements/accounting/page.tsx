import { AccountingTemplate } from "@/components/templates/AccountingTemplate";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <Suspense>
      <AccountingTemplate />
    </Suspense>
  );
}
