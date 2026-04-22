import api from "./apiClient";

export const getContributors = async () => {
  const { data } = await api.get("/contributors");
  return data;
};
