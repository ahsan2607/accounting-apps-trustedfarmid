import { ClipboardList, Users } from "lucide-react";
import Link from "next/link";

const menuItems = [
  // { name: "Inventory Accounting", icon: Package, href: "/dashboard/cashflow-statements/inventory-accounting" },
  { name: "Main Accounting", icon: Users, href: "/dashboard/cashflow-statements/operator-accounting" },
  { name: "Operational Accounting", icon: ClipboardList, href: "/dashboard/cashflow-statements/operational-accounting" },
  // { name: "Veggies Order", icon: ShoppingCart, href: "/dashboard/cashflow-statements/veggies-order" },
  // { name: "Market Veggies Order", icon: Store, href: "/dashboard/cashflow-statements/market-veggies-order" },
];

export default function Home() {
  return (
    <nav className="p-4 bg-gray-50 min-h-screen">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition">
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
