"use client";
import { useToastError } from "@/hooks/Toast";
import { getLedgerData } from "@/libraries/api";
import { LedgerData } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";
import { Visual } from "../atoms";

export const LedgerTemplate: React.FC = () => {
  const [data, setData] = useState<LedgerData>({
    ledgerRows: [{ date: "", description: "", additionalDescription: "", credit: 0, debit: 0, balanceChange: 0 }],
    lastBalance: 0,
  });
  const [loadingData, setLoadingData] = useState<boolean>(true);

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
          setData(LedgerData.data);
        } else {
          showErrorToast("Failed to fetch kategori data");
        }
      } catch {
        showErrorToast("Failed to fetch data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [ledgerAccount, router, showErrorToast]);

  if (loadingData) return <Visual.Spinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{ledgerName} ledger</h1>
        <h2 className="text-xl font-bold">Balance: Rp. {data.lastBalance} ,-</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.ledgerRows.length > 0 ? (
          data.ledgerRows
            // .sort((a, b) => {
            //   const dateA = new Date(a.date);
            //   const dateB = new Date(b.date);

            //   // 1. Sort by date (newest to oldest)
            //   if (dateA > dateB) return -1;
            //   if (dateA < dateB) return 1;

            //   // 2. Sort by description (if dates are equal)
            //   const descCompare = a.description.localeCompare(b.description);
            //   if (descCompare !== 0) return descCompare;

            //   // 3. Sort by additionalDescription (if description is also equal)
            //   return a.additionalDescription.localeCompare(b.additionalDescription);
            // })
            .map((item, i) => (
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
                  <span>Rp. {item.balanceChange.toLocaleString("id-ID")} ,-</span>
                  {item.debit ? (
                    <span className="text-green-600">+ Rp. {item.debit.toLocaleString("id-ID")} ,-</span>
                  ) : (
                    <span className="text-red-600">- Rp. {item.credit.toLocaleString("id-ID")} ,-</span>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div>Tidak ada data</div>
        )}
      </div>
    </div>
  );
};
