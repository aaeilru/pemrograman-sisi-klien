import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { useMahasiswa } from "../../../Utils/Hooks/useMahasiswa";
import { useDosen } from "../../../Utils/Hooks/useDosen";
import { useMataKuliah } from "../../../Utils/Hooks/useMataKuliah";
import { useRencanaStudi } from "../../../Utils/Hooks/useRencanaStudi";

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.data)) return value.data.data;
  return [];
};

const getValue = (object, keys) => {
  for (const key of keys) {
    if (object?.[key] !== undefined && object?.[key] !== null) {
      return object[key];
    }
  }

  return null;
};

const normalizeString = (value) => {
  return String(value ?? "").trim().toLowerCase();
};

const getMataKuliahIdFromKelas = (kelasItem) => {
  return getValue(kelasItem, [
    "mataKuliahId",
    "mata_kuliah_id",
    "mataKuliah_id",
    "matakuliahId",
    "matakuliah_id",
    "mataKuliahID",
    "mata_kuliah",
    "mataKuliah",
    "matkulId",
    "matkul_id",
    "courseId",
    "course_id",
    "kodeMataKuliah",
    "kode_mata_kuliah",
    "kode",
  ]);
};

const getDosenIdFromKelas = (kelasItem) => {
  return getValue(kelasItem, [
    "dosenId",
    "dosen_id",
    "dosenID",
    "lecturerId",
    "lecturer_id",
    "pengampuId",
    "pengampu_id",
    "dosen",
  ]);
};

const getNamaMataKuliah = (matkul) => {
  return getValue(matkul, [
    "nama",
    "namaMataKuliah",
    "nama_mata_kuliah",
    "mataKuliah",
    "matakuliah",
    "name",
    "title",
  ]);
};

const getKodeMataKuliah = (matkul) => {
  return getValue(matkul, [
    "kode",
    "kodeMataKuliah",
    "kode_mata_kuliah",
    "kode_mk",
    "code",
  ]);
};

const getSksMataKuliah = (matkul) => {
  return Number(
    getValue(matkul, [
      "sks",
      "jumlahSks",
      "jumlah_sks",
      "totalSks",
      "total_sks",
      "credit",
      "credits",
    ]) ?? 0
  );
};

