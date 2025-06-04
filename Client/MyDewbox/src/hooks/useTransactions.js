import api from "../config/api";

export const fetchTransactions = async () => {
  const response = await api.get("/users/transactions");
  // Always return an array, even if response.data is not an array
  return Array.isArray(response.data) ? response.data : [];
};
