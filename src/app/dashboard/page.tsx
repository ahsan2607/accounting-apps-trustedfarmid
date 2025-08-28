// ./src/app/dashboard/page.tsx
"use client";
import { AccessibleAccount } from "@/types";
import { Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  { name: "Accounting", icon: Users, href: "/dashboard/cashflow-statements/accounting" },
];

export default function Home() {
  const [accessibleAccounts, setAccessibleAccounts] = useState<AccessibleAccount[]>([]);

  useEffect(() => {
    // Fetch session data to get accessible accounts
    async function fetchSession() {
      try {
        const response = await fetch('/api/get-session', {
          method: 'POST', // Matches updated /api/get-session/route.ts
          credentials: 'include',
        });
        if (response.ok) {
          const session = await response.json();
          setAccessibleAccounts(session.data?.accessibleAccounts || []);
        } else {
          console.error('Failed to fetch session:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    }
    fetchSession();
  }, []);
    console.log(accessibleAccounts)

  return (
    <nav className="p-4 bg-gray-50 min-h-screen">
      <ul className="space-y-2">
        {accessibleAccounts.map((account) =>
          menuItems.map((item) => (
            <li key={`${account.id}-${item.href}`}>
              <Link
                href={`${item.href}?account=${account.id}&name=${account.name}`}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition"
              >
                <item.icon className="w-5 h-5" />
                <span>{`${item.name} - ${account.name}`}</span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </nav>
  );
}