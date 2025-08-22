"use client";
import { OrderTemplate } from "@/components/templates/OrderTemplate";

export default function Dashboard() {
  return (
    <OrderTemplate formTitle="Veggies Order" targetSheet="Customer Order"></OrderTemplate>
  );
}
