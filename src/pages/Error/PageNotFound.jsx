import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
      <p className="mb-4">Halaman tidak ditemukan.</p>
      <Link to="/" className="text-blue-600 underline">
        Kembali ke Login
      </Link>
    </div>
  );
};

export default PageNotFound;