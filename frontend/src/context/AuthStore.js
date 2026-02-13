import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: null,
  user: null,

 login: (token, user) =>
  set(() => {
    const normalizedUser = {
      ...user,
      role: user.role?.toLowerCase(), // 🔥 IMPORTANT
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    return { token, user: normalizedUser };
  }),


  initializeAuth: () => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (storedToken && storedUser) {
    const parsedUser = JSON.parse(storedUser);

    set({
      token: storedToken,
      user: {
        ...parsedUser,
        role: parsedUser.role?.toLowerCase(), // 🔥 IMPORTANT
      },
    });
  }
},

}));

export default useAuthStore;
