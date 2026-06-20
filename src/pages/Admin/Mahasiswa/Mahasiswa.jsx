import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";
import {
  confirmDelete,
  confirmDialog,
} from "../../../Utils/Helpers/SwalHelpers";
import { toastError } from "../../../Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";

/*
import { useEffect } from "react";
import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../../../Utils/Apis/MahasiswaApi";
*/

import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "../../../Utils/Hooks/useMahasiswa";

const initialForm = {
  id: null,
  nim: "",
  nama: "",
  programStudi: "",
  semester: "",
  email: "",
  alamat: "",
  status: true,
};

const Mahasiswa = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  /*
  const [mahasiswa, setMahasiswa] = useState([]);
  */

  const {
    data: mahasiswa = [],
    isLoading,
    isError,
  } = useMahasiswa();

  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  const [form, setForm] = useState(initialForm);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const isEdit = selectedMahasiswa !== null;

  const canRead = user?.permission?.includes("mahasiswa.read");
  const canCreate = user?.permission?.includes("mahasiswa.create");
  const canUpdate = user?.permission?.includes("mahasiswa.update");
  const canDelete = user?.permission?.includes("mahasiswa.delete");

  /*
  const fetchMahasiswa = async () => {
    try {
      const res = await getAllMahasiswa();
      setMahasiswa(res.data);
    } catch (err) {
      console.error(err);
      toastError("Gagal mengambil data mahasiswa.");
    }
  };

  useEffect(() => {
    fetchMahasiswa();
  }, []);
  */

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedMahasiswa(item);
    setForm({
      id: item.id,
      nim: item.nim || "",
      nama: item.nama || "",
      programStudi: item.programStudi || "",
      semester: item.semester || "",
      email: item.email || "",
      alamat: item.alamat || "",
      status: item.status ?? true,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMahasiswa(null);
    setForm(initialForm);
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

    const formData = {
      nim: form.nim.trim(),
      nama: form.nama.trim(),
      programStudi: form.programStudi.trim(),
      semester: Number(form.semester),
      email: form.email.trim(),
      alamat: form.alamat.trim(),
      status: form.status,
    };

    if (isEdit) {
      if (!canUpdate) {
        toastError("Anda tidak punya izin untuk update data.");
        return;
      }

      const nimExists = mahasiswa.some(
        (item) => item.nim === formData.nim && item.id !== form.id
      );

      if (nimExists) {
        toastError("NIM sudah terdaftar.");
        return;
      }

      const result = await confirmDialog({
        title: "Konfirmasi Update",
        text: `Yakin ingin menyimpan perubahan data "${formData.nama}"?`,
        confirmText: "Ya, Update",
      });

      if (!result.isConfirmed) return;

      /*
      try {
        await updateMahasiswa(form.id, formData);
        toastSuccess(`Data "${formData.nama}" berhasil diupdate.`);
        await fetchMahasiswa();
        closeModal();
      } catch (err) {
        console.error(err);
        toastError("Terjadi kesalahan saat menyimpan data.");
      }
      */

      update(
        {
          id: form.id,
          data: formData,
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
      toastError("Anda tidak punya izin untuk tambah data.");
      return;
    }

    const nimExists = mahasiswa.some(
      (item) => item.nim === formData.nim
    );

    if (nimExists) {
      toastError("NIM sudah terdaftar.");
      return;
    }

    /*
    try {
      await storeMahasiswa(formData);
      toastSuccess(`Data "${formData.nama}" berhasil ditambahkan.`);
      await fetchMahasiswa();
      closeModal();
    } catch (err) {
      console.error(err);
      toastError("Terjadi kesalahan saat menyimpan data.");
    }
    */

    store(formData, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      toastError("Anda tidak punya izin untuk hapus data.");
      return;
    }

    const target = mahasiswa.find((item) => item.id === id);
    if (!target) return;

    const result = await confirmDelete({
      title: "Hapus Mahasiswa?",
      text: `Data "${target.nama}" (${target.nim}) akan dihapus permanen.`,
    });

    if (!result.isConfirmed) {
      toastError("Penghapusan dibatalkan.");
      return;
    }

    /*
    try {
      await deleteMahasiswa(id);
      toastSuccess(`Data "${target.nama}" berhasil dihapus.`);
      await fetchMahasiswa();
    } catch (err) {
      console.error(err);
      toastError("Gagal menghapus data mahasiswa.");
    }
    */

    remove(id);
  };

  const handleDetail = (id) => {
    navigate(`/admin/mahasiswa/${id}`);
  };

  if (!canRead) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800">
          Akses Ditolak
        </h2>
        <p className="text-gray-500 mt-2">
          Anda tidak memiliki izin untuk melihat data mahasiswa.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">
          Memuat data mahasiswa...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-red-500">
          Gagal memuat data mahasiswa.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800">
          Daftar Mahasiswa
        </h2>

        {canCreate && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Tambah Mahasiswa
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <MahasiswaTable
          data={mahasiswa}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onDetail={handleDetail}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      </div>

      <MahasiswaModal
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        mahasiswa={mahasiswa}
        selectedMahasiswa={selectedMahasiswa}
        onChange={handleChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Mahasiswa;