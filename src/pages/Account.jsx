// pages/Account.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Account() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchTransactions();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Summary
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Account</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {/* 👤 USER CARD */}
        {user && (
          <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">

            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-500 text-sm">@{user.username}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Income</p>
            <h2 className="text-green-500 text-xl font-bold">
              ₹{income}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Expense</p>
            <h2 className="text-red-500 text-xl font-bold">
              ₹{expense}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Balance</p>
            <h2 className="text-blue-500 text-xl font-bold">
              ₹{balance}
            </h2>
          </div>

        </div>

        {/* Info Box */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Account Info</h2>
          <p className="text-sm text-gray-600">
            Track your financial activity and monitor your habits with insights.
          </p>
        </div>

      </div>
    </div>
  );
}