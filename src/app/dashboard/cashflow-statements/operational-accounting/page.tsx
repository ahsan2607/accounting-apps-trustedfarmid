// ./src/app/dashboard/page.ts
"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getKategoriData, submitFormOperationalAccounting, logout } from "@/libraries/api";
import { OperationalAccountingData } from "@/types";
import { Field } from "@/components/molecules/";
import { Button } from "@/components/atoms/interactive/Button";

export default function Dashboard() {
  const [subCategories, setSubCategories] = useState<string[]>([]);
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
        const [kategoriRes] = await Promise.all([getKategoriData()]);
        if (kategoriRes.success) {
          setSubCategories(["-- Select Kategori --", ...Object.keys(kategoriRes.data || {})]);
        }
      } catch {
        setMessage("Failed to fetch data");
      }
    };
    fetchData();
  }, [router]);

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
    if (response.success) {
      setMessage(response.data || "Accounting data submitted successfully");
      setAccountingData({ tanggal: "", nominal: "", keterangan: "" });
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage(response.error || "Failed to submit accounting data");
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
          placeholder="Nominal Pengeluaran"
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
