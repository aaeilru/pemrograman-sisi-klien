import { useState } from "react";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { toastError } from "../../../Utils/Helpers/ToastHelpers";
import {
  confirmDelete,
  confirmDialog,
} from "../../../Utils/Helpers/SwalHelpers";

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

  const {
    data: mataKuliah = [],
    isLoading,
    isError,
  } = useMataKuliah(user);

  const {
    data: dosen = [],
  } = useDosen();

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

      const kodeExists = mataKuliah.some(
        (item) =>
          item.kode.toLowerCase() === payload.kode.toLowerCase() &&
          item.id !== form.id
      );

      if (kodeExists) {
        toastError("Kode mata kuliah sudah terdaftar.");
        return;
      }

      const result = await confirmDialog({
        title: "Konfirmasi Update",
        text: `Yakin ingin menyimpan perubahan mata kuliah "${payload.nama}"?`,
        confirmText: "Ya, Update",
      });

      if (!result.isConfirmed) return;

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

    const kodeExists = mataKuliah.some(
      (item) => item.kode.toLowerCase() === payload.kode.toLowerCase()
    );

    if (kodeExists) {
      toastError("Kode mata kuliah sudah terdaftar.");
      return;
    }

    const result = await confirmDialog({
      title: "Konfirmasi Tambah",
      text: `Yakin ingin menambahkan mata kuliah "${payload.nama}"?`,
      confirmText: "Ya, Simpan",
    });

    if (!result.isConfirmed) return;

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

    const target = mataKuliah.find((item) => item.id === id);
    if (!target) return;

    const result = await confirmDelete({
      title: "Hapus Mata Kuliah?",
      text: `Data "${target.nama}" akan dihapus permanen.`,
    });

    if (!result.isConfirmed) {
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
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800">Akses Ditolak</h2>
        <p className="text-gray-500 mt-2">
          Anda tidak memiliki izin untuk melihat data mata kuliah.
        </p>
      </div>
    );
  }

  if (isLoading && mataKuliah.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Memuat data mata kuliah...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-red-500">Gagal memuat data mata kuliah.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800">
          Daftar Mata Kuliah
        </h2>

        {canCreate && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Tambah Mata Kuliah
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700 border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Kode</th>
              <th className="py-3 px-4 text-left">Mata Kuliah</th>
              <th className="py-3 px-4 text-center">SKS</th>
              <th className="py-3 px-4 text-center">Semester</th>
              <th className="py-3 px-4 text-left">Dosen</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {mataKuliah.length > 0 ? (
              mataKuliah.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4">{item.kode}</td>
                  <td className="py-3 px-4 font-medium">{item.nama}</td>
                  <td className="py-3 px-4 text-center">{item.sks}</td>
                  <td className="py-3 px-4 text-center">{item.semester}</td>
                  <td className="py-3 px-4">{item.dosen || "-"}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-sm font-bold ${
                        item.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                    {canUpdate && (
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-6 text-center text-gray-400 italic"
                >
                  Belum ada data mata kuliah.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {isEdit ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="kode"
                placeholder="Kode Mata Kuliah"
                value={form.kode}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                name="nama"
                placeholder="Nama Mata Kuliah"
                value={form.nama}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                name="sks"
                type="number"
                placeholder="SKS"
                value={form.sks}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                name="semester"
                type="number"
                placeholder="Semester"
                value={form.semester}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              {user?.role === "admin" ? (
                <select
                  name="dosenId"
                  value={form.dosenId}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
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
                  className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
                />
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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