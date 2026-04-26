import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await login(form);

    setLoading(false);

    if (res.success) {
      navigate("/");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-blue-300/30 rounded-full blur-3xl -top-10 -z-10"></div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-2xl shadow-xl"
      >
        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-slate-500 mb-6 text-sm">
          Login to continue managing your expenses
        </p>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center bg-red-50 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-5">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition duration-200 disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-sm mt-6 text-center text-slate-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}