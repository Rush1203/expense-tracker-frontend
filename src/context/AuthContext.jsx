// context/AuthContext.jsx
import { createContext, useState } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Safe init (fixes your error)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
    } catch {
      return null;
    }
  });

  // 🔐 LOGIN
  const login = async (data) => {
    try {
      const res = await API.post("/auth/login", data);

      const token = res.data.token;

      // ✅ supports both formats
      const user = res.data.user ? res.data.user : res.data;

      setUser(user);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // 📝 REGISTER
  const register = async (data) => {
    try {
      const res = await API.post("/auth/register", data);

      const token = res.data.token;
      const user = res.data.user ? res.data.user : res.data;

      setUser(user);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Register failed",
      };
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// import { createContext, useState } from "react";
// import API from "../api/axios";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user"))
//   );

//   const login = async (data) => {
//     const res = await API.post("/auth/login", data);
//     setUser(res.data);
//     localStorage.setItem("user", JSON.stringify(res.data));
//   };

//   const register = async (data) => {
//     const res = await API.post("/auth/register", data);
//     setUser(res.data);
//     localStorage.setItem("user", JSON.stringify(res.data));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
