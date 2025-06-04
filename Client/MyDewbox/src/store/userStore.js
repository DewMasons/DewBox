import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isSignedIn: false,
  users: {},
  setIsSignedIn: (status) => set({ isSignedIn: status }),
  fetchUsers: async () => {
    try {
      const response = await axios.get("/api/users");
      set({ users: response.data });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  },
  clearAuth: () => set({ isSignedIn: false, users: {} }),
}));