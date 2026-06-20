import { useState } from "react";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { toastError } from "../../../Utils/Helpers/ToastHelpers";
import {
  confirmDelete,
  confirmDialog,
} from "../../../Utils/Helpers/SwalHelpers";
import TablePagination from "../Components/TablePagination";
import {
  useUser,
  useStoreUser,
  useUpdateUser,
  useDeleteUser,
} from "../../../Utils/Hooks/useUser";

const permissionOptions = [
  {
    group: "Dashboard",
    permissions: [
      { key: "dashboard.page", label: "Akses Dashboard" },
    ],
  },
  {
    group: "Mahasiswa",
    permissions: [
      { key: "mahasiswa.page", label: "Menu Mahasiswa" },
      { key: "mahasiswa.read", label: "Lihat Mahasiswa" },
      { key: "mahasiswa.create", label: "Tambah Mahasiswa" },
      { key: "mahasiswa.update", label: "Edit Mahasiswa" },
      { key: "mahasiswa.delete", label: "Hapus Mahasiswa" },
    ],
  },
  {
    group: "Dosen",
    permissions: [
      { key: "dosen.page", label: "Menu Dosen" },
      { key: "dosen.read", label: "Lihat Dosen" },
      { key: "dosen.create", label: "Tambah Dosen" },
      { key: "dosen.update", label: "Edit Dosen" },
      { key: "dosen.delete", label: "Hapus Dosen" },
    ],
  },
  {
    group: "Mata Kuliah",
    permissions: [
      { key: "matakuliah.page", label: "Menu Mata Kuliah" },
      { key: "matakuliah.read", label: "Lihat Mata Kuliah" },
      { key: "matakuliah.create", label: "Tambah Mata Kuliah" },
      { key: "matakuliah.update", label: "Edit Mata Kuliah" },
      { key: "matakuliah.delete", label: "Hapus Mata Kuliah" },
    ],
  },
  {
    group: "Kelas",
    permissions: [
      { key: "kelas.page", label: "Menu Kelas" },
      { key: "kelas.read", label: "Lihat Kelas" },
      { key: "kelas.create", label: "Tambah Kelas" },
      { key: "kelas.update", label: "Edit Kelas" },
      { key: "kelas.delete", label: "Hapus Kelas" },
    ],
  },
  {
    group: "User Management",
    permissions: [
      { key: "user.page", label: "Menu User" },
      { key: "user.read", label: "Lihat User" },
      { key: "user.create", label: "Tambah User" },
      { key: "user.update", label: "Edit Role & Permission" },
      { key: "user.delete", label: "Hapus User" },
    ],
  },
];

const roleTemplates = {
  admin: [
    "dashboard.page",

    "mahasiswa.page",
    "mahasiswa.read",
    "mahasiswa.create",
    "mahasiswa.update",
    "mahasiswa.delete",

    "dosen.page",
    "dosen.read",
    "dosen.create",
    "dosen.update",
    "dosen.delete",

    "matakuliah.page",
    "matakuliah.read",
    "matakuliah.create",
    "matakuliah.update",
    "matakuliah.delete",

    "kelas.page",
    "kelas.read",
    "kelas.create",
    "kelas.update",
    "kelas.delete",

    "user.page",
    "user.read",
    "user.create",
    "user.update",
    "user.delete",
  ],

  dosen: [
    "dashboard.page",

    "mahasiswa.page",
    "mahasiswa.read",

    "matakuliah.page",
    "matakuliah.read",
    "matakuliah.create",
    "matakuliah.update",
    "matakuliah.delete",

    "kelas.page",
    "kelas.read",
  ],

  mahasiswa: [
    "dashboard.page",
    "matakuliah.page",
    "matakuliah.read",
    "kelas.page",
    "kelas.read",
  ],
};

const initialForm = {
  id: null,
  name: "",
  email: "",
  password: "",
  role: "mahasiswa",
  permission: roleTemplates.mahasiswa,
  dosenId: "",
};

