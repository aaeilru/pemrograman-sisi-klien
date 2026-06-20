import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";

const Header = ({ onLogout }) => {
  const { user } = useAuthStateContext();

  const panelTitle =
    user?.role === "admin"
      ? "Admin Panel"
      : user?.role === "dosen"
      ? "Dosen Panel"
      : user?.role === "mahasiswa"
      ? "Mahasiswa Panel"
      : "Panel";

  const displayName =
    user?.name ||
    (user?.role === "admin"
      ? "Administrator"
      : user?.role === "dosen"
      ? "Dosen"
      : user?.role === "mahasiswa"
      ? "Mahasiswa"
      : "User");

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">
        {panelTitle}
      </h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">
          {displayName}
        </span>

        <button
          onClick={onLogout}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;