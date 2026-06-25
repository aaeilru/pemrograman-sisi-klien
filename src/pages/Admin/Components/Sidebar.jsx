import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuthStateContext();

  const role = user?.role;
  const permissions = user?.permission || [];

  const adminMenus = [
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
      label: "Mata Kuliah",
      path: "/admin/mata-kuliah",
      permission: "matakuliah.page",
    },
    {
      label: "User",
      path: "/admin/user",
      permission: "user.page",
    },
    {
      label: "Jadwal Kuliah",
      path: "/admin/kelas",
      permission: "kelas.page",
    },
    {
      label: "Rencana Studi",
      path: "/admin/rencana-studi",
      permission: "rencana-studi.page",
    },
  ];

  const mahasiswaMenus = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      permission: "dashboard.page",
      alwaysShow: true,
    },
    {
      label: "KRS",
      path: "/admin/rencana-studi",
      permission: "rencana-studi.page",
      alwaysShow: true,
    },
    {
      label: "Jadwal Kuliah",
      path: "/admin/jadwal-kuliah",
      permission: "jadwal-kuliah.page",
      alwaysShow: true,
    },
  ];

  const dosenMenus = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      permission: "dashboard.page",
      alwaysShow: true,
    },
    {
      label: "Jadwal Mengajar",
      path: "/admin/jadwal-kuliah",
      permission: "jadwal-kuliah.page",
      alwaysShow: true,
    },
  ];

  const getMenusByRole = () => {
    if (role === "admin") return adminMenus;
    if (role === "mahasiswa") return mahasiswaMenus;
    if (role === "dosen") return dosenMenus;

    return [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        permission: "dashboard.page",
        alwaysShow: true,
      },
    ];
  };

  const filteredMenus = getMenusByRole().filter((item) => {
    if (item.alwaysShow) return true;
    return permissions.includes(item.permission);
  });

  const panelTitle =
    role === "admin"
      ? "Admin"
      : role === "mahasiswa"
      ? "Mahasiswa"
      : role === "dosen"
      ? "Dosen"
      : "User";

  const panelSubtitle =
    role === "admin"
      ? "Academic Management"
      : role === "mahasiswa"
      ? "Student Panel"
      : role === "dosen"
      ? "Lecturer Panel"
      : "Academic Panel";

  const roleLabel =
    role === "admin"
      ? "Administrator"
      : role === "mahasiswa"
      ? "Mahasiswa"
      : role === "dosen"
      ? "Dosen"
      : "User";

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-blue-800 text-white shadow-xl">
      <div className="border-b border-blue-700 px-6 py-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-wide">
            {panelTitle}
          </h1>
          <p className="mt-1 text-xs text-blue-200">
            {panelSubtitle}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-5">
        {filteredMenus.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin/dashboard"}
            className={({ isActive }) =>
              `relative flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-blue-100 hover:bg-blue-700 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-white" />
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
        <div className="rounded-xl border border-blue-600 bg-blue-700 px-4 py-3">
          <p className="truncate text-sm font-semibold">
            {user?.name || "User"}
          </p>
          <p className="mt-1 text-xs text-blue-200">
            {roleLabel}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;