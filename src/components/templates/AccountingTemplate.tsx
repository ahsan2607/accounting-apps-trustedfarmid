"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getAccountingCategoryData,
  getAccountingTransferableAccounts,
  submitFormOperationalAccounting,
} from "@/libraries/api";
import { KategoriData, OperationalAccountingData, TransferableAccount } from "@/types";
import { Field } from "@/components/molecules/";
import { Interactive, Visual } from "@/components/atoms/";
import { useToastSuccess, useToastError } from "@/hooks/Toast";
import { ToastContainer } from "react-toastify";
import { X } from "lucide-react";

export const AccountingTemplate: React.FC = () => {
  const [subCategories, setSubCategories] = useState<KategoriData[]>([]);
  const [transferableAccounts, setTransferableAccounts] = useState<TransferableAccount[]>([]);
  const [tanggal, setTanggal] = useState<string>("");
  const [entries, setEntries] = useState<Omit<OperationalAccountingData, "tanggal">[]>([
    {
      nominal: "",
      keterangan: { transactionId: "", accountName: "", accountType: "", statementType: "", subCategory: "" },
      keteranganTambahan: "",
    },
  ]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  // const tanggal = new Date().toISOString().split("T")[0];

  const showSuccessToast = useToastSuccess();
  const showErrorToast = useToastError();

  const router = useRouter();
  const searchParams = useSearchParams();

  const formAccount = searchParams.get("account") || "";
  const formName = searchParams.get("name") || "";

  useEffect(() => {
    if (!localStorage.getItem("trusted-farm-id-accounting-app-authenticated")) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const kategoriRes = await getAccountingCategoryData(formAccount);
        if (kategoriRes.success && kategoriRes.data) {
          setSubCategories([
            { transactionId: "", accountName: "", accountType: "", statementType: "", subCategory: "Select Kategori" },
            ...Object.values(kategoriRes.data).sort((a, b) => a.subCategory.localeCompare(b.subCategory)),
          ]);
        } else {
          showErrorToast("Failed to fetch kategori data");
        }
        const transferable = await getAccountingTransferableAccounts(formAccount);
        if (transferable.success && transferable.data) {
          setTransferableAccounts([
            { id: "", name: "Select Account Target" },
            ...Object.values(transferable.data).sort((a, b) => a.name.localeCompare(b.name)),
          ]);
        } else {
          showErrorToast("Failed to fetch transferable data");
        }
      } catch {
        showErrorToast("Failed to fetch data");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [formAccount, router, showErrorToast]);

  const validateForm = () => {
    const errs: string[] = [];

    if (!tanggal) {
      errs.push("Tanggal harus diisi.");
    }

    entries.forEach((entry, idx) => {
      if (!entry.nominal || Number(entry.nominal) <= 0) {
        errs.push(`Entri #${idx + 1}: Nominal harus lebih besar dari 0.`);
      }
      if (!entry.keterangan.subCategory || entry.keterangan.subCategory === "Select Kategori") {
        errs.push(`Entri #${idx + 1}: Deskripsi harus dipilih.`);
      }
      if (!entry.keteranganTambahan && entry.keterangan.subCategory === "Lainnya") {
        errs.push(`Entri #${idx + 1}: Keterangan harus diisi`);
      }
      if (entry.keterangan.subCategory === "Transfer") {
        const validIds = transferableAccounts.map((acc) => acc.id);

        if (!entry.keterangan.transactionId || !validIds.includes(entry.keterangan.transactionId)) {
          errs.push(`Entri #${idx + 1}: Target transaksi harus dipilih.`);
        }
      }
    });

    return errs;
  };

  const handleEntryChange = (
    index: number,
    field: keyof Omit<OperationalAccountingData, "tanggal"> | "transactionId",
    value: string | KategoriData
  ) => {
    const newEntries = [...entries];
    if (field === "keterangan") {
      newEntries[index] = { ...newEntries[index], keterangan: value as KategoriData };
    } else if (field === "transactionId") {
      newEntries[index] = {
        ...newEntries[index],
        keterangan: { ...newEntries[index].keterangan, transactionId: value as string },
      };
    } else {
      newEntries[index] = { ...newEntries[index], [field]: value };
    }
    setEntries(newEntries);
  };

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      {
        nominal: "",
        keterangan: { transactionId: "", accountName: "", accountType: "", statementType: "", subCategory: "" },
        keteranganTambahan: "",
      },
    ]);
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

    setLoadingSubmit(true);
    const entriesWithDate: OperationalAccountingData[] = entries.map((e) => ({
      ...e,
      tanggal,
    }));

    console.log({
      formAccount,
      tanggal,
      entriesWithDate,
    });

    const response = await submitFormOperationalAccounting(formAccount, tanggal, entriesWithDate);
    setLoadingSubmit(false);

    if (response.success) {
      showSuccessToast(response.data || "All entries submitted successfully");
      // setTanggal("");
      setEntries([
        {
          nominal: "",
          keterangan: { transactionId: "", accountName: "", accountType: "", statementType: "", subCategory: "" },
          keteranganTambahan: "",
        },
      ]);
    } else {
      showErrorToast(response.error || "Failed to submit entries");
    }
  };

  // Count transferable slots (exclude default "")
  // const transferableSlots = transferableAccounts.filter((acc) => acc.id !== "").length;

  // Compute max entries
  // const maxEntries =
  //   subCategories.filter((c) => c.subCategory !== "Select Kategori" && c.subCategory !== "Transfer").length +
  //   transferableSlots;

  // Get available transfer targets for an entry
  const getAvailableTransferTargets = (currentIndex: number) => {
    const selectedTargets = entries.map((e) => e.keterangan.transactionId);
    return transferableAccounts.filter(
      (acc) =>
        acc.id === "" || // dummy is always there
        acc.id === entries[currentIndex].keterangan.transactionId || // keep current
        !selectedTargets.includes(acc.id) // prevent duplicates
    );
  };

  // Get available categories for an entry
  const getAvailableCategories = (currentIndex: number) => {
    const selectedCategories = entries.map((e) => e.keterangan.subCategory);

    // count how many entries are using "Transfer"
    const usedTransferCount = selectedCategories.filter((c) => c === "Transfer").length;

    // how many transfer slots available
    const transferableSlots = transferableAccounts.filter((acc) => acc.id !== "").length;
    const hasTransferSlots = usedTransferCount < transferableSlots;

    return subCategories.filter((cat) => {
      if (cat.subCategory === "Select Kategori") return true;
      if (cat.subCategory === "Beli Aset") return true;
      if (cat.subCategory === "Belanja dari Petani") return true;
      if (cat.subCategory === "Belanja dari Pasar") return true;
      if (cat.subCategory === "Retail Income") return true;
      // always allow the one currently selected (so it won’t vanish from dropdown)
      if (cat.subCategory === entries[currentIndex].keterangan.subCategory) return true;
      if (cat.subCategory === "Transfer") return hasTransferSlots;
      return !selectedCategories.includes(cat.subCategory);
    });
  };

  if (loadingData) return <Visual.Spinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Accounting - {formName}</h1>
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
                value={entry.keterangan.subCategory}
                onChange={(e) => {
                  const selectedCategory = subCategories.find((cat) => cat.subCategory === e.target.value);
                  if (selectedCategory) {
                    handleEntryChange(id, "keterangan", selectedCategory);
                  }
                }}
                options={getAvailableCategories(id).map((item) => ({
                  label: item.subCategory,
                  value: item.subCategory,
                }))}
                label="Jenis"
              />
            </div>
            {entry.keterangan.subCategory === "Transfer" && (
              <Field.Dropdown
                value={entry.keterangan.transactionId}
                onChange={(e) => handleEntryChange(id, "transactionId", e.target.value)}
                options={getAvailableTransferTargets(id).map((acc) => ({
                  label: acc.name,
                  value: acc.id,
                }))}
                label="Target Transaksi"
              />
            )}
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
          {/* {entries.length < maxEntries && (
            <Interactive.Button type="button" onClick={handleAddEntry} variant="secondary">
              Add Entry
            </Interactive.Button>
          )} */}
          <Interactive.Button type="button" onClick={handleAddEntry} variant="secondary">
            Add Entry
          </Interactive.Button>
          <Interactive.Button type="submit" variant="primary" disabled={loadingSubmit}>
            {loadingSubmit ? "Submitting..." : "Submit All Entries"}
          </Interactive.Button>
        </div>
      </form>

      <ToastContainer position="bottom-right" className="gap-2 md:gap-0 p-2 md:p-0" autoClose={3000} />
    </div>
  );
};
