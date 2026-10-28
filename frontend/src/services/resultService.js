
import api from "./api";

async function getCurrentResults() {
  const response = await api.get("/results/current");
  return response.data;
}

async function getResultHistory(params = {}) {
  const response = await api.get("/results/history", { params });
  return response.data;
}

async function getMonthlyStats(year) {
  const response = await api.get("/stats/monthly", {
    params: { year },
  });
  return response.data;
}

async function createResult(resultData) {
  const response = await api.post("/results", resultData);
  return response.data;
}

async function deleteResult(resultId) {
  const response = await api.delete(`/results/${resultId}`);
  return response.data;
}

export {
  getCurrentResults,
  getResultHistory,
  getMonthlyStats,
  createResult,
  deleteResult,
};
