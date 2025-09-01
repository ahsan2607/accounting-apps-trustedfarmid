"use client";
import { useToastError } from "@/hooks/Toast";
import { getLedgerData } from "@/libraries/api";
import { LedgerData } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

export const LedgerTemplate: React.FC = () => {
  const [data, setData] = useState<LedgerData[]>([]);

  const showErrorToast = useToastError();

  const router = useRouter();
  const searchParams = useSearchParams();

  const ledgerAccount = searchParams.get("account") || "";
  const ledgerName = searchParams.get("name") || "";

  useEffect(() => {
    if (!localStorage.getItem("trusted-farm-id-accounting-app-authenticated")) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const LedgerData = await getLedgerData(`${ledgerAccount} Ledger`);
        if (LedgerData.success && LedgerData.data) {
          setData([...Object.values(LedgerData.data)]);
        } else {
          showErrorToast("Failed to fetch kategori data");
        }
      } catch {
        showErrorToast("Failed to fetch data");
      }
    };

    fetchData();
  }, [ledgerAccount, router, showErrorToast]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{ledgerName} ledger</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item, i) => (
          <div key={i} className="rounded shadow bg-white p-3 border border-gray-200">
            <p className="text-sm text-gray-500">
              {new Date(item.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h2 className="text-lg font-semibold">{item.description}</h2>
            <p className="text-gray-600">{item.additionalDescription}</p>
            <div className="flex justify-between mt-3 text-sm">
              <span className="text-green-600">+ Rp{item.debit.toLocaleString()}</span>
              <span className="text-red-600">- Rp{item.credit.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
