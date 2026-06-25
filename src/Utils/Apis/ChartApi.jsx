import axios from "../AxiosInstance";

export const getAllChartData = () => axios.get("/chart");