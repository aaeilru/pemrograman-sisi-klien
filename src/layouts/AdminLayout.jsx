import Sidebar from "../components/organisms/Sidebar.jsx";
import Header from "../components/organisms/Header.jsx";
import Footer from "../components/organisms/Footer.jsx";

const AdminLayout = ({ title = "Admin", children, onToggleProfile }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header title={title} onToggleProfile={onToggleProfile} />
        <main className="flex-1 p-6 overflow-x-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;