import Button from "../../../components/atoms/Button";

const MahasiswaTable = ({
  data = [],
  onEdit,
  onDelete,
  onDetail,
  canUpdate = false,
  canDelete = false,
}) => {
  return (
    <table className="w-full text-sm text-gray-700 border-collapse">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-3 px-4 text-left">NIM</th>
          <th className="py-3 px-4 text-left">Nama</th>
          <th className="py-3 px-4 text-left">Program Studi</th>
          <th className="py-3 px-4 text-left">Status</th>
          <th className="py-3 px-4 text-center">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {data.length > 0 ? (
          data.map((mhs, index) => (
            <tr
              key={mhs.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="py-3 px-4">{mhs.nim}</td>
              <td className="py-3 px-4 font-medium">{mhs.nama}</td>
              <td className="py-3 px-4">{mhs.programStudi}</td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    mhs.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {mhs.status ? "Aktif" : "Tidak Aktif"}
                </span>
              </td>

              <td className="py-3 px-4 text-center space-x-2">
                <Button size="sm" onClick={() => onDetail(mhs.id)}>
                  Detail
                </Button>

                {canUpdate && (
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => onEdit(mhs)}
                  >
                    Edit
                  </Button>
                )}

                {canDelete && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(mhs.id)}
                  >
                    Hapus
                  </Button>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="py-6 text-center text-gray-400 italic">
              Belum ada data mahasiswa.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;