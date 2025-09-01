import { AccountingTemplate } from "@/components/templates/AccountingTemplate";
import { Suspense } from "react";

export default function Accounting() {
  return (
    <Suspense>
      <AccountingTemplate />
    </Suspense>
  );
}
