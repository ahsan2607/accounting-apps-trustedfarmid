"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getCustomerList, getItemList, submitOrders } from "@/libraries/api";
import { Order } from "@/types";
import { Field } from "@/components/molecules/";
import { Interactive } from "@/components/atoms/";
import { useToastSuccess, useToastError } from "@/hooks/Toast";
import { ToastContainer } from "react-toastify";
import { X } from "lucide-react";

type OrderTemplateProps = {
  fixedCustomer?: string;
  targetSheet: string;
  formTitle: string;
};

export const OrderTemplate: React.FC<OrderTemplateProps> = ({ fixedCustomer, targetSheet, formTitle }) => {
  const [customers, setCustomers] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");
  const [orders, setOrders] = useState<Omit<Order, "customer">[]>([{ item: "", qty: "" }]);
  const [loading, setLoading] = useState<boolean>(false);

  const showErrorToast = useToastError();
  const showSuccessToast = useToastSuccess();

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("trusted-farm-id-accounting-app-authenticated")) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [customerRes, itemRes] = await Promise.all([getCustomerList(), getItemList()]);
        if (customerRes.success && !fixedCustomer) {
          setCustomers(["Pilih Pelanggan", ...(customerRes.data || [])]);
        } else if (fixedCustomer) {
          setCustomer(fixedCustomer);
        }
        if (itemRes.success) {
          setItems(["Pilih Sayur", ...(itemRes.data || [])]);
        }
        if (!customerRes.success || !itemRes.success) {
          showErrorToast("Failed to fetch some data");
        }
      } catch {
        showErrorToast("Failed to fetch data");
      }
    };
    fetchData();
  }, [fixedCustomer, router, showErrorToast]);

  const validateForm = () => {
    const errs: string[] = [];

    if (!deliveryDate) {
      errs.push("Tanggal harus diisi.");
    } else {
      const today = new Date();
      const selectedDate = new Date(deliveryDate);
      if (selectedDate < new Date(today.toDateString())) {
        errs.push("Tanggal kirim tidak bisa di masa lalu.");
      }
    }

    if (!fixedCustomer && (!customer || customer === "Pilih Pelanggan")) {
      errs.push("Pelanggan harus diisi.");
    }

    orders.forEach((order, idx) => {
      if (!order.item || order.item === "Pilih Sayur") {
        errs.push(`Order #${idx + 1}: Item harus dipilih.`);
      }
      const qtyNum = Number(order.qty);
      if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
        errs.push(`Order #${idx + 1}: Jumlah harus bilangan bulat positif.`);
      }
    });

    return errs;
  };

  const getAvailableItems = (currentIndex: number) => {
    const selectedItems = orders.map((o) => o.item);
    return items.filter(
      (item) => item === "Pilih Sayur" || item === orders[currentIndex].item || !selectedItems.includes(item)
    );
  };

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

    const errs = validateForm();
    if (errs.length > 0) {
      errs.forEach((err) => showErrorToast(err));
      return;
    }

    setLoading(true);
    const ordersWithCustomer: Order[] = orders.map((o) => ({
      ...o,
      customer,
    }));

    const response = await submitOrders(deliveryDate, ordersWithCustomer, targetSheet);
    setLoading(false);

    if (response.success) {
      showSuccessToast(response.data || "Orders submitted successfully");
      setDeliveryDate("");
      if (fixedCustomer) setCustomer(fixedCustomer);
      else setCustomer("");
      setOrders([{ item: "", qty: "" }]);
    } else {
      showErrorToast(response.error || "Failed to submit orders");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{formTitle}</h1>
      </div>

      <form onSubmit={handleSubmitOrders} className="space-y-4 mb-8">
        <Field.Date
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          label="Tanggal Pengiriman"
          className="w-full"
        />

        {!fixedCustomer ? (
          <Field.Dropdown
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            options={customers.map((c) => ({ label: c, value: c }))}
            label="Pelanggan"
            className="w-full"
          />
        ) : null}

        <h2 className="text-xl font-semibold mb-2">Detail Order</h2>
        {orders.map((order, index) => (
          <div key={index} className="flex flex-col gap-1 w-full border border-gray-100 shadow-md rounded p-3">
            <div className="w-full flex">
              <h3 className="w-4/5 text-lg font-semibold mb-2">Order #{index + 1}</h3>
              {orders.length > 1 && (
                <Interactive.Button
                  className="w-1/5 flex justify-center"
                  type="button"
                  variant="danger"
                  onClick={() => handleRemoveOrder(index)}
                >
                  <X />
                </Interactive.Button>
              )}
            </div>
            <div className="w-full">
              <Field.Dropdown
                value={order.item}
                onChange={(e) => handleOrderChange(index, "item", e.target.value)}
                options={getAvailableItems(index).map((item) => ({
                  label: item,
                  value: item,
                }))}
                label="Jenis"
                className="border rounded p-2"
              />
            </div>
            <div className="w-full">
              <Field.Number
                value={order.qty}
                onChange={(val) => handleOrderChange(index, "qty", val)}
                label="Jumlah"
                placeholder="Jumlah"
                suffix="kg"
              />
            </div>
          </div>
        ))}

        <div className="flex space-x-2">
          {orders.length < items.length - 1 && (
            <Interactive.Button type="button" onClick={handleAddOrder} variant="secondary">
              Add Order
            </Interactive.Button>
          )}
          <Interactive.Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Orders"}
          </Interactive.Button>
        </div>
      </form>

      <ToastContainer position="bottom-right" className="gap-2 md:gap-0 p-2 md:p-0" autoClose={3000} />
    </div>
  );
};
