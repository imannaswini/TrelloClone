import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: null,
  user: null,

  login: (token, user) =>
    set(() => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return { token, user };
    }),

  logout: () =>
    set(() => {
      return { token: null, user: null };
    }),

  initializeAuth: () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      set({
        token: storedToken,
        user: storedUser ? JSON.parse(storedUser) : null,
      });
    }
  },
}));

export default useAuthStore;