const User = () => {
  const { user: authUser } = useAuthStateContext();

  /*
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await getAllUser();
    setUsers(res.data);
  };

  useEffect(() => {
    if (canRead) {
      fetchUsers();
    }
  }, [canRead]);
  */

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const queryParams = {
    q: search,
    _page: page,
    _limit: limit,
    _sort: sortBy,
    _order: sortOrder,
  };

  const {
    data: result = { data: [], total: 0 },
    isLoading,
    isError,
  } = useUser(queryParams);

  const {
    data: allResult = { data: [], total: 0 },
  } = useUser();

  const users = result.data;
  const allUsers = allResult.data;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const { mutate: storeUserMutation } = useStoreUser();
  const { mutate: updateUserMutation } = useUpdateUser();
  const { mutate: deleteUserMutation } = useDeleteUser();

  const [form, setForm] = useState(initialForm);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const isEdit = selectedUser !== null;

  const canRead = authUser?.permission?.includes("user.read");
  const canCreate = authUser?.permission?.includes("user.create");
  const canUpdate = authUser?.permission?.includes("user.update");
  const canDelete = authUser?.permission?.includes("user.delete");

  const openAddModal = () => {
    setSelectedUser(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedUser(item);

    setForm({
      id: item.id,
      name: item.name || "",
      email: item.email || "",
      password: item.password || "",
      role: item.role || "mahasiswa",
      permission: item.permission || [],
      dosenId: item.dosenId || "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setForm(initialForm);
    setModalOpen(false);
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;

    setForm((prev) => ({
      ...prev,
      role,
      permission: roleTemplates[role] || [],
    }));
  };

  const handlePermissionChange = (permissionKey) => {
    setForm((prev) => {
      const exists = prev.permission.includes(permissionKey);

      return {
        ...prev,
        permission: exists
          ? prev.permission.filter((item) => item !== permissionKey)
          : [...prev.permission, permissionKey],
      };
    });
  };

  const handleSelectAllGroup = (permissions) => {
    const keys = permissions.map((item) => item.key);

    setForm((prev) => {
      const allSelected = keys.every((key) =>
        prev.permission.includes(key)
      );

      if (allSelected) {
        return {
          ...prev,
          permission: prev.permission.filter(
            (item) => !keys.includes(item)
          ),
        };
      }

      return {
        ...prev,
        permission: Array.from(
          new Set([...prev.permission, ...keys])
        ),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      permission: form.permission,
    };

    if (form.role === "dosen" && form.dosenId) {
      payload.dosenId = Number(form.dosenId);
    }

    if (isEdit) {
      if (!canUpdate) {
        toastError("Anda tidak memiliki izin untuk mengupdate user.");
        return;
      }

      const emailExists = allUsers.some(
        (item) =>
          item.email === payload.email &&
          item.id !== form.id
      );

      if (emailExists) {
        toastError("Email sudah terdaftar.");
        return;
      }

      const resultConfirm = await confirmDialog({
        title: "Konfirmasi Update",
        text: `Yakin ingin menyimpan perubahan user "${payload.name}"?`,
        confirmText: "Ya, Update",
      });

      if (!resultConfirm.isConfirmed) return;

      /*
      await updateUser(form.id, payload);
      await fetchUsers();
      */

      updateUserMutation(
        {
          id: form.id,
          data: {
            ...selectedUser,
            ...payload,
          },
        },
        {
          onSuccess: () => {
            closeModal();
          },
        }
      );

      return;
    }

    if (!canCreate) {
      toastError("Anda tidak memiliki izin untuk menambah user.");
      return;
    }

    const emailExists = allUsers.some(
      (item) => item.email === payload.email
    );

    if (emailExists) {
      toastError("Email sudah terdaftar.");
      return;
    }

    const resultConfirm = await confirmDialog({
      title: "Konfirmasi Tambah",
      text: `Yakin ingin menambahkan user "${payload.name}"?`,
      confirmText: "Ya, Simpan",
    });

    if (!resultConfirm.isConfirmed) return;

    /*
    await storeUser(payload);
    await fetchUsers();
    */

    storeUserMutation(payload, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      toastError("Anda tidak memiliki izin untuk menghapus user.");
      return;
    }

    if (id === authUser.id) {
      toastError("User yang sedang login tidak boleh dihapus.");
      return;
    }

    const target = allUsers.find((item) => item.id === id);
    if (!target) return;

    const resultConfirm = await confirmDelete({
      title: "Hapus User?",
      text: `User "${target.name}" akan dihapus permanen.`,
    });

    if (!resultConfirm.isConfirmed) {
      toastError("Penghapusan dibatalkan.");
      return;
    }

    /*
    await deleteUser(id);
    await fetchUsers();
    */

    deleteUserMutation(id);
  };

  if (!canRead) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Akses Ditolak
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Anda tidak memiliki izin untuk melihat data user.
        </p>
      </div>
    );
  }

  if (isLoading && users.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Memuat data user...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-red-500">
          Gagal memuat data user.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Manajemen User
          </h2>
        </div>

        {canCreate && (
          <button
            onClick={openAddModal}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            + Tambah User
          </button>
        )}
      </div>

      <TablePagination
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalCount={totalCount}
        placeholder="Cari nama, email, atau role..."
        sortOptions={[
          { value: "name", label: "Sort by Nama" },
          { value: "email", label: "Sort by Email" },
          { value: "role", label: "Sort by Role" },
        ]}
      />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-5 py-4 text-left font-bold">Nama</th>
              <th className="px-5 py-4 text-left font-bold">Email</th>
              <th className="px-5 py-4 text-center font-bold">Role</th>
              <th className="px-5 py-4 text-center font-bold">
                Permission
              </th>
              <th className="px-5 py-4 text-center font-bold">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.length > 0 ? (
              users.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white transition hover:bg-blue-50/60"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-bold text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        User Sistem
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {item.email}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-bold ${
                        item.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : item.role === "dosen"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.role}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                      {item.permission?.length || 0}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">
                      {canUpdate && (
                        <button
                          onClick={() => openEditModal(item)}
                          className="rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700 transition hover:bg-yellow-200"
                        >
                          Edit
                        </button>
                      )}

                      {canDelete && item.id !== authUser.id && (
                        <button
                          onClick={() => handleDelete(item.id)}
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
                <td colSpan="5" className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <span className="text-2xl text-gray-400">!</span>
                    </div>
                    <p className="font-semibold text-gray-500">
                      Belum ada data user.
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Tambahkan user atau ubah kata kunci pencarian.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-7 shadow-xl">
            <h3 className="mb-5 text-xl font-bold text-gray-900">
              {isEdit ? "Edit User" : "Tambah User"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Nama
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <input
                    type="text"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={handleRoleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="admin">Admin</option>
                    <option value="dosen">Dosen</option>
                    <option value="mahasiswa">Mahasiswa</option>
                  </select>
                </div>
              </div>

              {form.role === "dosen" && (
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Dosen ID
                  </label>
                  <input
                    type="number"
                    value={form.dosenId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        dosenId: e.target.value,
                      }))
                    }
                    placeholder="Isi jika user ini terhubung ke data dosen"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              )}

              <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900">
                    Daftar Permission
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Pilih hak akses sesuai kebutuhan role pengguna.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {permissionOptions.map((group) => (
                    <div
                      key={group.group}
                      className="rounded-2xl border border-gray-200 bg-white p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h5 className="font-bold text-gray-800">
                          {group.group}
                        </h5>

                        <button
                          type="button"
                          onClick={() =>
                            handleSelectAllGroup(group.permissions)
                          }
                          className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-200"
                        >
                          Pilih/Batal
                        </button>
                      </div>

                      <div className="space-y-2">
                        {group.permissions.map((permission) => (
                          <label
                            key={permission.key}
                            className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-gray-700 transition hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={form.permission.includes(
                                permission.key
                              )}
                              onChange={() =>
                                handlePermissionChange(permission.key)
                              }
                            />
                            <span>{permission.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  {isEdit ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;