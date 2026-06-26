import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { confirmDialog } from "../../Utils/Helpers/SwalHelpers";
import { toastSuccess } from "../../Utils/Helpers/ToastHelpers";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await confirmDialog({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar?",
      confirmText: "Ya, Logout",
      icon: "question",
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

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30">
          <Header onLogout={handleLogout} />
        </div>

        <main className="flex-1 overflow-x-hidden p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;