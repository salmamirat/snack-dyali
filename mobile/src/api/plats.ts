import api from "./axios";

export const getPlats = async () => {
  const response = await api.get("/plats");
  return response.data;
};

export const createPlat = async (plat: any) => {
  const response = await api.post("/plats", plat);
  return response.data;
};

export const updatePlat = async (id: number, plat: any) => {
  const response = await api.put(`/plats/${id}`, plat);
  return response.data;
};

export const deletePlat = async (id: number) => {
  await api.delete(`/plats/${id}`);
};