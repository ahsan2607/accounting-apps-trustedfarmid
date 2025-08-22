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

type OperationalAccountingTemplateProps = {
  targetSheet: string;
};

export default function OperationalAccountingTemplate({ targetSheet }: OperationalAccountingTemplateProps) {
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [tanggal, setTanggal] = useState<string>("");
  const [entries, setEntries] = useState<Omit<OperationalAccountingData, "tanggal">[]>([
    { nominal: "", keterangan: "", keteranganTambahan: "" },
  ]);
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

  const validateForm = () => {
    const errs: string[] = [];

    if (!tanggal) {
      errs.push("Tanggal is required.");
    }

    entries.forEach((entry, idx) => {
      if (!entry.nominal || Number(entry.nominal) <= 0) {
        errs.push(`Entry #${idx + 1}: Nominal must be greater than 0.`);
      }
      if (!entry.keterangan || !subCategories.includes(entry.keterangan) || entry.keterangan === "Select Kategori") {
        errs.push(`Entry #${idx + 1}: Invalid kategori selected.`);
      }
    });

    return errs;
  };

  const handleEntryChange = (index: number, field: keyof Omit<OperationalAccountingData, "tanggal">, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
  };

  const handleAddEntry = () => {
    setEntries([...entries, { nominal: "", keterangan: "", keteranganTambahan: "" }]);
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmitAll = async (e: FormEvent) => {
    e.preventDefault();

    const errs = validateForm();
    if (errs.length > 0) {
      errs.forEach((err) => showErrorToast(err));
      return;
    }

    setLoading(true);
    const entriesWithDate: OperationalAccountingData[] = entries.map((e) => ({
      ...e,
      tanggal,
    }));

    const response = await submitFormOperationalAccounting(tanggal, entriesWithDate, targetSheet);
    setLoading(false);

    if (response.success) {
      showSuccessToast(response.data || "All entries submitted successfully");
      setTanggal("");
      setEntries([{ nominal: "", keterangan: "", keteranganTambahan: "" }]);
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
      <form onSubmit={handleSubmitAll} className="space-y-4 mb-8">
        {/* Batch Tanggal */}
        <Field.Date value={tanggal} onChange={(e) => setTanggal(e.target.value)} />

        <h2 className="text-xl font-semibold mb-2">Detail Entries</h2>
        {entries.map((entry, id) => (
          <div key={id} className="grid grid-cols-12 gap-1 items-center w-full">
            <div className="col-span-12">
              <Field.Dropdown
                value={entry.keterangan}
                onChange={(e) => handleEntryChange(id, "keterangan", e.target.value)}
                options={subCategories.map((item) => ({ label: item, value: item }))}
              />
            </div>
            <div className="col-span-12">
              <Field.Text
                value={entry.keteranganTambahan}
                onChange={(e) => handleEntryChange(id, "keteranganTambahan", e.target.value)}
                placeholder="Keterangan tambahan"
              />
            </div>

            <div className={entries.length > 1 ? "col-span-10" : "col-span-12"}>
              <Field.Number
                value={entry.nominal}
                onChange={(val) => handleEntryChange(id, "nominal", val)}
                placeholder="Nominal"
                prefix="Rp"
                suffix=",-"
              />
            </div>
            {entries.length > 1 && (
              <Interactive.Button
                className="col-span-2 flex justify-center"
                type="button"
                variant="danger"
                onClick={() => handleRemoveEntry(id)}
              >
                <Trash />
              </Interactive.Button>
            )}
          </div>
        ))}

        <div className="flex space-x-2">
          <Interactive.Button type="button" onClick={handleAddEntry} variant="secondary">
            Add Entry
          </Interactive.Button>
          <Interactive.Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit All Entries"}
          </Interactive.Button>
        </div>
      </form>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
