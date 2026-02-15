import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,

  // ✅ LOGIN
  login: (token, user) =>
    set(() => {
      const normalizedUser = {
        ...user,
        role: user.role?.toLowerCase(),
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      return { token, user: normalizedUser };
    }),

  // ✅ LOGOUT
  logout: () =>
    set(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return { token: null, user: null };
    }),

  // ✅ INITIALIZE AUTH (optional safety)
  initializeAuth: () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);

      set({
        token: storedToken,
        user: {
          ...parsedUser,
          role: parsedUser.role?.toLowerCase(),
        },
      });
    }
  },
}));

export default useAuthStore;
