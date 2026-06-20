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
  getAllDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "../../../Utils/Apis/DosenApi";
*/

import {
  useDosen,
  useStoreDosen,
  useUpdateDosen,
  useDeleteDosen,
} from "../../../Utils/Hooks/useDosen";

const initialForm = {
  id: null,
  nidn: "",
  nama: "",
  email: "",
  programStudi: "",
  status: true,
};

const Dosen = () => {
  const { user } = useAuthStateContext();

  /*
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
  } = useDosen(queryParams);

  const {
    data: allResult = { data: [], total: 0 },
  } = useDosen();

  const dosen = result.data;
  const allDosen = allResult.data;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const { mutate: storeDosenMutation } = useStoreDosen();
  const { mutate: updateDosenMutation } = useUpdateDosen();
  const { mutate: deleteDosenMutation } = useDeleteDosen();

  const [form, setForm] = useState(initialForm);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const isEdit = selectedDosen !== null;

  const canRead = user?.permission?.includes("dosen.read");
  const canCreate = user?.permission?.includes("dosen.create");
  const canUpdate = user?.permission?.includes("dosen.update");
  const canDelete = user?.permission?.includes("dosen.delete");

  /*
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
      fetchDosen();
    }
  }, [canRead]);
  */

  const openAddModal = () => {
    setSelectedDosen(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedDosen(item);
    setForm({
      id: item.id,
      nidn: item.nidn || "",
      nama: item.nama || "",
      email: item.email || "",
      programStudi: item.programStudi || "",
      status: item.status ?? true,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDosen(null);
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

    const dosenPayload = {
      nidn: form.nidn.trim(),
      nama: form.nama.trim(),
      email: form.email.trim(),
      programStudi: form.programStudi.trim(),
      status: form.status,
    };

    if (isEdit) {
      if (!canUpdate) {
        toastError("Anda tidak punya izin update dosen.");
        return;
      }

      const nidnExists = allDosen.some(
        (item) =>
          item.nidn === dosenPayload.nidn &&
          item.id !== form.id
      );

      if (nidnExists) {
        toastError("NIDN sudah terdaftar.");
        return;
      }

      const emailExists = allDosen.some(
        (item) =>
          item.email === dosenPayload.email &&
          item.id !== form.id
      );

      if (emailExists) {
        toastError("Email dosen sudah terdaftar.");
        return;
      }

      const resultConfirm = await confirmDialog({
        title: "Konfirmasi Update",
        text: `Yakin ingin menyimpan perubahan data dosen "${dosenPayload.nama}"?`,
        confirmText: "Ya, Update",
      });

      if (!resultConfirm.isConfirmed) return;

      /*
      try {
        await updateDosen(form.id, dosenPayload);
        await fetchDosen();
        closeModal();
      } catch (err) {
        console.error(err);
        toastError("Gagal menyimpan data dosen.");
      }
      */

      updateDosenMutation(
        {
          id: form.id,
          data: dosenPayload,
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
      toastError("Anda tidak punya izin tambah dosen.");
      return;
    }

    const nidnExists = allDosen.some(
      (item) => item.nidn === dosenPayload.nidn
    );

    if (nidnExists) {
      toastError("NIDN sudah terdaftar.");
      return;
    }

    const emailExists = allDosen.some(
      (item) => item.email === dosenPayload.email
    );

    if (emailExists) {
      toastError("Email dosen sudah terdaftar.");
      return;
    }

    const resultConfirm = await confirmDialog({
      title: "Konfirmasi Tambah",
      text: `Yakin ingin menambahkan dosen "${dosenPayload.nama}"?`,
      confirmText: "Ya, Simpan",
    });

    if (!resultConfirm.isConfirmed) return;

    /*
    try {
      await storeDosen(dosenPayload);
      await fetchDosen();
      closeModal();
    } catch (err) {
      console.error(err);
      toastError("Gagal menyimpan data dosen.");
    }
    */

    storeDosenMutation(dosenPayload, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      toastError("Anda tidak punya izin hapus dosen.");
      return;
    }

    const target = allDosen.find((item) => item.id === id);
    if (!target) return;

    const resultConfirm = await confirmDelete({
      title: "Hapus Dosen?",
      text: `Data "${target.nama}" akan dihapus permanen.`,
    });

    if (!resultConfirm.isConfirmed) {
      toastError("Penghapusan dibatalkan.");
      return;
    }

    /*
    try {
      await deleteDosen(id);
      await fetchDosen();
    } catch (err) {
      console.error(err);
      toastError("Gagal menghapus data dosen.");
    }
    */

    deleteDosenMutation(id);
  };

  if (!canRead) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Akses Ditolak
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Anda tidak memiliki izin untuk melihat data dosen.
        </p>
      </div>
    );
  }

  if (isLoading && dosen.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Memuat data dosen...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-red-500">
          Gagal memuat data dosen.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Daftar Dosen
          </h2>
        </div>

        {canCreate && (
          <button
            onClick={openAddModal}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            + Tambah Dosen
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
        placeholder="Cari nama, NIDN, email, atau program studi..."
        sortOptions={[
          { value: "nama", label: "Sort by Nama" },
          { value: "nidn", label: "Sort by NIDN" },
          { value: "email", label: "Sort by Email" },
          { value: "programStudi", label: "Sort by Program Studi" },
        ]}
      />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-5 py-4 text-left font-bold">NIDN</th>
              <th className="px-5 py-4 text-left font-bold">Nama</th>
              <th className="px-5 py-4 text-left font-bold">Email</th>
              <th className="px-5 py-4 text-left font-bold">Program Studi</th>
              <th className="px-5 py-4 text-center font-bold">Status</th>
              <th className="px-5 py-4 text-center font-bold">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {dosen.length > 0 ? (
              dosen.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white transition hover:bg-blue-50/60"
                >
                  <td className="px-5 py-4 font-semibold text-gray-700">
                    {item.nidn}
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="font-bold text-gray-800">
                        {item.nama}
                      </p>
                      <p className="text-xs text-gray-400">
                        Dosen
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.email}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.programStudi}
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
                      Belum ada data dosen.
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Tambahkan data dosen atau ubah kata kunci pencarian.
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
              {isEdit ? "Edit Dosen" : "Tambah Dosen"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="nidn"
                placeholder="NIDN"
                value={form.nidn}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />

              <input
                name="nama"
                placeholder="Nama Dosen"
                value={form.nama}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email Dosen"
                value={form.email}
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

export default Dosen;