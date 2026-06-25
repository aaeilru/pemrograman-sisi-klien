import { useState } from "react";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { useMahasiswa } from "../../../Utils/Hooks/useMahasiswa";
import { useDosen } from "../../../Utils/Hooks/useDosen";
import { useMataKuliah } from "../../../Utils/Hooks/useMataKuliah";
import {
  useRencanaStudi,
  useStoreRencanaStudi,
  useUpdateRencanaStudi,
  useDeleteRencanaStudi,
} from "../../../Utils/Hooks/useRencanaStudi";
import { toastError } from "../../../Utils/Helpers/ToastHelpers";
import TableRencanaStudi from "./TableRencanaStudi";
import ModalRencanaStudi from "./ModalRencanaStudi";

const initialForm = {
  mataKuliahId: "",
  dosenId: "",
  hari: "",
  jamMulai: "",
  jamSelesai: "",
  ruang: "",
};

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

const RencanaStudi = () => {
  const { user } = useAuthStateContext();

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [selectedMhs, setSelectedMhs] = useState({});
  const [selectedDsn, setSelectedDsn] = useState({});

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

  const storeMutation = useStoreRencanaStudi();
  const updateMutation = useUpdateRencanaStudi();
  const deleteMutation = useDeleteRencanaStudi();

  const mahasiswa = toArray(mahasiswaResult);
  const dosen = toArray(dosenResult);
  const mataKuliah = toArray(mataKuliahResult);
  const rencanaStudi = toArray(rencanaStudiResult);

  const isLoading =
    loadingMahasiswa || loadingDosen || loadingMataKuliah || loadingRencanaStudi;

  const isAdmin = user?.role === "admin";
  const isMahasiswa = user?.role === "mahasiswa";
  const isDosen = user?.role === "dosen";

  const canCreate = user?.permission?.includes("rencana-studi.create");
  const canUpdate = user?.permission?.includes("rencana-studi.update");
  const canDelete = user?.permission?.includes("rencana-studi.delete");

  const getMataKuliah = (id) => {
    return mataKuliah.find((item) => {
      const itemId = getValue(item, ["id", "mataKuliahId", "matakuliahId"]);
      const itemKode = getKodeMataKuliah(item);
      const itemNama = getNamaMataKuliah(item);

      return (
        Number(itemId) === Number(id) ||
        normalizeString(itemId) === normalizeString(id) ||
        normalizeString(itemKode) === normalizeString(id) ||
        normalizeString(itemNama) === normalizeString(id)
      );
    });
  };

  const getMataKuliahFromKelas = (kelasItem) => {
    const mataKuliahId = getMataKuliahIdFromKelas(kelasItem);

    if (typeof mataKuliahId === "object" && mataKuliahId !== null) {
      return mataKuliahId;
    }

    return getMataKuliah(mataKuliahId);
  };

  const getDosen = (id) => {
    return dosen.find((item) => {
      const itemId = getValue(item, ["id", "dosenId"]);
      const itemNama = getValue(item, ["nama", "name"]);
      const itemEmail = getValue(item, ["email"]);

      return (
        Number(itemId) === Number(id) ||
        normalizeString(itemId) === normalizeString(id) ||
        normalizeString(itemNama) === normalizeString(id) ||
        normalizeString(itemEmail) === normalizeString(id)
      );
    });
  };

  const getDosenFromKelas = (kelasItem) => {
    const dosenId = getDosenIdFromKelas(kelasItem);

    if (typeof dosenId === "object" && dosenId !== null) {
      return dosenId;
    }

    return getDosen(dosenId);
  };

  const getMahasiswa = (id) =>
    mahasiswa.find((item) => Number(item.id) === Number(id));

  const currentMahasiswa =
    mahasiswa.find((item) => Number(item.id) === Number(user?.mahasiswaId)) ||
    mahasiswa.find((item) => item.email === user?.email) ||
    mahasiswa.find((item) => item.nama === user?.name);

  const currentDosen =
    dosen.find((item) => Number(item.id) === Number(user?.dosenId)) ||
    dosen.find((item) => item.email === user?.email) ||
    dosen.find((item) => item.nama === user?.name);

  const getTotalSksMahasiswa = (mahasiswaId) => {
    return rencanaStudi.reduce((total, kelasItem) => {
      const mahasiswaIds = (kelasItem.mahasiswaIds || []).map(Number);
      const matkul = getMataKuliahFromKelas(kelasItem);

      if (mahasiswaIds.includes(Number(mahasiswaId))) {
        return total + getSksMataKuliah(matkul);
      }

      return total;
    }, 0);
  };

  const getTotalSksDosen = (dosenId, exceptKelasId = null) => {
    return rencanaStudi.reduce((total, kelasItem) => {
      if (Number(kelasItem.id) === Number(exceptKelasId)) return total;

      const matkul = getMataKuliahFromKelas(kelasItem);
      const kelasDosenId = getDosenIdFromKelas(kelasItem);

      if (Number(kelasDosenId) === Number(dosenId)) {
        return total + getSksMataKuliah(matkul);
      }

      return total;
    }, 0);
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setIsOpen(false);
  };

  const handleStoreKelas = (e) => {
    e.preventDefault();

    if (
      !form.mataKuliahId ||
      !form.dosenId ||
      !form.hari ||
      !form.jamMulai ||
      !form.jamSelesai ||
      !form.ruang
    ) {
      toastError("Mata kuliah, dosen, hari, jam, dan ruang wajib diisi.");
      return;
    }

    const matkul = getMataKuliah(form.mataKuliahId);
    const dosenPengampu = getDosen(form.dosenId);

    if (!matkul || !dosenPengampu) {
      toastError("Data mata kuliah atau dosen tidak valid.");
      return;
    }

    const totalSksDosen = getTotalSksDosen(form.dosenId);
    const maxSksDosen = Number(dosenPengampu?.maxSks ?? 12);
    const sksMatkul = getSksMataKuliah(matkul);

    if (totalSksDosen + sksMatkul > maxSksDosen) {
      toastError(
        `Dosen melebihi batas maksimal SKS. Total saat ini ${totalSksDosen} SKS, mata kuliah baru ${sksMatkul} SKS, maksimal ${maxSksDosen} SKS.`
      );
      return;
    }

    storeMutation.mutate(
      {
        mataKuliahId: Number(form.mataKuliahId),
        dosenId: Number(form.dosenId),
        hari: form.hari,
        jamMulai: form.jamMulai,
        jamSelesai: form.jamSelesai,
        ruang: form.ruang,
        mahasiswaIds: [],
      },
      {
        onSuccess: resetForm,
      }
    );
  };

  const handleAddMahasiswa = (kelasItem) => {
    const mahasiswaId = selectedMhs[kelasItem.id];

    if (!mahasiswaId) {
      toastError("Pilih mahasiswa terlebih dahulu.");
      return;
    }

    const mahasiswaDipilih = getMahasiswa(mahasiswaId);
    const matkul = getMataKuliahFromKelas(kelasItem);

    if (!mahasiswaDipilih || !matkul) {
      toastError("Data mahasiswa atau mata kuliah tidak valid.");
      return;
    }

    const totalSks = getTotalSksMahasiswa(mahasiswaId);
    const maxSks = Number(mahasiswaDipilih?.maxSks ?? 24);
    const sksMatkul = getSksMataKuliah(matkul);

    if (totalSks + sksMatkul > maxSks) {
      toastError(
        `Mahasiswa melebihi maksimal SKS. Total saat ini ${totalSks} SKS, mata kuliah baru ${sksMatkul} SKS, maksimal ${maxSks} SKS.`
      );
      return;
    }

    const mahasiswaIds = (kelasItem.mahasiswaIds || []).map(Number);

    updateMutation.mutate({
      id: kelasItem.id,
      data: {
        ...kelasItem,
        mahasiswaIds: [...new Set([...mahasiswaIds, Number(mahasiswaId)])],
      },
    });

    setSelectedMhs((prev) => ({
      ...prev,
      [kelasItem.id]: "",
    }));
  };

  const handleDeleteMahasiswa = (kelasItem, mahasiswaId) => {
    const updatedMahasiswaIds = (kelasItem.mahasiswaIds || [])
      .map(Number)
      .filter((id) => Number(id) !== Number(mahasiswaId));

    updateMutation.mutate({
      id: kelasItem.id,
      data: {
        ...kelasItem,
        mahasiswaIds: updatedMahasiswaIds,
      },
    });
  };

  const handleChangeDosen = (kelasItem) => {
    const dosenId = selectedDsn[kelasItem.id];

    if (!dosenId) {
      toastError("Pilih dosen terlebih dahulu.");
      return;
    }

    const dosenDipilih = getDosen(dosenId);
    const matkul = getMataKuliahFromKelas(kelasItem);

    if (!dosenDipilih || !matkul) {
      toastError("Data dosen atau mata kuliah tidak valid.");
      return;
    }

    const totalSksDosen = getTotalSksDosen(dosenId, kelasItem.id);
    const maxSksDosen = Number(dosenDipilih?.maxSks ?? 12);
    const sksMatkul = getSksMataKuliah(matkul);

    if (totalSksDosen + sksMatkul > maxSksDosen) {
      toastError(
        `Dosen melebihi batas maksimal SKS. Total saat ini ${totalSksDosen} SKS, mata kuliah ini ${sksMatkul} SKS, maksimal ${maxSksDosen} SKS.`
      );
      return;
    }

    updateMutation.mutate({
      id: kelasItem.id,
      data: {
        ...kelasItem,
        dosenId: Number(dosenId),
      },
    });

    setSelectedDsn((prev) => ({
      ...prev,
      [kelasItem.id]: "",
    }));
  };

  const handleDeleteKelas = (kelasItem) => {
    const mahasiswaIds = kelasItem.mahasiswaIds || [];

    if (mahasiswaIds.length > 0) {
      toastError("Kelas tidak dapat dihapus karena masih memiliki mahasiswa.");
      return;
    }

    deleteMutation.mutate(kelasItem.id);
  };

  const handleAmbilKrs = (kelasItem) => {
    if (!currentMahasiswa) {
      toastError(
        "Akun mahasiswa belum terhubung dengan data mahasiswa. Tambahkan mahasiswaId pada data user atau samakan email user dengan email mahasiswa."
      );
      return;
    }

    const matkul = getMataKuliahFromKelas(kelasItem);

    if (!matkul) {
      toastError("Data mata kuliah tidak ditemukan.");
      return;
    }

    const totalSks = getTotalSksMahasiswa(currentMahasiswa.id);
    const maxSks = Number(currentMahasiswa?.maxSks ?? 24);
    const sksMatkul = getSksMataKuliah(matkul);

    if (totalSks + sksMatkul > maxSks) {
      toastError(
        `KRS tidak dapat ditambahkan. Total SKS menjadi ${
          totalSks + sksMatkul
        }, sedangkan maksimal SKS kamu ${maxSks}.`
      );
      return;
    }

    const mahasiswaIds = (kelasItem.mahasiswaIds || []).map(Number);

    if (mahasiswaIds.includes(Number(currentMahasiswa.id))) {
      toastError("Mata kuliah ini sudah ada di KRS kamu.");
      return;
    }

    updateMutation.mutate({
      id: kelasItem.id,
      data: {
        ...kelasItem,
        mahasiswaIds: [...mahasiswaIds, Number(currentMahasiswa.id)],
      },
    });
  };

  const handleBatalkanKrs = (kelasItem) => {
    if (!currentMahasiswa) {
      toastError("Data mahasiswa tidak ditemukan.");
      return;
    }

    const mahasiswaIdsBaru = (kelasItem.mahasiswaIds || [])
      .map(Number)
      .filter((id) => Number(id) !== Number(currentMahasiswa.id));

    updateMutation.mutate({
      id: kelasItem.id,
      data: {
        ...kelasItem,
        mahasiswaIds: mahasiswaIdsBaru,
      },
    });
  };

  const mataKuliahSudahDipakai = rencanaStudi.map((item) =>
    Number(getMataKuliahIdFromKelas(item))
  );

  const mataKuliahBelumAdaKelas = mataKuliah.filter(
    (item) => !mataKuliahSudahDipakai.includes(Number(item.id))
  );

  const jadwalKuliahMahasiswa = rencanaStudi.filter((kelasItem) =>
    (kelasItem.mahasiswaIds || [])
      .map(Number)
      .includes(Number(currentMahasiswa?.id))
  );

  const kelasTersediaUntukMahasiswa = rencanaStudi.filter(
    (kelasItem) =>
      !(kelasItem.mahasiswaIds || [])
        .map(Number)
        .includes(Number(currentMahasiswa?.id))
  );

  const jadwalMengajarDosen = rencanaStudi.filter(
    (kelasItem) =>
      Number(getDosenIdFromKelas(kelasItem)) === Number(currentDosen?.id)
  );

  const totalSksMahasiswa = currentMahasiswa
    ? getTotalSksMahasiswa(currentMahasiswa.id)
    : 0;

  const maxSksMahasiswa = Number(currentMahasiswa?.maxSks ?? 24);
  const sisaSksMahasiswa = Math.max(maxSksMahasiswa - totalSksMahasiswa, 0);

  const totalSksDosen = jadwalMengajarDosen.reduce((total, kelasItem) => {
    const matkul = getMataKuliahFromKelas(kelasItem);
    return total + getSksMataKuliah(matkul);
  }, 0);

  const maxSksDosen = Number(currentDosen?.maxSks ?? 12);
  const sisaSksDosen = Math.max(maxSksDosen - totalSksDosen, 0);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Memuat data rencana studi...
        </p>
      </div>
    );
  }

  if (isMahasiswa) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Kartu Rencana Studi
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ambil atau batalkan KRS. Jadwal kuliah dapat dilihat pada menu Jadwal Kuliah.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-600">
                KRS Diambil
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
                {totalSksMahasiswa}
              </h3>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <p className="text-sm font-semibold text-indigo-600">
                Max SKS
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {maxSksMahasiswa}
              </h3>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
              <p className="text-sm font-semibold text-orange-600">
                Sisa SKS
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {sisaSksMahasiswa}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">KRS Saya</h3>
          <p className="mt-1 text-sm text-slate-500">
            Daftar mata kuliah yang sudah diambil. KRS dapat dibatalkan dari halaman ini.
          </p>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm text-slate-700">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-5 py-4 text-left">No</th>
                  <th className="px-5 py-4 text-left">Mata Kuliah</th>
                  <th className="px-5 py-4 text-center">SKS</th>
                  <th className="px-5 py-4 text-left">Dosen</th>
                  <th className="px-5 py-4 text-left">Jadwal</th>
                  <th className="px-5 py-4 text-left">Ruang</th>
                  <th className="px-5 py-4 text-center">Aksi</th>
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
                          <p>{kelasItem.hari || "-"}</p>
                          <p className="text-xs text-slate-400">
                            {kelasItem.jamMulai && kelasItem.jamSelesai
                              ? `${kelasItem.jamMulai} - ${kelasItem.jamSelesai}`
                              : "-"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {kelasItem.ruang || "-"}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => handleBatalkanKrs(kelasItem)}
                            className="rounded-xl bg-red-100 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-200"
                          >
                            Batalkan
                          </button>
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
                      Belum ada KRS yang diambil.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">Pilih KRS</h3>
          <p className="mt-1 text-sm text-slate-500">
            Pilih mata kuliah yang tersedia. Sistem akan mengecek batas maksimal SKS.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {kelasTersediaUntukMahasiswa.length > 0 ? (
              kelasTersediaUntukMahasiswa.map((kelasItem) => {
                const matkul = getMataKuliahFromKelas(kelasItem);
                const dosenPengampu = getDosenFromKelas(kelasItem);
                const namaMatkul = getNamaMataKuliah(matkul);
                const kodeMatkul = getKodeMataKuliah(matkul);
                const sksMatkul = getSksMataKuliah(matkul);
                const melewatiBatas =
                  totalSksMahasiswa + sksMatkul > maxSksMahasiswa;

                return (
                  <div
                    key={kelasItem.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {namaMatkul || "Data mata kuliah tidak ditemukan"}
                        </h4>

                        <div className="mt-2 space-y-1 text-sm text-slate-500">
                          <p>Kode: {kodeMatkul || "-"}</p>
                          <p>SKS: {sksMatkul}</p>
                          <p>Dosen: {dosenPengampu?.nama || "-"}</p>
                          <p>Hari: {kelasItem.hari || "-"}</p>
                          <p>
                            Jam:{" "}
                            {kelasItem.jamMulai && kelasItem.jamSelesai
                              ? `${kelasItem.jamMulai} - ${kelasItem.jamSelesai}`
                              : "-"}
                          </p>
                          <p>Ruang: {kelasItem.ruang || "-"}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAmbilKrs(kelasItem)}
                        disabled={melewatiBatas || !namaMatkul}
                        className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                          melewatiBatas || !namaMatkul
                            ? "cursor-not-allowed bg-slate-200 text-slate-400"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        Ambil KRS
                      </button>
                    </div>

                    {melewatiBatas && (
                      <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                        Tidak dapat diambil karena melebihi maksimal SKS.
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-400 lg:col-span-2">
                Tidak ada mata kuliah yang tersedia untuk diambil.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isDosen) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Jadwal Mengajar
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Daftar kelas dan mata kuliah yang sedang diampu dosen.
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
                Total SKS Diampu
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {totalSksDosen}
              </h3>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <p className="text-sm font-semibold text-indigo-600">
                Max SKS
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {maxSksDosen}
              </h3>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
              <p className="text-sm font-semibold text-orange-600">
                Sisa SKS
              </p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {sisaSksDosen}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Rencana Studi
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Kelola kelas, dosen pengampu, dan mahasiswa pada rencana studi.
            </p>
          </div>

          {canCreate && (
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              + Tambah Kelas
            </button>
          )}
        </div>

        <TableRencanaStudi
          kelas={rencanaStudi}
          mahasiswa={mahasiswa}
          dosen={dosen}
          mataKuliah={mataKuliah}
          selectedMhs={selectedMhs}
          setSelectedMhs={setSelectedMhs}
          selectedDsn={selectedDsn}
          setSelectedDsn={setSelectedDsn}
          handleAddMahasiswa={handleAddMahasiswa}
          handleDeleteMahasiswa={handleDeleteMahasiswa}
          handleChangeDosen={handleChangeDosen}
          handleDeleteKelas={handleDeleteKelas}
          getTotalSksMahasiswa={getTotalSksMahasiswa}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />

        <ModalRencanaStudi
          isOpen={isOpen}
          form={form}
          dosen={dosen}
          mataKuliah={mataKuliahBelumAdaKelas}
          onChange={handleChangeForm}
          onClose={resetForm}
          onSubmit={handleStoreKelas}
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        Role user belum dikenali.
      </p>
    </div>
  );
};

export default RencanaStudi;