"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getCustomerList, getItemList, submitOrders, logout } from "@/libraries/api";
import { Order } from "@/types";
import { Field } from "@/components/molecules/";
import { Button } from "@/components/atoms/buttons/Button";

export default function Dashboard() {
  const [customers, setCustomers] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");
  const [orders, setOrders] = useState<Omit<Order, "customer">[]>([{ item: "", qty: "" }]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // ✅ loading state

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("authenticated")) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [customerRes, itemRes] = await Promise.all([getCustomerList(), getItemList()]);
        if (customerRes.success) {
          setCustomers(["-- Select Customer --", ...(customerRes.data || [])]);
        }
        if (itemRes.success) {
          setItems(["-- Select Item --", ...(itemRes.data || [])]);
        }
        if (!customerRes.success || !itemRes.success) {
          setMessage("Failed to fetch some data");
        }
      } catch {
        setMessage("Failed to fetch data");
      }
    };
    fetchData();
  }, [router]);

  const handleAddOrder = () => {
    setOrders([...orders, { item: "", qty: "" }]);
  };

  const handleRemoveOrder = (index: number) => {
    setOrders(orders.filter((_, i) => i !== index));
  };

  const handleOrderChange = (index: number, field: keyof Omit<Order, "customer">, value: string) => {
    const newOrders = [...orders];
    newOrders[index] = { ...newOrders[index], [field]: value };
    setOrders(newOrders);
  };

  const handleSubmitOrders = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true); // ✅ Start loading

    const ordersWithCustomer: Order[] = orders.map((o) => ({
      ...o,
      customer,
    }));

    const response = await submitOrders(deliveryDate, ordersWithCustomer, "Market Customer Order");
    setLoading(false); // ✅ Stop loading

    if (response.success) {
      setMessage(response.data || "Orders submitted successfully");
      setDeliveryDate("");
      setCustomer("");
      setOrders([{ item: "", qty: "" }]);
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage(response.error || "Failed to submit orders");
    }
  };

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      localStorage.removeItem("authenticated");
      router.push("/login");
    } else {
      setMessage(response.error || "Failed to logout");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={handleLogout} variant="danger">
          Logout
        </Button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Order Veggies</h2>
      <form onSubmit={handleSubmitOrders} className="space-y-4 mb-8">
        <Field.Date
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required
          className="w-full border rounded p-2"
        />

        <Field.Dropdown
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          required
          className="w-full border rounded p-2"
          options={customers.map((c) => ({ label: c, value: c }))}
        />

        {orders.map((order, index) => (
          <div key={index} className="flex space-x-2 items-center">
            <Field.Dropdown
              value={order.item}
              onChange={(e) => handleOrderChange(index, "item", e.target.value)}
              required
              className="w-full border rounded p-2"
              options={items.map((item) => ({ label: item, value: item }))}
            />
            <Field.Number
              value={order.qty}
              onChange={(e) => handleOrderChange(index, "qty", e.target.value)}
              placeholder="Quantity"
              required
              className="w-full border rounded p-2"
            />

            {/* ✅ Remove button if more than one order */}
            {orders.length > 1 && (
              <Button type="button" variant="danger" onClick={() => handleRemoveOrder(index)}>
                Delete Order
              </Button>
            )}
          </div>
        ))}

        <div className="flex space-x-2">
          <Button type="button" onClick={handleAddOrder} variant="secondary">
            Add Order
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Orders"} {/* ✅ Loading indicator */}
          </Button>
        </div>
      </form>

      {message && <p className={message.includes("success") ? "text-green-500" : "text-red-500"}>{message}</p>}
    </div>
  );
}
