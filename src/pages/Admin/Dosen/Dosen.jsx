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

  const {
    data: dosen = [],
    isLoading,
    isError,
  } = useDosen();

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

      const nidnExists = dosen.some(
        (item) =>
          item.nidn === dosenPayload.nidn &&
          item.id !== form.id
      );

      if (nidnExists) {
        toastError("NIDN sudah terdaftar.");
        return;
      }

      const emailExists = dosen.some(
        (item) =>
          item.email === dosenPayload.email &&
          item.id !== form.id
      );

      if (emailExists) {
        toastError("Email dosen sudah terdaftar.");
        return;
      }

      const result = await confirmDialog({
        title: "Konfirmasi Update",
        text: `Yakin ingin menyimpan perubahan data dosen "${dosenPayload.nama}"?`,
        confirmText: "Ya, Update",
      });

      if (!result.isConfirmed) return;

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

    const nidnExists = dosen.some(
      (item) => item.nidn === dosenPayload.nidn
    );

    if (nidnExists) {
      toastError("NIDN sudah terdaftar.");
      return;
    }

    const emailExists = dosen.some(
      (item) => item.email === dosenPayload.email
    );

    if (emailExists) {
      toastError("Email dosen sudah terdaftar.");
      return;
    }

    const result = await confirmDialog({
      title: "Konfirmasi Tambah",
      text: `Yakin ingin menambahkan dosen "${dosenPayload.nama}"?`,
      confirmText: "Ya, Simpan",
    });

    if (!result.isConfirmed) return;

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

    const target = dosen.find((item) => item.id === id);
    if (!target) return;

    const result = await confirmDelete({
      title: "Hapus Dosen?",
      text: `Data "${target.nama}" akan dihapus permanen.`,
    });

    if (!result.isConfirmed) {
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
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800">Akses Ditolak</h2>
        <p className="text-gray-500 mt-2">
          Anda tidak memiliki izin untuk melihat data dosen.
        </p>
      </div>
    );
  }

  if (isLoading && dosen.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Memuat data dosen...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-red-500">Gagal memuat data dosen.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800">
          Daftar Dosen
        </h2>

        {canCreate && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Tambah Dosen
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700 border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">NIDN</th>
              <th className="py-3 px-4 text-left">Nama</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Program Studi</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {dosen.length > 0 ? (
              dosen.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4">{item.nidn}</td>
                  <td className="py-3 px-4 font-medium">{item.nama}</td>
                  <td className="py-3 px-4">{item.email}</td>
                  <td className="py-3 px-4">{item.programStudi}</td>
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
                  colSpan="6"
                  className="py-6 text-center text-gray-400 italic"
                >
                  Belum ada data dosen.
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
              {isEdit ? "Edit Dosen" : "Tambah Dosen"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="nidn"
                placeholder="NIDN"
                value={form.nidn}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                name="nama"
                placeholder="Nama Dosen"
                value={form.nama}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email Dosen"
                value={form.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

              <input
                name="programStudi"
                placeholder="Program Studi"
                value={form.programStudi}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />

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

export default Dosen;