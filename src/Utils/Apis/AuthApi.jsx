import axios from "../AxiosInstance";

export const login = async (email, password) => {
  const res = await axios.get("/user", {
    params: {
      email,
    },
  });

  const user = res.data[0];

  if (!user) {
    throw new Error("Email tidak ditemukan");
  }

  if (user.password !== password) {
    throw new Error("Password salah");
  }

  return user;
};

export const register = async (data) => {
  const checkEmail = await axios.get("/user", {
    params: {
      email: data.email,
    },
  });

  if (checkEmail.data.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    role: "mahasiswa",
    permission: [
      "dashboard.page",
      "matakuliah.page",
      "matakuliah.read"
    ],
  };

  const res = await axios.post("/user", payload);

  return res.data;
};