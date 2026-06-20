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
  getAllMataKuliah,
  storeMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "../../../Utils/Apis/MataKuliahApi";
import { getAllDosen } from "../../../Utils/Apis/DosenApi";
*/

import {
  useMataKuliah,
  useStoreMataKuliah,
  useUpdateMataKuliah,
  useDeleteMataKuliah,
} from "../../../Utils/Hooks/useMataKuliah";
import { useDosen } from "../../../Utils/Hooks/useDosen";

const initialForm = {
  id: null,
  kode: "",
  nama: "",
  sks: "",
  semester: "",
  dosenId: "",
  dosen: "",
  status: true,
};

const MataKuliah = () => {
  const { user } = useAuthStateContext();

  /*
  const [mataKuliah, setMataKuliah] = useState([]);
  const [dosen, setDosen] = useState([]);
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
  } = useMataKuliah(user, queryParams);

  const {
    data: allResult = { data: [], total: 0 },
  } = useMataKuliah(user);

  const {
    data: dosenResult = { data: [], total: 0 },
  } = useDosen();

  const mataKuliah = result.data;
  const allMataKuliah = allResult.data;
  const dosen = dosenResult.data;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const { mutate: storeMataKuliahMutation } = useStoreMataKuliah();
  const { mutate: updateMataKuliahMutation } = useUpdateMataKuliah();
  const { mutate: deleteMataKuliahMutation } = useDeleteMataKuliah();

  const [form, setForm] = useState(initialForm);
  const [selectedMataKuliah, setSelectedMataKuliah] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const isEdit = selectedMataKuliah !== null;

  const canRead = user?.permission?.includes("matakuliah.read");
  const canCreate = user?.permission?.includes("matakuliah.create");
  const canUpdate = user?.permission?.includes("matakuliah.update");
  const canDelete = user?.permission?.includes("matakuliah.delete");

  /*
  const fetchMataKuliah = async () => {
    try {
      const res = await getAllMataKuliah();

      const filteredData =
        user?.role === "dosen"
          ? res.data.filter((item) => item.dosenId === user.dosenId)
          : res.data;

      setMataKuliah(filteredData);
    } catch (err) {
      console.error(err);
      toastError("Gagal mengambil data mata kuliah.");
    }
  };

  const fetchDosen = async () => {
    try {
      const res = await getAllDosen();
      setDosen(res.data);
    } catch (err) {
      console.error(err);
      toastError("Gagal mengambil data dosen.");
    }
  };

  useEffect(() => {
    if (canRead) {
      fetchMataKuliah();
      fetchDosen();
    }
  }, [canRead]);
  */

  const openAddModal = () => {
    setSelectedMataKuliah(null);

    if (user?.role === "dosen") {
      setForm({
        ...initialForm,
        dosenId: user.dosenId,
        dosen: user.name,
      });
    } else {
      setForm(initialForm);
    }

    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedMataKuliah(item);

    setForm({
      id: item.id,
      kode: item.kode || "",
      nama: item.nama || "",
      sks: item.sks || "",
      semester: item.semester || "",
      dosenId: item.dosenId || "",
      dosen: item.dosen || "",
      status: item.status ?? true,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMataKuliah(null);
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

    const selectedDosen =
      user?.role === "dosen"
        ? {
            id: user.dosenId,
            nama: user.name,
          }
        : dosen.find((item) => String(item.id) === String(form.dosenId));

    if (!selectedDosen) {
      toastError("Silakan pilih dosen pengampu terlebih dahulu.");
      return;
    }

    const payload = {
      kode: form.kode.trim(),
      nama: form.nama.trim(),
      sks: Number(form.sks),
      semester: Number(form.semester),
      dosenId: selectedDosen.id,
      dosen: selectedDosen.nama,
      status: form.status,
    };

    if (isEdit) {
      if (!canUpdate) {
        toastError("Anda tidak punya izin update mata kuliah.");
        return;
      }

      const kodeExists = allMataKuliah.some(
        (item) =>
          item.kode.toLowerCase() === payload.kode.toLowerCase() &&
          item.id !== form.id
      );

      if (kodeExists) {
        toastError("Kode mata kuliah sudah terdaftar.");
        return;
      }

      const resultConfirm = await confirmDialog({
        title: "Konfirmasi Update",
        text: `Yakin ingin menyimpan perubahan mata kuliah "${payload.nama}"?`,
        confirmText: "Ya, Update",
      });

      if (!resultConfirm.isConfirmed) return;

      /*
      try {
        await updateMataKuliah(form.id, payload);
        toastSuccess("Mata kuliah berhasil diupdate.");
        await fetchMataKuliah();
        closeModal();
      } catch (err) {
        console.error(err);
        toastError("Gagal menyimpan data mata kuliah.");
      }
      */

      updateMataKuliahMutation(
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
      toastError("Anda tidak punya izin tambah mata kuliah.");
      return;
    }

    const kodeExists = allMataKuliah.some(
      (item) => item.kode.toLowerCase() === payload.kode.toLowerCase()
    );

    if (kodeExists) {
      toastError("Kode mata kuliah sudah terdaftar.");
      return;
    }

    const resultConfirm = await confirmDialog({
      title: "Konfirmasi Tambah",
      text: `Yakin ingin menambahkan mata kuliah "${payload.nama}"?`,
      confirmText: "Ya, Simpan",
    });

    if (!resultConfirm.isConfirmed) return;

    /*
    try {
      await storeMataKuliah(payload);
      toastSuccess("Mata kuliah berhasil ditambahkan.");
      await fetchMataKuliah();
      closeModal();
    } catch (err) {
      console.error(err);
      toastError("Gagal menyimpan data mata kuliah.");
    }
    */

    storeMataKuliahMutation(payload, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      toastError("Anda tidak punya izin hapus mata kuliah.");
      return;
    }

    const target = allMataKuliah.find((item) => item.id === id);
    if (!target) return;

    const resultConfirm = await confirmDelete({
      title: "Hapus Mata Kuliah?",
      text: `Data "${target.nama}" akan dihapus permanen.`,
    });

    if (!resultConfirm.isConfirmed) {
      toastError("Penghapusan dibatalkan.");
      return;
    }

    /*
    try {
      await deleteMataKuliah(id);
      toastSuccess("Mata kuliah berhasil dihapus.");
      await fetchMataKuliah();
    } catch (err) {
      console.error(err);
      toastError("Gagal menghapus mata kuliah.");
    }
    */

    deleteMataKuliahMutation(id);
  };

  if (!canRead) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Akses Ditolak
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Anda tidak memiliki izin untuk melihat data mata kuliah.
        </p>
      </div>
    );
  }

  if (isLoading && mataKuliah.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Memuat data mata kuliah...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-red-500">
          Gagal memuat data mata kuliah.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Daftar Mata Kuliah
          </h2>
        </div>

        {canCreate && (
          <button
            onClick={openAddModal}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            + Tambah Mata Kuliah
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
        placeholder="Cari kode, mata kuliah, dosen, atau semester..."
        sortOptions={[
          { value: "nama", label: "Sort by Mata Kuliah" },
          { value: "kode", label: "Sort by Kode" },
          { value: "sks", label: "Sort by SKS" },
          { value: "semester", label: "Sort by Semester" },
          { value: "dosen", label: "Sort by Dosen" },
        ]}
      />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-5 py-4 text-left font-bold">Kode</th>
              <th className="px-5 py-4 text-left font-bold">Mata Kuliah</th>
              <th className="px-5 py-4 text-center font-bold">SKS</th>
              <th className="px-5 py-4 text-center font-bold">Semester</th>
              <th className="px-5 py-4 text-left font-bold">Dosen</th>
              <th className="px-5 py-4 text-center font-bold">Status</th>
              <th className="px-5 py-4 text-center font-bold">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {mataKuliah.length > 0 ? (
              mataKuliah.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white transition hover:bg-blue-50/60"
                >
                  <td className="px-5 py-4 font-semibold text-gray-700">
                    {item.kode}
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="font-bold text-gray-800">
                        {item.nama}
                      </p>
                      <p className="text-xs text-gray-400">
                        Mata Kuliah
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                      {item.sks}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                      {item.semester}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.dosen || "-"}
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
                <td colSpan="7" className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <span className="text-2xl text-gray-400">!</span>
                    </div>
                    <p className="font-semibold text-gray-500">
                      Belum ada data mata kuliah.
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Tambahkan data mata kuliah atau ubah kata kunci pencarian.
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
              {isEdit ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="kode"
                placeholder="Kode Mata Kuliah"
                value={form.kode}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />

              <input
                name="nama"
                placeholder="Nama Mata Kuliah"
                value={form.nama}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />

              <input
                name="sks"
                type="number"
                placeholder="SKS"
                value={form.sks}
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

              {user?.role === "admin" ? (
                <select
                  name="dosenId"
                  value={form.dosenId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                >
                  <option value="">Pilih Dosen Pengampu</option>

                  {dosen.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={user?.name || ""}
                  disabled
                  className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500"
                />
              )}

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

export default MataKuliah;