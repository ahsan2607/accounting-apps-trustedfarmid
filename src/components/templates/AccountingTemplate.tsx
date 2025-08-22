"use client";
import { useEffect, useState, FormEvent } from "react";
// import { useRouter } from "next/navigation";
import { getKategoriData, submitFormOperationalAccounting } from "@/libraries/api";
import { OperationalAccountingData } from "@/types";
import { Field } from "@/components/molecules/";
import { Interactive } from "@/components/atoms/";
import { useToastSuccess, useToastError } from "@/hooks/Toast";
import { ToastContainer } from "react-toastify";
import { X } from "lucide-react";

type OperationalAccountingTemplateProps = {
  targetSheet?: string;
  formTitle: string;
};

export const AccountingTemplate: React.FC<OperationalAccountingTemplateProps> = ({ targetSheet, formTitle }) => {
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [tanggal, setTanggal] = useState<string>("");
  const [entries, setEntries] = useState<Omit<OperationalAccountingData, "tanggal">[]>([
    { nominal: "", keterangan: "", keteranganTambahan: "" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const showSuccessToast = useToastSuccess();
  const showErrorToast = useToastError();

//   const router = useRouter();

 useEffect(() => {
    const fetchData = async () => {
      try {
        const kategoriRes = await getKategoriData();
        if (kategoriRes.success) {
          setSubCategories(["Select Kategori", ...Object.keys(kategoriRes.data || {}).sort()]);
        } else {
          showErrorToast(kategoriRes.error || "Failed to fetch kategori data");
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showErrorToast("Failed to fetch data");
      }
    };
    fetchData();
  }, [showErrorToast]);

  const validateForm = () => {
    const errs: string[] = [];

    if (!tanggal) {
      errs.push("Tanggal harus diisi.");
    }

    entries.forEach((entry, idx) => {
      if (!entry.nominal || Number(entry.nominal) <= 0) {
        errs.push(`Entri #${idx + 1}: Nominal harus lebih besar dari 0.`);
      }
      if (!entry.keterangan || !subCategories.includes(entry.keterangan) || entry.keterangan === "Select Kategori") {
        errs.push(`Entri #${idx + 1}: Deskripsi harus dipilih.`);
      }
      if (!entry.keteranganTambahan && entry.keterangan === "Lainnya") {
        errs.push(`Keterangan harus diisi`);
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{formTitle}</h1>
      </div>

      <form onSubmit={handleSubmitAll} className="space-y-4 mb-8">
        <Field.Date
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          label="Tanggal Entri"
          className="w-full"
        />

        <h2 className="text-xl font-semibold mb-2">Detail Entri</h2>
        {entries.map((entry, id) => (
          <div key={id} className="flex flex-col gap-1 w-full border border-gray-100 shadow-md rounded p-3">
            <div className="w-full flex">
              <h3 className="w-4/5 text-lg font-semibold mb-2">Entri #{id + 1}</h3>
              {entries.length > 1 && (
                <Interactive.Button
                  className="w-1/5 flex justify-center"
                  type="button"
                  variant="danger"
                  onClick={() => handleRemoveEntry(id)}
                >
                  <X />
                </Interactive.Button>
              )}
            </div>
            <div className="w-full">
              <Field.Dropdown
                value={entry.keterangan}
                onChange={(e) => handleEntryChange(id, "keterangan", e.target.value)}
                options={subCategories.map((item) => ({ label: item, value: item }))}
                label="Jenis"
              />
            </div>
            <div className="w-full">
              <Field.Number
                value={entry.nominal}
                onChange={(val) => handleEntryChange(id, "nominal", val)}
                label="Nominal"
                placeholder="Nominal"
                prefix="Rp"
                suffix=",-"
              />
            </div>
            <div className="w-full">
              <Field.Text
                value={entry.keteranganTambahan}
                onChange={(e) => handleEntryChange(id, "keteranganTambahan", e.target.value)}
                label="Keterangan"
                placeholder="Keterangan Tambahan"
              />
            </div>
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

      <ToastContainer position="bottom-right" className="gap-2 md:gap-0 p-2 md:p-0" autoClose={3000} />
    </div>
  );
};
