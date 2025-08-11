// ./src/app/dashboard/page.ts
"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  getCustomerList,
  getItemList,
  getKategoriData,
  submitOrders,
  submitFormOperationalAccounting,
  logout,
} from "@/libraries/api";
import { Order, OperationalAccountingData } from "@/types";
import { Field } from "@/components/molecules/";
import { Button } from "@/components/atoms/buttons/Button";

export default function Dashboard() {
  const [customers, setCustomers] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([{ customer: "", item: "", qty: "" }]);
  const [accountingData, setAccountingData] = useState<OperationalAccountingData>({
    tanggal: "",
    nominal: "",
    keterangan: "",
  });
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("authenticated")) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [customerRes, itemRes, kategoriRes] = await Promise.all([
          getCustomerList(),
          getItemList(),
          getKategoriData(),
        ]);
        if (customerRes.success) setCustomers(customerRes.data || []);
        if (itemRes.success) setItems(itemRes.data || []);
        if (kategoriRes.success) {
          setSubCategories(Object.keys(kategoriRes.data || {}));
        }
        if (!customerRes.success || !itemRes.success || !kategoriRes.success) {
          setMessage("Failed to fetch some data");
        }
      } catch {
        setMessage("Failed to fetch data");
      }
    };
    fetchData();
  }, [router]);

  const handleAddOrder = () => {
    setOrders([...orders, { customer: "", item: "", qty: "" }]);
  };

  const handleOrderChange = (index: number, field: keyof Order, value: string) => {
    const newOrders = [...orders];
    newOrders[index] = { ...newOrders[index], [field]: value };
    setOrders(newOrders);
  };

  const handleSubmitOrders = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    const response = await submitOrders(deliveryDate, orders);
    setMessage(
      response.success ? response.data || "Orders submitted successfully" : response.error || "Failed to submit orders"
    );
  };

  const handleAccountingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAccountingData({ ...accountingData, [e.target.name]: e.target.value });
  };

  const handleSubmitAccounting = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    if (!subCategories.includes(accountingData.keterangan)) {
      setMessage("Invalid keterangan selected");
      return;
    }
    const response = await submitFormOperationalAccounting(accountingData);
    setMessage(
      response.success
        ? response.data || "Accounting data submitted successfully"
        : response.error || "Failed to submit accounting data"
    );
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
        {orders.map((order, index) => (
          <div key={index} className="flex space-x-2">
            <Field.Dropdown
              value={order.customer}
              onChange={(e) => handleOrderChange(index, "customer", e.target.value)}
              required
              className="w-full border rounded p-2"
              options={customers.map((item) => {
                return { label: item, value: item };
              })}
            />
            <Field.Dropdown
              value={order.item}
              onChange={(e) => handleOrderChange(index, "item", e.target.value)}
              required
              className="w-full border rounded p-2"
              options={items.map((item) => {
                return { label: item, value: item };
              })}
            />
            <Field.Number
              value={order.qty}
              onChange={(e) => handleOrderChange(index, "qty", e.target.value)}
              placeholder="Quantity"
              required
              className="w-full border rounded p-2"
            />
          </div>
        ))}
        <div className="flex space-x-2">
          <Button type="button" onClick={handleAddOrder} variant="secondary">
            Add Order
          </Button>
          <Button type="submit" variant="primary">
            Submit Orders
          </Button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-2">Operational Accounting</h2>
      <form onSubmit={handleSubmitAccounting} className="space-y-4">
        <Field.Date
          name="tanggal"
          label="Tanggal Pengeluaran"
          value={accountingData.tanggal}
          onChange={handleAccountingChange}
          required
        />
        <Field.Number
          id="nominal"
          name="nominal"
          label="Nominal Pengeluaran"
          value={accountingData.nominal}
          onChange={handleAccountingChange}
          required
          className="w-full"
        />
        <Field.Dropdown
          id="keterangan"
          name="keterangan"
          label="Jenis Pengeluaran"
          value={accountingData.keterangan}
          onChange={handleAccountingChange}
          options={subCategories.map((item) => {
            return { label: item, value: item };
          })}
          required
          className="w-full"
        />
        <Button type="submit" variant="primary">
          Tambah Data
        </Button>
      </form>

      {message && <p className={message.includes("success") ? "text-green-500" : "text-red-500"}>{message}</p>}
    </div>
  );
}
