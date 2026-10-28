
import api from "./api";

async function getLocations() {
  const response = await api.get("/locations");
  return response.data;
}

async function createLocation(locationData) {
  const response = await api.post("/locations", locationData);
  return response.data;
}

async function deleteLocation(locationId) {
  const response = await api.delete(`/locations/${locationId}`);
  return response.data;
}

export { getLocations, createLocation, deleteLocation };
