const ModalRencanaStudi = ({
  isOpen,
  form,
  dosen,
  mataKuliah,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const hariOptions = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Tambah Kelas Rencana Studi
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Pilih mata kuliah, dosen pengampu, dan jadwal kuliah.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">
              Mata Kuliah
            </label>
            <select
              name="mataKuliahId"
              value={form.mataKuliahId}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Pilih Mata Kuliah</option>
              {mataKuliah.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.kode} - {item.nama} ({item.sks} SKS)
                </option>
              ))}
            </select>

            {mataKuliah.length === 0 && (
              <p className="mt-1 text-xs text-gray-400">
                Semua mata kuliah sudah memiliki kelas rencana studi.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">
              Dosen Pengampu
            </label>
            <select
              name="dosenId"
              value={form.dosenId}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Pilih Dosen</option>
              {dosen.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama} - Max {item.maxSks ?? 12} SKS
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">
              Hari
            </label>
            <select
              name="hari"
              value={form.hari}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Pilih Hari</option>
              {hariOptions.map((hari) => (
                <option key={hari} value={hari}>
                  {hari}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-gray-700">
                Jam Mulai
              </label>
              <input
                type="time"
                name="jamMulai"
                value={form.jamMulai}
                onChange={onChange}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-gray-700">
                Jam Selesai
              </label>
              <input
                type="time"
                name="jamSelesai"
                value={form.jamSelesai}
                onChange={onChange}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-gray-700">
              Ruang
            </label>
            <input
              type="text"
              name="ruang"
              value={form.ruang}
              onChange={onChange}
              placeholder="Contoh: H.3.1"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={mataKuliah.length === 0}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                mataKuliah.length === 0
                  ? "cursor-not-allowed bg-blue-200 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRencanaStudi;