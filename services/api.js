// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // Nova porta do servidor backend
});

export default api;
