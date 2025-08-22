"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getKategoriData, submitFormOperationalAccounting, logout } from "@/libraries/api";
import { OperationalAccountingData } from "@/types";
import { Field } from "@/components/molecules/";
import { Interactive } from "@/components/atoms/";
import { useToastSuccess, useToastError } from "@/hooks/Toast";
import { ToastContainer } from "react-toastify";
import { Trash } from "lucide-react";

export default function Dashboard() {
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [newEntry, setNewEntry] = useState<OperationalAccountingData>({
    tanggal: "",
    nominal: "",
    keterangan: "",
    keteranganTambahan: "",
  });
  const [entries, setEntries] = useState<OperationalAccountingData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const showSuccessToast = useToastSuccess();
  const showErrorToast = useToastError();

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("authenticated")) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const kategoriRes = await getKategoriData();
        if (kategoriRes.success) {
          setSubCategories(["Select Kategori", ...Object.keys(kategoriRes.data || {})]);
        } else {
          showErrorToast("Failed to fetch kategori data");
        }
      } catch {
        showErrorToast("Failed to fetch data");
      }
    };
    fetchData();
  }, [router, showErrorToast]);

  // handle controlled form for new entry
  const handleNewEntryChange = (field: keyof OperationalAccountingData, value: string) => {
    setNewEntry({ ...newEntry, [field]: value });
  };

  const handleAddEntry = (e: FormEvent) => {
    e.preventDefault();

    if (!newEntry.tanggal || !newEntry.nominal || !newEntry.keterangan) {
      showErrorToast("Please fill all fields before adding entry");
      return;
    }

    if (!subCategories.includes(newEntry.keterangan) || newEntry.keterangan === "Select Kategori") {
      showErrorToast("Invalid kategori selected");
      return;
    }

    if (Number(newEntry.nominal) <= 0) {
      showErrorToast("Nominal must be greater than 0");
      return;
    }

    setEntries([...entries, newEntry]);
    setNewEntry({ tanggal: "", nominal: "", keterangan: "", keteranganTambahan: "" }); // reset
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmitAll = async () => {
    if (entries.length === 0) {
      showErrorToast("No entries to submit");
      return;
    }

    setLoading(true);
    const response = await submitFormOperationalAccounting(
      "", // batch tanggal if needed
      entries,
      "" // sheet target if needed
    );
    setLoading(false);

    if (response.success) {
      showSuccessToast(response.data || "All entries submitted successfully");
      setEntries([]);
    } else {
      showErrorToast(response.error || "Failed to submit entries");
    }
  };

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      localStorage.removeItem("authenticated");
      router.push("/login");
    } else {
      showErrorToast(response.error || "Failed to logout");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Interactive.Button onClick={handleLogout} variant="danger">
          Logout
        </Interactive.Button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Operational Accounting</h2>

      {/* Add Entry Form */}
      <form onSubmit={handleAddEntry} className="grid grid-cols-12 gap-2 mb-4 items-center">
        <div className="col-span-3">
          <Field.Date
            value={newEntry.tanggal}
            onChange={(e) => handleNewEntryChange("tanggal", e.target.value)}
            required
          />
        </div>
        <div className="col-span-4">
          <Field.Number
            value={newEntry.nominal}
            onChange={(val) => handleNewEntryChange("nominal", val)}
            placeholder="Nominal"
            required
          />
        </div>
        <div className="col-span-4">
          <Field.Dropdown
            value={newEntry.keterangan}
            onChange={(e) => handleNewEntryChange("keterangan", e.target.value)}
            options={subCategories.map((item) => ({
              label: item,
              value: item,
            }))}
            required
          />
        </div>
        <div className="col-span-1">
          <Interactive.Button type="submit" variant="secondary">
            Add
          </Interactive.Button>
        </div>
      </form>

      {/* Entries List */}
      {entries.length > 0 && (
        <div className="space-y-2 mb-4">
          {entries.map((entry, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded">
              <div className="col-span-3">{entry.tanggal}</div>
              <div className="col-span-4">{entry.nominal}</div>
              <div className="col-span-4">{entry.keterangan}</div>
              <div className="col-span-1 flex justify-center">
                <Interactive.Button type="button" variant="danger" onClick={() => handleRemoveEntry(idx)}>
                  <Trash size={16} />
                </Interactive.Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit All */}
      <Interactive.Button onClick={handleSubmitAll} variant="primary" disabled={loading || entries.length === 0}>
        {loading ? "Submitting..." : "Submit All Entries"}
      </Interactive.Button>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
