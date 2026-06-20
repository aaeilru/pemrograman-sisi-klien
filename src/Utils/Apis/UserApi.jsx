import axios from "../AxiosInstance";

export const getAllUser = (params = {}) =>
  axios.get("/user", { params });

export const getUser = (id) => axios.get(`/user/${id}`);

export const storeUser = (data) => axios.post("/user", data);

export const updateUser = (id, data) =>
  axios.put(`/user/${id}`, data);

export const deleteUser = (id) =>
  axios.delete(`/user/${id}`);

export const getUserByEmail = async (email) => {
  const res = await axios.get("/user", { params: { email } });
  return res.data[0];
};

export const getUserByDosenId = async (dosenId) => {
  const res = await axios.get("/user", { params: { dosenId } });
  return res.data[0];
};