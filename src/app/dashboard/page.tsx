// ./src/app/dashboard/page.tsx
"use client";
import { Visual } from "@/components/atoms";
import { useToastError } from "@/hooks/Toast";
import { getAllLedgerAccounts } from "@/libraries/api";
import { AccessibleAccount, ledgerAccounts } from "@/types";
import { Coins, Table, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  { name: "Accounting", icon: Coins, href: "/dashboard/cashflow-statements/accounting" },
  { name: "Ledger", icon: Table, href: "/dashboard/cashflow-statements/ledger" },
];

export default function Home() {
  const [accessibleAccounts, setAccessibleAccounts] = useState<AccessibleAccount[]>([]);
  const [ledgerAccounts, setLedgerAccounts] = useState<ledgerAccounts[]>([]);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
  const [roles, setRoles] = useState<string>("Roles");
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const showErrorToast = useToastError();

  const toggle = (href: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [href]: !prev[href], // toggle only this one
    }));
  };

  useEffect(() => {
    // Fetch session data to get accessible accounts
    async function fetchSession() {
      try {
        const response = await fetch("/api/get-session", {
          method: "POST", // Matches updated /api/get-session/route.ts
          credentials: "include",
        });
        if (response.ok) {
          const session = await response.json();
          setAccessibleAccounts(session.data?.accessibleAccounts || []);
          setRoles(session.data.role);
        } else {
          console.error("Failed to fetch session:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    }
    async function fetchData() {
      try {
        const response = await getAllLedgerAccounts();
        if (response.success && response.data) {
          setLedgerAccounts([...Object.values(response.data).sort((a, b) => a.name.localeCompare(b.name))]);
        } else {
          showErrorToast("Failed to fetch ledger data");
        }
      } catch {
        showErrorToast("Failed to fetch data");
      } finally {
        setLoadingData(false);
      }
    }

    // try {
    fetchSession();
    fetchData();
    // } catch (error) {
    //   showErrorToast(`Error: ${error}`);
    // }
  }, [showErrorToast]);

  if (loadingData) return <Visual.Spinner />;

  return (
    <nav className="p-4 bg-gray-50 min-h-screen">
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const isOpen = openAccordions[item.href] || false;
          return (
            <li key={item.href}>
              {/* Accordion Header */}
              <button
                onClick={() => toggle(item.href)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-200 transition"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`} />
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <ul className="pl-6 mt-1 space-y-1">
                  {roles.toLowerCase().includes("owner") && item.name === "Ledger"
                    ? ledgerAccounts.map((account) => (
                        <li key={`${item.href}-${account.id}`}>
                          <Link
                            href={`${item.href}?account=${account.id}&name=${account.name}`}
                            className="block p-2 rounded-lg hover:bg-gray-100 transition"
                          >
                            {account.name}
                          </Link>
                        </li>
                      ))
                    : accessibleAccounts.map((account) => (
                        <li key={`${item.href}-${account.id}`}>
                          <Link
                            href={`${item.href}?account=${account.id}&name=${account.name}`}
                            className="block p-2 rounded-lg hover:bg-gray-100 transition"
                          >
                            {account.name}
                          </Link>
                        </li>
                      ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
