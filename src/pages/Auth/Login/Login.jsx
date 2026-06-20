import { useState } from "react";
import { login } from "../../../Utils/Apis/AuthApi";
import { toastSuccess, toastError } from "../../../Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "../../../Utils/Contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStateContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await login(form.email, form.password);

      setUser(user);

      toastSuccess(`Selamat datang, ${user.name}!`);

      navigate("/admin", {
        replace: true,
      });
    } catch (err) {
      toastError(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
        Login
      </h2>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Masukkan email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder="Masukkan password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <div className="flex justify-between items-center">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-gray-600">Ingat saya</span>
          </label>

          <a href="#" className="text-sm text-blue-500 hover:underline">
            Lupa password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-4">
        Belum punya akun?{" "}
      <Link to="/register" className="text-blue-500 hover:underline">
        Daftar
      </Link>
      </p>
    </div>
  );
};

export default Login;