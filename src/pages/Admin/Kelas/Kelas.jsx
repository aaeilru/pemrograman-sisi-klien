import { useState } from "react";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { toastError } from "../../../Utils/Helpers/ToastHelpers";
import {
  confirmDelete,
  confirmDialog,
} from "../../../Utils/Helpers/SwalHelpers";
import TablePagination from "../Components/TablePagination";

/*
import { useEffect } from "react";
import {
  getAllKelas,
  storeKelas,
  updateKelas,
  deleteKelas,
} from "../../../Utils/Apis/KelasApi";
*/

import {
  useKelas,
  useStoreKelas,
  useUpdateKelas,
  useDeleteKelas,
} from "../../../Utils/Hooks/useKelas";

const initialForm = {
  id: null,
  nama: "",
  programStudi: "",
  semester: "",
  waliKelas: "",
  status: true,
};

const Kelas = () => {
  const { user } = useAuthStateContext();

  /*
  const [kelas, setKelas] = useState([]);
  */

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");

  const queryParams = {
    q: search,
    _page: page,
    _limit: limit,
    _sort: sortBy,
    _order: sortOrder,
  };

  const {
    data: result = { data: [], total: 0 },
    isLoading,
    isError,
  } = useKelas(queryParams);

  const {
    data: allResult = { data: [], total: 0 },
  } = useKelas();

  const kelas = result.data;
  const allKelas = allResult.data;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const { mutate: store } = useStoreKelas();
  const { mutate: update } = useUpdateKelas();
  const { mutate: remove } = useDeleteKelas();

  const [form, setForm] = useState(initialForm);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const isEdit = selectedKelas !== null;

  const canRead = user?.permission?.includes("kelas.read");
  const canCreate = user?.permission?.includes("kelas.create");
  const canUpdate = user?.permission?.includes("kelas.update");
  const canDelete = user?.permission?.includes("kelas.delete");

  /*
  const fetchKelas = async () => {
    try {
      const res = await getAllKelas();
      setKelas(res.data);
    } catch (err) {
      console.error(err);
      toastError("Gagal mengambil data kelas.");
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchKelas();
    }
  }, [canRead]);
  */

  const openAddModal = () => {
    setSelectedKelas(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedKelas(item);
    setForm({
      id: item.id,
      nama: item.nama || "",
      programStudi: item.programStudi || "",
      semester: item.semester || "",
      waliKelas: item.waliKelas || "",
      status: item.status ?? true,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedKelas(null);
    setForm(initialForm);
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "radio" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nama: form.nama.trim(),
      programStudi: form.programStudi.trim(),
      semester: Number(form.semester),
      waliKelas: form.waliKelas.trim(),
      status: form.status,
    };

    if (isEdit) {
      if (!canUpdate) {
        toastError("Anda tidak punya izin update kelas.");
        return;
      }

      const namaExists = allKelas.some(
        (item) =>
          item.nama.toLowerCase() === payload.nama.toLowerCase() &&
          item.id !== form.id
      );

      if (namaExists) {
        toastError("Nama kelas sudah terdaftar.");
        return;
      }

      const resultConfirm = await confirmDialog({
        title: "Konfirmasi Update",
        text: `Yakin ingin menyimpan perubahan data kelas "${payload.nama}"?`,
        confirmText: "Ya, Update",
      });

      if (!resultConfirm.isConfirmed) return;

      /*
      try {
        await updateKelas(form.id, payload);
        await fetchKelas();
        closeModal();
      } catch (err) {
        console.error(err);
        toastError("Gagal menyimpan data kelas.");
      }
      */

      update(
        {
          id: form.id,
          data: payload,
        },
        {
          onSuccess: () => {
            closeModal();
          },
        }
      );

      return;
    }

    if (!canCreate) {
      toastError("Anda tidak punya izin tambah kelas.");
      return;
    }

    const namaExists = allKelas.some(
      (item) => item.nama.toLowerCase() === payload.nama.toLowerCase()
    );

    if (namaExists) {
      toastError("Nama kelas sudah terdaftar.");
      return;
    }

    const resultConfirm = await confirmDialog({
      title: "Konfirmasi Tambah",
      text: `Yakin ingin menambahkan kelas "${payload.nama}"?`,
      confirmText: "Ya, Simpan",
    });

    if (!resultConfirm.isConfirmed) return;

    /*
    try {
      await storeKelas(payload);
      await fetchKelas();
      closeModal();
    } catch (err) {
      console.error(err);
      toastError("Gagal menyimpan data kelas.");
    }
    */

    store(payload, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      toastError("Anda tidak punya izin hapus kelas.");
      return;
    }

    const target = allKelas.find((item) => item.id === id);
    if (!target) return;

    const resultConfirm = await confirmDelete({
      title: "Hapus Kelas?",
      text: `Data "${target.nama}" akan dihapus permanen.`,
    });

    if (!resultConfirm.isConfirmed) {
      toastError("Penghapusan dibatalkan.");
      return;
    }

    /*
    try {
      await deleteKelas(id);
      await fetchKelas();
    } catch (err) {
      console.error(err);
      toastError("Gagal menghapus data kelas.");
    }
    */

    remove(id);
  };

  if (!canRead) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Akses Ditolak
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Anda tidak memiliki izin untuk melihat data kelas.
        </p>
      </div>
    );
  }

  if (isLoading && kelas.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Memuat data kelas...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-red-500">
          Gagal memuat data kelas.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Daftar Kelas
          </h2>
        </div>

        {canCreate && (
          <button
            onClick={openAddModal}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            + Tambah Kelas
          </button>
        )}
      </div>

      <TablePagination
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalCount={totalCount}
        placeholder="Cari nama kelas, program studi, atau wali kelas..."
        sortOptions={[
          { value: "nama", label: "Sort by Nama Kelas" },
          { value: "programStudi", label: "Sort by Program Studi" },
          { value: "semester", label: "Sort by Semester" },
          { value: "waliKelas", label: "Sort by Wali Kelas" },
        ]}
      />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-5 py-4 text-left font-bold">Nama Kelas</th>
              <th className="px-5 py-4 text-left font-bold">Program Studi</th>
              <th className="px-5 py-4 text-center font-bold">Semester</th>
              <th className="px-5 py-4 text-left font-bold">Wali Kelas</th>
              <th className="px-5 py-4 text-center font-bold">Status</th>
              <th className="px-5 py-4 text-center font-bold">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {kelas.length > 0 ? (
              kelas.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white transition hover:bg-blue-50/60"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-bold text-gray-800">
                        {item.nama}
                      </p>
                      <p className="text-xs text-gray-400">
                        Kelas Akademik
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.programStudi}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                      {item.semester}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.waliKelas}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-bold ${
                        item.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      {canUpdate && (
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700 transition hover:bg-yellow-200"
                        >
                          Edit
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-200"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <span className="text-2xl text-gray-400">!</span>
                    </div>
                    <p className="font-semibold text-gray-500">
                      Belum ada data kelas.
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Tambahkan data kelas atau ubah kata kunci pencarian.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-xl">
            <h3 className="mb-5 text-xl font-bold text-gray-900">
              {isEdit ? "Edit Kelas" : "Tambah Kelas"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="nama"
                placeholder="Nama Kelas"
                value={form.nama}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />

              <input
                name="programStudi"
                placeholder="Program Studi"
                value={form.programStudi}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />

              <input
                name="semester"
                type="number"
                placeholder="Semester"
                value={form.semester}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />

              <input
                name="waliKelas"
                placeholder="Wali Kelas"
                value={form.waliKelas}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Status
                </label>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-green-600">
                    <input
                      type="radio"
                      name="status"
                      value="true"
                      checked={form.status === true}
                      onChange={handleChange}
                    />
                    Aktif
                  </label>

                  <label className="flex items-center gap-2 text-sm font-semibold text-red-600">
                    <input
                      type="radio"
                      name="status"
                      value="false"
                      checked={form.status === false}
                      onChange={handleChange}
                    />
                    Tidak Aktif
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  {isEdit ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kelas;