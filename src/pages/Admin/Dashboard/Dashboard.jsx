import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { useMahasiswa } from "../../../Utils/Hooks/useMahasiswa";
import { useDosen } from "../../../Utils/Hooks/useDosen";
import { useMataKuliah } from "../../../Utils/Hooks/useMataKuliah";
import { useKelas } from "../../../Utils/Hooks/useKelas";

const Dashboard = () => {
  const { user } = useAuthStateContext();

  const {
    data: mahasiswa = [],
    isLoading: loadingMahasiswa,
  } = useMahasiswa();

  const {
    data: dosen = [],
    isLoading: loadingDosen,
  } = useDosen();

  const {
    data: mataKuliah = [],
    isLoading: loadingMataKuliah,
  } = useMataKuliah(user);

  const {
    data: kelas = [],
    isLoading: loadingKelas,
  } = useKelas();

  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "dosen"
      ? "Dosen"
      : user?.role === "mahasiswa"
      ? "Mahasiswa"
      : "User";

  const isLoading =
    loadingMahasiswa ||
    loadingDosen ||
    loadingMataKuliah ||
    loadingKelas;

  const summaryItems = [
    {
      title: "Mahasiswa",
      value: mahasiswa.length,
      permission: "mahasiswa.read",
    },
    {
      title: "Dosen",
      value: dosen.length,
      permission: "dosen.read",
    },
    {
      title: "Mata Kuliah",
      value: mataKuliah.length,
      permission: "matakuliah.read",
    },
    {
      title: "Kelas",
      value: kelas.length,
      permission: "kelas.read",
    },
  ].filter((item) => user?.permission?.includes(item.permission));

  const activePermissions = user?.permission?.length || 0;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Dashboard
            </h2>

            <p className="mt-2 text-gray-600">
              Selamat datang,{" "}
              <span className="font-semibold text-gray-800">
                {user?.name || roleLabel}
              </span>
              .
            </p>
          </div>

          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <p className="text-xs text-gray-500">
              Login sebagai
            </p>
            <p className="font-semibold text-gray-800">
              {roleLabel}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Ringkasan Data
        </h3>

        {isLoading ? (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">
              Memuat ringkasan data...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {summaryItems.map((item) => (
              <div
                key={item.title}
                className="bg-white shadow rounded-lg p-5 border-l-4 border-blue-600"
              >
                <p className="text-sm text-gray-500">
                  Total {item.title}
                </p>

                <h4 className="text-3xl font-bold text-gray-800 mt-3">
                  {item.value}
                </h4>

                <p className="text-xs text-gray-400 mt-2">
                  Data aktif dalam sistem
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;