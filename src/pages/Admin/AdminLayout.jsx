import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Header  from "./Components/Header";
import Footer  from "./Components/Footer";
import { confirmDialog } from "../../Utils/Helpers/SwalHelpers";
import { toastSuccess }  from "../../Utils/Helpers/ToastHelpers";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await confirmDialog({
      title:       "Konfirmasi Logout",
      text:        "Apakah Anda yakin ingin keluar?",
      confirmText: "Ya, Logout",
      icon:        "question",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("authUser");
      toastSuccess("Berhasil logout. Sampai jumpa!");
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header onLogout={handleLogout} />
        <main className="flex-1 p-6 overflow-x-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;