import axios from "../AxiosInstance";

export const getAllKelas = (params = {}) =>
  axios.get("/kelas", { params });

export const getKelas = (id) => axios.get(`/kelas/${id}`);

export const storeKelas = (data) => axios.post("/kelas", data);

export const updateKelas = (id, data) =>
  axios.put(`/kelas/${id}`, data);

export const deleteKelas = (id) =>
  axios.delete(`/kelas/${id}`);