import axios from "../AxiosInstance";

export const getAllMataKuliah = (params = {}) =>
  axios.get("/mataKuliah", { params });

export const getMataKuliah = (id) =>
  axios.get(`/mataKuliah/${id}`);

export const storeMataKuliah = (data) =>
  axios.post("/mataKuliah", data);

export const updateMataKuliah = (id, data) =>
  axios.put(`/mataKuliah/${id}`, data);

export const deleteMataKuliah = (id) =>
  axios.delete(`/mataKuliah/${id}`);