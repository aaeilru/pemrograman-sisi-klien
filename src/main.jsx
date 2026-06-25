import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AuthProvider } from "./Utils/Contexts/AuthContext";
import { Toaster } from "react-hot-toast";

import "./App.css";

import AuthLayout from "./pages/Auth/AuthLayout";
import AdminLayout from "./pages/Admin/AdminLayout";
import ProtectedRoute from "./pages/Admin/Components/ProtectedRoute";
import Login from "./pages/Auth/Login/Login";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Mahasiswa from "./pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "./pages/Admin/MahasiswaDetail/MahasiswaDetail";
import PageNotFound from "./pages/Error/PageNotFound";
import Register from "./pages/Auth/Register/Register";
import Dosen from "./pages/Admin/Dosen/Dosen";
import MataKuliah from "./pages/Admin/MataKuliah/MataKuliah";
import User from "./pages/Admin/User/User";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Kelas from "./pages/Admin/Kelas/Kelas";
import RencanaStudi from "./pages/Admin/RencanaStudi/RencanaStudi";
import JadwalKuliah from "./pages/Admin/JadwalKuliah/JadwalKuliah";



const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "mahasiswa",
        children: [
          { index: true, element: <Mahasiswa /> },
          { path: ":id", element: <MahasiswaDetail /> },
        ],
      },
      { path: "dosen", element: <Dosen /> },
      { path: "mata-kuliah", element: <MataKuliah /> },
      { path: "user", element: <User /> },
      { path: "kelas", element: <Kelas /> },
      { path: "rencana-studi", element: <RencanaStudi /> },
      { path: "jadwal-kuliah", element: <JadwalKuliah /> },
    ],
  },
  { path: "*", element: <PageNotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster
        position="top-right"
        containerStyle={{ zIndex: 9999 }}
        toastOptions={{
          duration: 5000,
          style: {
            fontSize: "14px",
            fontWeight: "500",
          },
        }}
      />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);