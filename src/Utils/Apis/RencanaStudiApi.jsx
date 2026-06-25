import axios from "../AxiosInstance";

export const getAllRencanaStudi = () =>
  axios.get("/rencanaStudi");

export const getRencanaStudi = (id) =>
  axios.get(`/rencanaStudi/${id}`);

export const storeRencanaStudi = (data) =>
  axios.post("/rencanaStudi", data);

export const updateRencanaStudi = (id, data) =>
  axios.put(`/rencanaStudi/${id}`, data);

export const deleteRencanaStudi = (id) =>
  axios.delete(`/rencanaStudi/${id}`);