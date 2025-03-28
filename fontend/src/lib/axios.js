import axios from "axios";

export const axiosInsert = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});
