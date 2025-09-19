// ./StockInTemplate.tsx
"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getCustomerList, getItemList, submitStockIn } from "@/libraries/api";
import { Field } from "@/components/molecules/";
import { Interactive } from "@/components/atoms/";
import { useToastSuccess, useToastError } from "@/hooks/Toast";
import { ToastContainer } from "react-toastify";
import { X } from "lucide-react";
import { StockIn } from "@/types";

type StockInTemplateProps = {
  fixedCustomer?: string;
  targetSheet: string;
  formTitle: string;
};

export const StockInTemplate: React.FC<StockInTemplateProps> = ({ fixedCustomer, targetSheet, formTitle }) => {
  const [customers, setCustomers] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [stocksIn, setStocksIn] = useState<StockIn[]>([
    { supplier: "", item: "", subkind: "", unit: "", qty: 0, price: 0 },
  ]);
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
          setCustomers(["Pilih Supplier", ...(customerRes.data || [])]);
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

    stocksIn.forEach((stock, idx) => {
      if (!stock.supplier || stock.supplier === "Pilih Supplier") {
        errs.push(`Stok #${idx + 1}: Supplier harus dipilih.`);
      }
      if (!stock.item || stock.item === "Pilih Sayur") {
        errs.push(`Stok #${idx + 1}: Item harus dipilih.`);
      }
      if (!stock.unit) {
        errs.push(`Stok #${idx + 1}: Unit harus diisi.`);
      }
      if (!stock.subkind) {
        errs.push(`Stok #${idx + 1}: Subjenis harus dipilih.`);
      }
      if (!Number.isInteger(stock.qty) || stock.qty <= 0) {
        errs.push(`Stok #${idx + 1}: Jumlah harus bilangan bulat positif.`);
      }
      if (stock.price <= 0) {
        errs.push(`Stok #${idx + 1}: Harga harus lebih besar dari 0.`);
      }
    });

    return errs;
  };

  const getAvailableItems = (currentIndex: number) => {
    const selectedItems = stocksIn.map((stock) => stock.item);
    return items.filter(
      (item) => item === "Pilih Sayur" || item === stocksIn[currentIndex].item || !selectedItems.includes(item)
    );
  };

  const handleAddStock = () => {
    setStocksIn([...stocksIn, { supplier: "", item: "", subkind: "", unit: "", qty: 0, price: 0 }]);
  };

  const handleRemoveStock = (index: number) => {
    setStocksIn(stocksIn.filter((_, i) => i !== index));
  };

    const handleStockChange = (index: number, field: keyof StockIn, value: string) => {
      const newStocksIn = [...stocksIn];
      newStocksIn[index] = { ...newStocksIn[index], [field]: value };
      setStocksIn(newStocksIn);
    };

  const handleSubmitStocksIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errs = validateForm();
    if (errs.length > 0) {
      errs.forEach((err) => showErrorToast(err));
      return;
    }

    setLoading(true);

    const response = await submitStockIn(
      deliveryDate,
      stocksIn.map((o) => ({
        ...o,
      })),
      targetSheet
    );

    setLoading(false);

    if (response.success) {
      showSuccessToast(response.data || "Stocks submitted successfully");
      setDeliveryDate("");
      setStocksIn([{ supplier: "", item: "", subkind: "", unit: "", qty: 0, price: 0 }]);
    } else {
      showErrorToast(response.error || "Failed to submit stocks");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{formTitle}</h1>
      </div>

      <form onSubmit={handleSubmitStocksIn} className="space-y-4 mb-8">
        <Field.Date
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          label="Tanggal Pengiriman"
          className="w-full"
        />

        <h2 className="text-xl font-semibold mb-2">Detail Stock</h2>
        {stocksIn.map((stock, index) => (
          <div key={index} className="flex flex-col gap-2 w-full border border-gray-100 shadow-md rounded p-3">
            <div className="w-full flex">
              <h3 className="w-4/5 text-lg font-semibold mb-2">Stock #{index + 1}</h3>
              {stocksIn.length > 1 && (
                <Interactive.Button
                  className="w-1/5 flex justify-center"
                  type="button"
                  variant="danger"
                  onClick={() => handleRemoveStock(index)}
                >
                  <X />
                </Interactive.Button>
              )}
            </div>

            <Field.Dropdown
              value={stock.supplier}
              onChange={(e) => handleStockChange(index, "supplier", e.target.value)}
              options={customers.map((c) => ({ label: c, value: c }))}
              label="Supplier"
            />

            <Field.Dropdown
              value={stock.item}
              onChange={(e) => handleStockChange(index, "item", e.target.value)}
              options={getAvailableItems(index).map((item) => ({
                label: item,
                value: item,
              }))}
              label="Jenis"
            />

            <Field.Dropdown
              value={stock.subkind}
              onChange={(e) => handleStockChange(index, "subkind", e.target.value)}
              options={[
                { label: "Pilih Subjenis", value: "" },
                { label: "A", value: "A" },
                { label: "B", value: "B" },
                { label: "C", value: "C" },
              ]}
              label="Subjenis"
            />

            <Field.Text
              value={stock.unit}
              onChange={(e) => handleStockChange(index, "unit", e.target.value)}
              label="Unit"
              placeholder="e.g. pack, box, sack"
            />

            <Field.Number
              value={stock.qty || ""}
              onChange={(e) => handleStockChange(index, "qty", e)}
              label="Jumlah"
              placeholder="Jumlah"
              suffix="kg"
            />

            <Field.Number
              value={stock.qtyPerUnit ?? ""}
              onChange={(e) => handleStockChange(index, "qtyPerUnit", e)}
              label="Jumlah per Unit (opsional)"
              placeholder="contoh: 12"
            />

            <Field.Number
              value={stock.price || ""}
              onChange={(e) => handleStockChange(index, "price", e)}
              label="Harga"
              placeholder="Harga"
              prefix="Rp"
            />
          </div>
        ))}

        <div className="flex space-x-2">
          {stocksIn.length < items.length - 1 && (
            <Interactive.Button type="button" onClick={handleAddStock} variant="secondary">
              Add Stock
            </Interactive.Button>
          )}
          <Interactive.Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Stocks"}
          </Interactive.Button>
        </div>
      </form>

      <ToastContainer position="bottom-right" className="gap-2 md:gap-0 p-2 md:p-0" autoClose={3000} />
    </div>
  );
};
