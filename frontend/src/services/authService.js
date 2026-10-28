
import api from "./api";

async function loginAdmin(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

function logoutAdmin() {
  localStorage.removeItem("adminToken");
}

export { loginAdmin, logoutAdmin };
