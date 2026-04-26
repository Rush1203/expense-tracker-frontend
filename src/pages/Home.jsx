import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">

      {/* TOP NAV */}
      <div className="flex justify-between items-center px-6 md:px-10 py-5">
        <h1 className="text-xl font-bold text-slate-800">
          💰 FinTrack
        </h1>

        {user ? (
          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-lg shadow hover:shadow-md transition"
          >
            Dashboard
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-slate-600 hover:text-slate-900 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:shadow-md transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* HERO */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-6 relative">

        {/* BACKGROUND GLOW */}
        <div className="absolute w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl top-10 -z-10"></div>

        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-slate-800">
          Manage Your Money <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Like a Pro 💰
          </span>
        </h2>

        <p className="text-slate-600 mb-8 max-w-2xl text-lg">
          Track expenses, analyze spending patterns, and gain AI-powered insights
          to make smarter financial decisions effortlessly.
        </p>

        {/* CTA */}
        {user ? (
          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            to="/register"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
          >
            Get Started Free
          </Link>
        )}

        {/* FEATURES (subtle highlight) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="bg-white/70 backdrop-blur-md p-5 rounded-xl shadow-sm border">
            📊 <p className="font-semibold mt-2">Smart Analytics</p>
            <p className="text-sm text-gray-500">Visualize spending trends</p>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-5 rounded-xl shadow-sm border">
            🤖 <p className="font-semibold mt-2">AI Insights</p>
            <p className="text-sm text-gray-500">Understand your habits</p>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-5 rounded-xl shadow-sm border">
            🔐 <p className="font-semibold mt-2">Secure Data</p>
            <p className="text-sm text-gray-500">Your data stays private</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-center py-5 text-gray-500 text-sm">
        © {new Date().getFullYear()} FinTrack. All rights reserved.
      </footer>
    </div>
  );
}