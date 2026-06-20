import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../../Utils/Apis/AuthApi";
import { toastSuccess, toastError } from "../../../Utils/Helpers/ToastHelpers";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      toastError("Konfirmasi password tidak sama.");
      return;
    }

    try {
      await register(form);

      toastSuccess("Registrasi berhasil. Silakan login.");
      navigate("/");
    } catch (err) {
      setError(err.message);
      toastError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
        Register
      </h2>

      <form className="space-y-4" onSubmit={handleRegister}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Masukkan nama"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="Masukkan email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            placeholder="Masukkan password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Konfirmasi Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Ulangi password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-4">
        Sudah punya akun?{" "}
        <Link to="/" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;