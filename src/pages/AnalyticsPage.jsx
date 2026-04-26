import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    };
    fetch();
  }, []);

  // ===== INCOME VS EXPENSE =====
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  // ===== CATEGORY BREAKDOWN =====
  const categoryMap = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      categoryMap[t.category] += t.amount;
    }
  });

  const categoryData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  // ===== TOP 3 =====
  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // ===== MONTHLY =====
  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const last12Months = [];
  const today = new Date();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

    last12Months.push({
      key,
      month: key,
      income: 0,
      expense: 0,
    });
  }

  transactions.forEach((t) => {
    const date = new Date(t.date);
    const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    const monthObj = last12Months.find((m) => m.key === key);
    if (monthObj) {
      monthObj[t.type] += t.amount;
    }
  });

  const monthlyData = last12Months;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl md:text-3xl font-bold">
        Analytics
      </h1>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Income</p>
          <h2 className="text-xl font-bold text-green-600">₹{income}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Expense</p>
          <h2 className="text-xl font-bold text-red-500">₹{expense}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Net Balance</p>
          <h2 className="text-xl font-bold">
            ₹{income - expense}
          </h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* INCOME VS EXPENSE */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value">
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* CATEGORY */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Expense by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" label>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={`hsl(${i * 60},70%,50%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* MONTHLY */}
        <div className="bg-white p-5 rounded-xl shadow md:col-span-2">
          <h2 className="font-semibold mb-3">Monthly Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#22c55e" />
              <Bar dataKey="expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP CATEGORIES */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Top Spending Categories</h2>

        {topCategories.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No data available
          </p>
        ) : (
          <ul className="space-y-2">
            {topCategories.map(([cat, amt], i) => (
              <li
                key={i}
                className="flex justify-between bg-gray-50 px-3 py-2 rounded-lg"
              >
                <span>{i + 1}. {cat}</span>
                <span className="font-semibold text-red-500">
                  ₹{amt}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}