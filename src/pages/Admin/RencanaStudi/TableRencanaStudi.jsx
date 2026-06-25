const TableRencanaStudi = ({
  kelas,
  mahasiswa,
  dosen,
  mataKuliah,
  selectedMhs,
  setSelectedMhs,
  selectedDsn,
  setSelectedDsn,
  handleAddMahasiswa,
  handleDeleteMahasiswa,
  handleChangeDosen,
  handleDeleteKelas,
  getTotalSksMahasiswa,
  canUpdate,
  canDelete,
}) => {
  const getMataKuliah = (id) =>
    mataKuliah.find((item) => Number(item.id) === Number(id));

  const getDosen = (id) =>
    dosen.find((item) => Number(item.id) === Number(id));

  const getMahasiswa = (id) =>
    mahasiswa.find((item) => Number(item.id) === Number(id));

  const getMaxSksMahasiswa = (item) => {
    return Number(item?.maxSks ?? 24);
  };

  const getStatusSks = (totalSks, maxSks) => {
    if (totalSks > maxSks) {
      return "bg-red-100 text-red-700";
    }

    if (totalSks >= maxSks * 0.8) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  if (kelas.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-12 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white">
          <span className="text-2xl text-gray-400">!</span>
        </div>
        <p className="font-semibold text-gray-600">
          Belum ada data rencana studi.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Tambahkan kelas berdasarkan mata kuliah yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {kelas.map((kelasItem) => {
        const matkul = getMataKuliah(kelasItem.mataKuliahId);
        const dosenPengampu = getDosen(kelasItem.dosenId);
        const mahasiswaIds = (kelasItem.mahasiswaIds || []).map(Number);

        const mahasiswaDalamKelas = mahasiswaIds
          .map((id) => getMahasiswa(id))
          .filter(Boolean);

        const mahasiswaBelumMasukKelas = mahasiswa.filter(
          (item) => !mahasiswaIds.includes(Number(item.id))
        );

        return (
          <div
            key={kelasItem.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {matkul?.nama || "Mata Kuliah Tidak Ditemukan"}
                </h3>

                <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                  <span>Kode: {matkul?.kode || "-"}</span>
                  <span>•</span>
                  <span>{matkul?.sks || 0} SKS</span>
                  <span>•</span>
                  <span>
                    Dosen:{" "}
                    <strong className="text-gray-700">
                      {dosenPengampu?.nama || "-"}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    Max SKS Dosen:{" "}
                    <strong className="text-gray-700">
                      {dosenPengampu?.maxSks ?? 12} SKS
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                {canUpdate && (
                  <>
                    <select
                      value={selectedDsn[kelasItem.id] || ""}
                      onChange={(e) =>
                        setSelectedDsn((prev) => ({
                          ...prev,
                          [kelasItem.id]: e.target.value,
                        }))
                      }
                      className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Ganti Dosen</option>
                      {dosen.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nama} - Max {item.maxSks ?? 12} SKS
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleChangeDosen(kelasItem)}
                      className="rounded-xl bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-200"
                    >
                      Simpan Dosen
                    </button>
                  </>
                )}

                {canDelete && mahasiswaDalamKelas.length === 0 && (
                  <button
                    onClick={() => handleDeleteKelas(kelasItem)}
                    className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-200"
                  >
                    Hapus Kelas
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-5 py-4 text-left font-bold">No</th>
                    <th className="px-5 py-4 text-left font-bold">Nama</th>
                    <th className="px-5 py-4 text-left font-bold">NIM</th>
                    <th className="px-5 py-4 text-center font-bold">
                      Total SKS
                    </th>
                    <th className="px-5 py-4 text-center font-bold">
                      Max SKS
                    </th>
                    <th className="px-5 py-4 text-center font-bold">
                      Sisa SKS
                    </th>
                    <th className="px-5 py-4 text-center font-bold">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {mahasiswaDalamKelas.length > 0 ? (
                    mahasiswaDalamKelas.map((item, index) => {
                      const totalSks = getTotalSksMahasiswa(item.id);
                      const maxSks = getMaxSksMahasiswa(item);
                      const sisaSks = Math.max(maxSks - totalSks, 0);

                      return (
                        <tr
                          key={item.id}
                          className="bg-white transition hover:bg-blue-50/60"
                        >
                          <td className="px-5 py-4 font-semibold">
                            {index + 1}
                          </td>

                          <td className="px-5 py-4">
                            <div>
                              <p className="font-bold text-gray-800">
                                {item.nama}
                              </p>
                              <p className="text-xs text-gray-400">
                                Mahasiswa
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {item.nim}
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span
                              className={`inline-flex min-w-10 items-center justify-center rounded-full px-3 py-1 text-xs font-bold ${getStatusSks(
                                totalSks,
                                maxSks
                              )}`}
                            >
                              {totalSks}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                              {maxSks}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-center">
                            <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                              {sisaSks}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-center">
                              {canUpdate && (
                                <button
                                  onClick={() =>
                                    handleDeleteMahasiswa(kelasItem, item.id)
                                  }
                                  className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-200"
                                >
                                  Hapus
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-5 py-8 text-center text-sm italic text-gray-400"
                      >
                        Belum ada mahasiswa pada kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {canUpdate && (
              <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 md:flex-row md:items-center">
                <select
                  value={selectedMhs[kelasItem.id] || ""}
                  onChange={(e) =>
                    setSelectedMhs((prev) => ({
                      ...prev,
                      [kelasItem.id]: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:max-w-md"
                >
                  <option value="">Pilih Mahasiswa</option>
                  {mahasiswaBelumMasukKelas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama} - {item.nim} - Max {item.maxSks ?? 24} SKS
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleAddMahasiswa(kelasItem)}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Tambah Mahasiswa
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TableRencanaStudi;