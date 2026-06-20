import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMahasiswa } from "../../../Utils/Apis/MahasiswaApi";

const MahasiswaDetail = () => {
  const { id } = useParams();

  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMahasiswa = async () => {
    try {
      const res = await getMahasiswa(id);
      setMahasiswa(res.data);
    } catch (err) {
      console.error(err);
      setMahasiswa(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMahasiswa();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <p className="text-gray-500">Memuat data mahasiswa...</p>
      </div>
    );
  }

  if (!mahasiswa) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Detail Mahasiswa
        </h2>

        <p className="text-red-500">
          Data mahasiswa tidak ditemukan.
        </p>

        <Link
          to="/admin/mahasiswa"
          className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Kembali
        </Link>
      </div>
    );
  }

  const fields = [
    { label: "NIM", value: mahasiswa.nim },
    { label: "Nama", value: mahasiswa.nama },
    { label: "Program Studi", value: mahasiswa.programStudi },
    { label: "Semester", value: mahasiswa.semester },
    { label: "Email", value: mahasiswa.email },
    { label: "Alamat", value: mahasiswa.alamat },
    {
      label: "Status",
      value: (
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
            mahasiswa.status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {mahasiswa.status ? "Aktif" : "Tidak Aktif"}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Detail Mahasiswa
        </h2>

        <Link
          to="/admin/mahasiswa"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
        >
          Kembali
        </Link>
      </div>

      <table className="w-full text-sm">
        <tbody>
          {fields.map((field, index) => (
            <tr key={index} className="border-b last:border-b-0">
              <td className="py-3 pr-6 text-gray-400 font-medium w-36 align-top">
                {field.label}
              </td>

              <td className="py-3 text-gray-800 font-medium">
                {field.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaDetail;