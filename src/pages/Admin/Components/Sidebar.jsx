import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuthStateContext();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      permission: "dashboard.page",
    },
    {
      label: "Mahasiswa",
      path: "/admin/mahasiswa",
      permission: "mahasiswa.page",
    },
    {
      label: "Dosen",
      path: "/admin/dosen",
      permission: "dosen.page",
    },
    {
      label: user?.role === "mahasiswa" ? "KRS" : "Mata Kuliah",
      path: "/admin/mata-kuliah",
      permission: "matakuliah.page",
    },
    {
      label: "User",
      path: "/admin/user",
      permission: "user.page",
    },
    {
      label: "Kelas",
      path: "/admin/kelas",
      permission: "kelas.page",
    },
  ];

  const filteredMenus = menuItems.filter((item) =>
    user?.permission?.includes(item.permission)
  );

  const roleLabel =
    user?.role === "admin"
      ? "Administrator"
      : user?.role === "dosen"
      ? "Dosen"
      : user?.role === "mahasiswa"
      ? "Mahasiswa"
      : "User";

  return (
    <aside className="w-64 min-h-screen bg-blue-800 text-white flex flex-col shrink-0 shadow-xl">
      <div className="px-6 py-6 border-b border-blue-700">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-wide">
            Admin
          </h1>
          <p className="text-xs text-blue-200 mt-1">
            Academic Management
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-5 space-y-2">
        {filteredMenus.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-blue-100 hover:bg-blue-700 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-white rounded-r-full" />
                )}

                <span className="pl-3">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-5">
        <div className="rounded-xl bg-blue-700 border border-blue-600 px-4 py-3">
          <p className="text-sm font-semibold truncate">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-blue-200 mt-1">
            {roleLabel}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;