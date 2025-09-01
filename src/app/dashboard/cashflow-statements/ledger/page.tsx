import { LedgerTemplate } from "@/components/templates/LedgerTemplate";
import { Suspense } from "react";

export default function Ledger() {
  return (
    <Suspense>
      <LedgerTemplate />
    </Suspense>
  );
}
