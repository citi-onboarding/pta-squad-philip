import axios from "axios";

const api = axios.create({
  baseURL: "https://pta-squad-philip.onrender.com",
});

export default api;
