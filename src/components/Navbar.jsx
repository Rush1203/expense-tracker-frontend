// components/Navbar.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link to="/" className="font-bold">FinTrack</Link>

      {user ? (
        <div className="space-x-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/account">Account</Link>
          <button onClick={logout} className="text-red-500">
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <Link to="/login">Login</Link>
          <Link to="/register">Signup</Link>
        </div>
      )}
    </nav>
  );
}