const JadwalKuliah = () => {
  const { user } = useAuthStateContext();

  const {
    data: mahasiswaResult = { data: [] },
    isLoading: loadingMahasiswa,
  } = useMahasiswa();

  const {
    data: dosenResult = { data: [] },
    isLoading: loadingDosen,
  } = useDosen();

  const {
    data: mataKuliahResult = { data: [] },
    isLoading: loadingMataKuliah,
  } = useMataKuliah();

  const {
    data: rencanaStudiResult = { data: [] },
    isLoading: loadingRencanaStudi,
  } = useRencanaStudi();

  const mahasiswa = toArray(mahasiswaResult);
  const dosen = toArray(dosenResult);
  const mataKuliah = toArray(mataKuliahResult);
  const rencanaStudi = toArray(rencanaStudiResult);

  const isLoading =
    loadingMahasiswa || loadingDosen || loadingMataKuliah || loadingRencanaStudi;

  const currentMahasiswa =
    mahasiswa.find((item) => Number(item.id) === Number(user?.mahasiswaId)) ||
    mahasiswa.find((item) => item.email === user?.email) ||
    mahasiswa.find((item) => item.nama === user?.name);

  const currentDosen =
    dosen.find((item) => Number(item.id) === Number(user?.dosenId)) ||
    dosen.find((item) => item.email === user?.email) ||
    dosen.find((item) => item.nama === user?.name);

  const getMataKuliahFromKelas = (kelasItem) => {
    const mataKuliahId = getMataKuliahIdFromKelas(kelasItem);

    if (typeof mataKuliahId === "object" && mataKuliahId !== null) {
      return mataKuliahId;
    }

    return (
      mataKuliah.find((item) => {
        const itemId = getValue(item, ["id", "mataKuliahId", "matakuliahId"]);
        const itemKode = getKodeMataKuliah(item);
        const itemNama = getNamaMataKuliah(item);

        return (
          Number(itemId) === Number(mataKuliahId) ||
          normalizeString(itemId) === normalizeString(mataKuliahId) ||
          normalizeString(itemKode) === normalizeString(mataKuliahId) ||
          normalizeString(itemNama) === normalizeString(mataKuliahId)
        );
      }) || null
    );
  };

  const getDosenFromKelas = (kelasItem) => {
    const dosenId = getDosenIdFromKelas(kelasItem);

    if (typeof dosenId === "object" && dosenId !== null) {
      return dosenId;
    }

    return (
      dosen.find((item) => {
        const itemId = getValue(item, ["id", "dosenId"]);
        const itemNama = getValue(item, ["nama", "name"]);
        const itemEmail = getValue(item, ["email"]);

        return (
          Number(itemId) === Number(dosenId) ||
          normalizeString(itemId) === normalizeString(dosenId) ||
          normalizeString(itemNama) === normalizeString(dosenId) ||
          normalizeString(itemEmail) === normalizeString(dosenId)
        );
      }) || null
    );
  };

  const jadwalKuliahMahasiswa = rencanaStudi.filter((kelasItem) =>
    (kelasItem.mahasiswaIds || [])
      .map(Number)
      .includes(Number(currentMahasiswa?.id))
  );

  const jadwalMengajarDosen = rencanaStudi.filter(
    (kelasItem) =>
      Number(getDosenIdFromKelas(kelasItem)) === Number(currentDosen?.id)
  );

  const getTotalSksMahasiswa = () => {
    return jadwalKuliahMahasiswa.reduce((total, kelasItem) => {
      const matkul = getMataKuliahFromKelas(kelasItem);
      return total + getSksMataKuliah(matkul);
    }, 0);
  };

  const getTotalSksDosen = () => {
    return jadwalMengajarDosen.reduce((total, kelasItem) => {
      const matkul = getMataKuliahFromKelas(kelasItem);
      return total + getSksMataKuliah(matkul);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Memuat jadwal kuliah...
        </p>
      </div>
    );
  }

  if (user?.role === "mahasiswa") {
    const totalSks = getTotalSksMahasiswa();
    const maxSks = Number(currentMahasiswa?.maxSks ?? 24);
    const sisaSks = Math.max(maxSks - totalSks, 0);

    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Jadwal Kuliah
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Halaman ini hanya digunakan untuk melihat jadwal kuliah dari KRS yang sudah diambil.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-600">
                Jumlah Jadwal
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {jadwalKuliahMahasiswa.length}
              </h3>
            </div>

            <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5">
              <p className="text-sm font-semibold text-pink-600">
                Total SKS
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {totalSks}
              </h3>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <p className="text-sm font-semibold text-indigo-600">
                Max SKS
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {maxSks}
              </h3>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
              <p className="text-sm font-semibold text-orange-600">
                Sisa SKS
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {sisaSks}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm text-slate-700">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-5 py-4 text-left">No</th>
                  <th className="px-5 py-4 text-left">Mata Kuliah</th>
                  <th className="px-5 py-4 text-center">SKS</th>
                  <th className="px-5 py-4 text-left">Dosen</th>
                  <th className="px-5 py-4 text-left">Hari</th>
                  <th className="px-5 py-4 text-left">Jam</th>
                  <th className="px-5 py-4 text-left">Ruang</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {jadwalKuliahMahasiswa.length > 0 ? (
                  jadwalKuliahMahasiswa.map((kelasItem, index) => {
                    const matkul = getMataKuliahFromKelas(kelasItem);
                    const dosenPengampu = getDosenFromKelas(kelasItem);
                    const namaMatkul = getNamaMataKuliah(matkul);
                    const kodeMatkul = getKodeMataKuliah(matkul);
                    const sksMatkul = getSksMataKuliah(matkul);

                    return (
                      <tr key={kelasItem.id} className="hover:bg-blue-50/60">
                        <td className="px-5 py-4 font-semibold">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-800">
                            {namaMatkul || "Data mata kuliah tidak ditemukan"}
                          </p>
                          <p className="text-xs text-slate-400">
                            Kode: {kodeMatkul || "-"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            {sksMatkul} SKS
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {dosenPengampu?.nama || "-"}
                        </td>

                        <td className="px-5 py-4">
                          {kelasItem.hari || "-"}
                        </td>

                        <td className="px-5 py-4">
                          {kelasItem.jamMulai && kelasItem.jamSelesai
                            ? `${kelasItem.jamMulai} - ${kelasItem.jamSelesai}`
                            : "-"}
                        </td>

                        <td className="px-5 py-4">
                          {kelasItem.ruang || "-"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      Belum ada jadwal kuliah. Silakan ambil KRS pada menu KRS.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === "dosen") {
    const totalSks = getTotalSksDosen();
    const maxSks = Number(currentDosen?.maxSks ?? 12);
    const sisaSks = Math.max(maxSks - totalSks, 0);

    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Jadwal Mengajar
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Halaman ini hanya digunakan untuk melihat jadwal mengajar dosen.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-600">
                Kelas Diampu
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {jadwalMengajarDosen.length}
              </h3>
            </div>

            <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5">
              <p className="text-sm font-semibold text-pink-600">
                Total SKS
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {totalSks}
              </h3>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <p className="text-sm font-semibold text-indigo-600">
                Max SKS
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {maxSks}
              </h3>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
              <p className="text-sm font-semibold text-orange-600">
                Sisa SKS
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {sisaSks}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm text-slate-700">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-5 py-4 text-left">No</th>
                  <th className="px-5 py-4 text-left">Mata Kuliah</th>
                  <th className="px-5 py-4 text-center">SKS</th>
                  <th className="px-5 py-4 text-left">Hari</th>
                  <th className="px-5 py-4 text-left">Jam</th>
                  <th className="px-5 py-4 text-left">Ruang</th>
                  <th className="px-5 py-4 text-center">Jumlah Mahasiswa</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {jadwalMengajarDosen.length > 0 ? (
                  jadwalMengajarDosen.map((kelasItem, index) => {
                    const matkul = getMataKuliahFromKelas(kelasItem);
                    const namaMatkul = getNamaMataKuliah(matkul);
                    const kodeMatkul = getKodeMataKuliah(matkul);
                    const sksMatkul = getSksMataKuliah(matkul);

                    return (
                      <tr key={kelasItem.id} className="hover:bg-blue-50/60">
                        <td className="px-5 py-4 font-semibold">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-800">
                            {namaMatkul || "Data mata kuliah tidak ditemukan"}
                          </p>
                          <p className="text-xs text-slate-400">
                            Kode: {kodeMatkul || "-"} • {sksMatkul} SKS
                          </p>
                        </td>

                        <td className="px-5 py-4 text-center">
                          {sksMatkul}
                        </td>

                        <td className="px-5 py-4">
                          {kelasItem.hari || "-"}
                        </td>

                        <td className="px-5 py-4">
                          {kelasItem.jamMulai && kelasItem.jamSelesai
                            ? `${kelasItem.jamMulai} - ${kelasItem.jamSelesai}`
                            : "-"}
                        </td>

                        <td className="px-5 py-4">
                          {kelasItem.ruang || "-"}
                        </td>

                        <td className="px-5 py-4 text-center">
                          {(kelasItem.mahasiswaIds || []).length}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-8 text-center text-slate-400"
                    >
                      Belum ada jadwal mengajar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">
        Jadwal Kuliah
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Halaman ini hanya digunakan untuk melihat jadwal mahasiswa dan dosen.
      </p>
    </div>
  );
};

export default JadwalKuliah;