import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { useMahasiswa } from "../../../Utils/Hooks/useMahasiswa";
import { useDosen } from "../../../Utils/Hooks/useDosen";
import { useMataKuliah } from "../../../Utils/Hooks/useMataKuliah";
import { useRencanaStudi } from "../../../Utils/Hooks/useRencanaStudi";
import { useChartData } from "../../../Utils/Hooks/useChart";

const FACULTY_COLORS = [
  "#93c5fd",
  "#c4b5fd",
  "#fdba74",
  "#f9a8d4",
  "#a5b4fc",
  "#fbcfe8",
  "#bfdbfe",
];

const getGenderColor = (gender) => {
  if (gender?.toLowerCase() === "perempuan") return "#f9a8d4";
  if (gender?.toLowerCase() === "laki-laki") return "#93c5fd";
  return "#cbd5e1";
};

const tooltipStyle = {
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
  fontSize: "13px",
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

const findById = (items, id) => {
  return items.find((item) => Number(item.id) === Number(id));
};

const DashboardAdmin = ({ chartData }) => {
  const {
    students = [],
    genderRatio = [],
    registrations = [],
    gradeDistribution = [],
    lecturerRanks = [],
  } = chartData;

  const totalMahasiswa = students.reduce(
    (total, item) => total + Number(item.count ?? 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Dashboard Admin
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 p-5">
            <p className="text-sm font-semibold text-sky-600">
              Total Fakultas
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {students.length}
            </h3>
          </div>

          <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 to-rose-50 p-5">
            <p className="text-sm font-semibold text-pink-600">
              Data Gender
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {genderRatio.length}
            </h3>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
            <p className="text-sm font-semibold text-orange-600">
              Jumlah Mahasiswa
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {totalMahasiswa}
            </h3>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
            <p className="text-sm font-semibold text-violet-600">
              Distribusi Nilai
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {gradeDistribution.length}
            </h3>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-5">
            <p className="text-sm font-semibold text-indigo-600">
              Pangkat Dosen
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {lecturerRanks.length}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Mahasiswa per Fakultas
          </h3>
          <div className="mt-5 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={students}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="faculty"
                  stroke="#64748b"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {students.map((entry, index) => (
                    <Cell
                      key={entry.id}
                      fill={FACULTY_COLORS[index % FACULTY_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Rasio Gender Mahasiswa
          </h3>
          <div className="mt-5 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderRatio}
                  dataKey="count"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={55}
                  paddingAngle={4}
                  label
                >
                  {genderRatio.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={getGenderColor(entry.gender)}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Tren Pendaftaran Mahasiswa
          </h3>
          <div className="mt-5 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="year"
                  stroke="#64748b"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Jumlah Pendaftar"
                  stroke="#60a5fa"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#60a5fa" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900">
            Distribusi Nilai per Jurusan
          </h3>
          <div className="mt-5 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={gradeDistribution}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis
                  dataKey="subject"
                  stroke="#64748b"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />

                <Radar
                  name="Nilai A"
                  dataKey="A"
                  stroke="#93c5fd"
                  fill="#93c5fd"
                  fillOpacity={0.45}
                />

                <Radar
                  name="Nilai B"
                  dataKey="B"
                  stroke="#c4b5fd"
                  fill="#c4b5fd"
                  fillOpacity={0.35}
                />

                <Radar
                  name="Nilai C"
                  dataKey="C"
                  stroke="#fdba74"
                  fill="#fdba74"
                  fillOpacity={0.3}
                />

                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h3 className="text-lg font-bold text-slate-900">
            Jumlah Dosen Berdasarkan Pangkat
          </h3>
          
          <div className="mt-5 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lecturerRanks}>
                <defs>
                  <linearGradient
                    id="colorLecturerPastel"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#c4b5fd"
                      stopOpacity={0.7}
                    />
                    <stop
                      offset="95%"
                      stopColor="#c4b5fd"
                      stopOpacity={0.08}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="rank"
                  stroke="#64748b"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Jumlah Dosen"
                  stroke="#a78bfa"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLecturerPastel)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardDosen = ({ user, dosen, mataKuliah, rencanaStudi }) => {
  const currentDosen =
    dosen.find((item) => Number(item.id) === Number(user?.dosenId)) ||
    dosen.find((item) => item.email === user?.email) ||
    dosen.find((item) => item.nama === user?.name);

  const jadwalMengajar = rencanaStudi.filter(
    (item) => Number(item.dosenId) === Number(currentDosen?.id)
  );

  const totalSksMengajar = jadwalMengajar.reduce((total, item) => {
    const matkul = findById(mataKuliah, item.mataKuliahId);
    return total + Number(matkul?.sks ?? 0);
  }, 0);

  const maxSks = Number(currentDosen?.maxSks ?? 12);
  const sisaSks = Math.max(maxSks - totalSksMengajar, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Dashboard Dosen
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan jadwal mengajar dan kapasitas SKS dosen.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-semibold text-blue-600">
              Kelas Diampu
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {jadwalMengajar.length}
            </h3>
          </div>

          <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5">
            <p className="text-sm font-semibold text-pink-600">
              Total SKS Diampu
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {totalSksMengajar}
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
        <h3 className="text-lg font-bold text-slate-900">
          Jadwal Mengajar
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Daftar mata kuliah yang sedang diampu.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm text-slate-700">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-5 py-4 text-left">Mata Kuliah</th>
                <th className="px-5 py-4 text-center">SKS</th>
                <th className="px-5 py-4 text-center">Jumlah Mahasiswa</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {jadwalMengajar.length > 0 ? (
                jadwalMengajar.map((item) => {
                  const matkul = findById(mataKuliah, item.mataKuliahId);
                  const totalMahasiswa = item.mahasiswaIds?.length || 0;

                  return (
                    <tr key={item.id} className="hover:bg-blue-50/60">
                      <td className="px-5 py-4 font-bold text-slate-800">
                        {matkul?.nama || "-"}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {matkul?.sks || 0}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {totalMahasiswa}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="3"
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
};

const DashboardMahasiswa = ({
  user,
  mahasiswa,
  mataKuliah,
  rencanaStudi,
  dosen,
}) => {
  const currentMahasiswa =
    mahasiswa.find((item) => Number(item.id) === Number(user?.mahasiswaId)) ||
    mahasiswa.find((item) => item.email === user?.email) ||
    mahasiswa.find((item) => item.nama === user?.name);

  const jadwalKuliah = rencanaStudi.filter((item) =>
    (item.mahasiswaIds || [])
      .map(Number)
      .includes(Number(currentMahasiswa?.id))
  );

  const totalSks = jadwalKuliah.reduce((total, item) => {
    const matkul = findById(mataKuliah, item.mataKuliahId);
    return total + Number(matkul?.sks ?? 0);
  }, 0);

  const maxSks = Number(currentMahasiswa?.maxSks ?? 24);
  const sisaSks = Math.max(maxSks - totalSks, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Dashboard Mahasiswa
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Ringkasan jadwal kuliah dan batas SKS mahasiswa.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-semibold text-blue-600">
              Jadwal Kuliah
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {jadwalKuliah.length}
            </h3>
          </div>

          <div className="rounded-2xl border border-pink-100 bg-pink-50 p-5">
            <p className="text-sm font-semibold text-pink-600">
              Total SKS Diambil
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
        <h3 className="text-lg font-bold text-slate-900">
          Jadwal Kuliah
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Daftar mata kuliah yang sedang diambil.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-sm text-slate-700">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-5 py-4 text-left">Mata Kuliah</th>
                <th className="px-5 py-4 text-center">SKS</th>
                <th className="px-5 py-4 text-left">Dosen</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {jadwalKuliah.length > 0 ? (
                jadwalKuliah.map((item) => {
                  const matkul = findById(mataKuliah, item.mataKuliahId);
                  const dosenPengampu = findById(dosen, item.dosenId);

                  return (
                    <tr key={item.id} className="hover:bg-blue-50/60">
                      <td className="px-5 py-4 font-bold text-slate-800">
                        {matkul?.nama || "-"}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {matkul?.sks || 0}
                      </td>
                      <td className="px-5 py-4">
                        {dosenPengampu?.nama || "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-5 py-8 text-center text-slate-400"
                  >
                    Belum ada jadwal kuliah.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
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

  const {
    data: chartData = {},
    isLoading: loadingChart,
  } = useChartData();

  const mahasiswa = toArray(mahasiswaResult);
  const dosen = toArray(dosenResult);
  const mataKuliah = toArray(mataKuliahResult);
  const rencanaStudi = toArray(rencanaStudiResult);

  const isLoading =
    loadingMahasiswa ||
    loadingDosen ||
    loadingMataKuliah ||
    loadingRencanaStudi ||
    loadingChart;

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Memuat dashboard...
        </p>
      </div>
    );
  }

  if (user?.role === "dosen") {
    return (
      <DashboardDosen
        user={user}
        dosen={dosen}
        mataKuliah={mataKuliah}
        rencanaStudi={rencanaStudi}
      />
    );
  }

  if (user?.role === "mahasiswa") {
    return (
      <DashboardMahasiswa
        user={user}
        mahasiswa={mahasiswa}
        mataKuliah={mataKuliah}
        rencanaStudi={rencanaStudi}
        dosen={dosen}
      />
    );
  }

  return <DashboardAdmin chartData={chartData} />;
};

export default Dashboard;