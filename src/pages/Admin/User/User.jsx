import { useState } from "react";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { toastError } from "../../../Utils/Helpers/ToastHelpers";
import {
  confirmDelete,
  confirmDialog,
} from "../../../Utils/Helpers/SwalHelpers";
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

  const {
    data: users = [],
    isLoading,
    isError,
  } = useUser();

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

      const emailExists = users.some(
        (item) =>
          item.email === payload.email &&
          item.id !== form.id
      );

      if (emailExists) {
        toastError("Email sudah terdaftar.");
        return;
      }

      const result = await confirmDialog({
        title: "Konfirmasi Update",
        text: `Yakin ingin menyimpan perubahan user "${payload.name}"?`,
        confirmText: "Ya, Update",
      });

      if (!result.isConfirmed) return;

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

    const emailExists = users.some(
      (item) => item.email === payload.email
    );

    if (emailExists) {
      toastError("Email sudah terdaftar.");
      return;
    }

    const result = await confirmDialog({
      title: "Konfirmasi Tambah",
      text: `Yakin ingin menambahkan user "${payload.name}"?`,
      confirmText: "Ya, Simpan",
    });

    if (!result.isConfirmed) return;

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

    const target = users.find((item) => item.id === id);
    if (!target) return;

    const result = await confirmDelete({
      title: "Hapus User?",
      text: `User "${target.name}" akan dihapus permanen.`,
    });

    if (!result.isConfirmed) {
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
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800">
          Akses Ditolak
        </h2>
        <p className="text-gray-500 mt-2">
          Anda tidak memiliki izin untuk melihat data user.
        </p>
      </div>
    );
  }

  if (isLoading && users.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">
          Memuat data user...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-red-500">
          Gagal memuat data user.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800">
          Manajemen User
        </h2>

        {canCreate && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Tambah User
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700 border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nama</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-center">Role</th>
              <th className="py-3 px-4 text-center">
                Jumlah Permission
              </th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4 font-medium">
                    {item.name}
                  </td>

                  <td className="py-3 px-4">
                    {item.email}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-sm font-bold ${
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

                  <td className="py-3 px-4 text-center">
                    {item.permission?.length || 0}
                  </td>

                  <td className="py-3 px-4 text-center space-x-2">
                    {canUpdate && (
                      <button
                        onClick={() => openEditModal(item)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && item.id !== authUser.id && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-6 text-center text-gray-400 italic"
                >
                  Belum ada data user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {isEdit ? "Edit User" : "Tambah User"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={handleRoleChange}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="admin">Admin</option>
                    <option value="dosen">Dosen</option>
                    <option value="mahasiswa">Mahasiswa</option>
                  </select>
                </div>
              </div>

              {form.role === "dosen" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              )}

              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-bold text-gray-800 mb-3">
                  Daftar Permission
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {permissionOptions.map((group) => (
                    <div
                      key={group.group}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-gray-700">
                          {group.group}
                        </h5>

                        <button
                          type="button"
                          onClick={() =>
                            handleSelectAllGroup(group.permissions)
                          }
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Pilih/Batal
                        </button>
                      </div>

                      <div className="space-y-2">
                        {group.permissions.map((permission) => (
                          <label
                            key={permission.key}
                            className="flex items-center gap-2 text-sm text-gray-700"
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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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