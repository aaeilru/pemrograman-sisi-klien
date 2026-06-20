import Button from "../../../components/atoms/Button";

const MahasiswaTable = ({
  data,
  onEdit,
  onDelete,
  onDetail,
  canUpdate,
  canDelete,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-5 py-4 text-left font-bold">NIM</th>
            <th className="px-5 py-4 text-left font-bold">Nama</th>
            <th className="px-5 py-4 text-left font-bold">Email</th>
            <th className="px-5 py-4 text-left font-bold">Program Studi</th>
            <th className="px-5 py-4 text-center font-bold">Semester</th>
            <th className="px-5 py-4 text-center font-bold">Status</th>
            <th className="px-5 py-4 text-center font-bold">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                className="bg-white transition hover:bg-blue-50/60"
              >
                <td className="px-5 py-4 font-semibold text-gray-700">
                  {item.nim}
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
                  {item.email || "-"}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {item.programStudi}
                </td>

                <td className="px-5 py-4 text-center">
                  <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                    {item.semester}
                  </span>
                </td>

                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-bold ${
                      item.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status ? "Aktif" : "Tidak Aktif"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onDetail(item.id)}
                      className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-200"
                    >
                      Detail
                    </button>

                    {canUpdate && (
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700 transition hover:bg-yellow-200"
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-200"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="px-5 py-12 text-center"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-2xl text-gray-400">!</span>
                  </div>
                  <p className="font-semibold text-gray-500">
                    Belum ada data mahasiswa.
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Tambahkan data mahasiswa atau ubah kata kunci pencarian.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaTable;