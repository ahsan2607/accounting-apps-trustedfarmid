"use client";
import { OrderTemplate } from "@/components/templates/OrderTemplate";

export default function Dashboard() {
  return (
    <OrderTemplate formTitle="Market Veggies Order" fixedCustomer="Customer Pasar TKI" targetSheet="Market Customer Order"></OrderTemplate>
  );
}
