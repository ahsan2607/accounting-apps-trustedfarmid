"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getCustomerList, getItemList, submitOrders } from "@/libraries/api";
import { Order } from "@/types";
import { Field } from "@/components/molecules/";
import { Interactive } from "@/components/atoms/";
import { useToastSuccess, useToastError } from "@/hooks/Toast";
import { ToastContainer } from "react-toastify";
import { Trash } from "lucide-react";

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
    if (!localStorage.getItem("authenticated")) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [customerRes, itemRes] = await Promise.all([getCustomerList(), getItemList()]);
        if (customerRes.success && !fixedCustomer) {
          setCustomers(["Select Customer", ...(customerRes.data || [])]);
        } else if (fixedCustomer) {
          setCustomer(fixedCustomer);
        }
        if (itemRes.success) {
          setItems(["Select Item", ...(itemRes.data || [])]);
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
      errs.push("Delivery date is required.");
    } else {
      const today = new Date();
      const selectedDate = new Date(deliveryDate);
      if (selectedDate < new Date(today.toDateString())) {
        errs.push("Delivery date cannot be in the past.");
      }
    }

    if (!fixedCustomer && (!customer || customer === "Select Customer")) {
      errs.push("Please select a customer.");
    }

    orders.forEach((order, idx) => {
      if (!order.item || order.item === "Select Item") {
        errs.push(`Order #${idx + 1}: Please select an item.`);
      }
      const qtyNum = Number(order.qty);
      if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
        errs.push(`Order #${idx + 1}: Quantity must be a positive integer.`);
      }
    });

    return errs;
  };

  const getAvailableItems = (currentIndex: number) => {
    const selectedItems = orders.map((o) => o.item);
    return items.filter(
      (item) => item === "Select Item" || item === orders[currentIndex].item || !selectedItems.includes(item)
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

      <h2 className="text-xl font-semibold mb-2">Order Veggies</h2>
      <form onSubmit={handleSubmitOrders} className="space-y-4 mb-8">
        <Field.Date
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="w-full border rounded p-2"
        />

        {!fixedCustomer ? (
          <Field.Dropdown
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full border rounded p-2"
            options={customers.map((c) => ({ label: c, value: c }))}
          />
        ) : null}

        <h2 className="text-xl font-semibold mb-2">Detail Order</h2>
        {orders.map((order, index) => (
          <div key={index} className="grid grid-cols-12 gap-1 items-center w-full">
            <div className="col-span-12">
              <Field.Dropdown
                value={order.item}
                onChange={(e) => handleOrderChange(index, "item", e.target.value)}
                className="border rounded p-2"
                options={getAvailableItems(index).map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </div>
            <div className={orders.length > 1 ? "col-span-10" : "col-span-12"}>
              <Field.Number
                value={order.qty}
                onChange={(val) => handleOrderChange(index, "qty", val)}
                placeholder="Jumlah"
                suffix="kg"
              />
            </div>

            {orders.length > 1 && (
              <Interactive.Button
                className="col-span-2 flex justify-center"
                type="button"
                variant="danger"
                onClick={() => handleRemoveOrder(index)}
              >
                <Trash />
              </Interactive.Button>
            )}
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
