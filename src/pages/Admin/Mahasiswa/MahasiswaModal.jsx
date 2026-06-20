import { useState, useEffect } from "react";

const MahasiswaModal = ({
  isOpen,
  isEdit,
  form,
  mahasiswa,
  selectedMahasiswa,
  onChange,
  onClose,
  onSubmit,
}) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen, selectedMahasiswa]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.nim.trim()) {
      newErrors.nim = "NIM wajib diisi.";
    } else {
      const nimExists = mahasiswa.some((item) =>
        isEdit
          ? item.nim === form.nim.trim() &&
            item.nim !== selectedMahasiswa?.nim
          : item.nim === form.nim.trim()
      );

      if (nimExists) {
        newErrors.nim = "NIM sudah digunakan, harus unique.";
      }
    }

    if (!form.nama.trim()) {
      newErrors.nama = "Nama wajib diisi.";
    }

    if (!form.programStudi.trim()) {
      newErrors.programStudi = "Program Studi wajib diisi.";
    }

    if (!String(form.semester).trim()) {
      newErrors.semester = "Semester wajib diisi.";
    } else if (
      isNaN(form.semester) ||
      Number(form.semester) < 1 ||
      Number(form.semester) > 14
    ) {
      newErrors.semester = "Semester harus angka antara 1–14.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid.";
    }

    if (!form.alamat.trim()) {
      newErrors.alamat = "Alamat wajib diisi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitModal = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(e);
  };

  if (!isOpen) return null;

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-5 py-4 border-b shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl leading-none transition"
          >
            &times;
          </button>
        </div>

        <form
          onSubmit={handleSubmitModal}
          className="px-5 py-4 space-y-3 overflow-y-auto"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIM <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="nim"
              value={form.nim}
              onChange={onChange}
              readOnly={isEdit}
              placeholder="Contoh: A11.2023.15263"
              className={inputClass("nim")}
            />

            {errors.nim && (
              <p className="text-red-500 text-xs mt-1">{errors.nim}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={onChange}
              placeholder="Masukkan nama lengkap"
              className={inputClass("nama")}
            />

            {errors.nama && (
              <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Program Studi <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="programStudi"
              value={form.programStudi}
              onChange={onChange}
              placeholder="Contoh: Teknik Informatika"
              className={inputClass("programStudi")}
            />

            {errors.programStudi && (
              <p className="text-red-500 text-xs mt-1">
                {errors.programStudi}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="semester"
              value={form.semester}
              onChange={onChange}
              placeholder="Contoh: 4"
              min={1}
              max={14}
              className={inputClass("semester")}
            />

            {errors.semester && (
              <p className="text-red-500 text-xs mt-1">
                {errors.semester}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Contoh: nama@student.ac.id"
              className={inputClass("email")}
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="alamat"
              value={form.alamat}
              onChange={onChange}
              placeholder="Contoh: Semarang"
              className={inputClass("alamat")}
            />

            {errors.alamat && (
              <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="true"
                  checked={form.status === true}
                  onChange={onChange}
                  className="accent-blue-600"
                />
                <span className="text-sm text-green-700 font-medium">
                  Aktif
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="false"
                  checked={form.status === false}
                  onChange={onChange}
                  className="accent-red-500"
                />
                <span className="text-sm text-red-600 font-medium">
                  Tidak Aktif
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition text-sm"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
            >
              {isEdit ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MahasiswaModal;