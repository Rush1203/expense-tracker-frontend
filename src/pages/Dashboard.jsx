import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Summary from "../components/Summary";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [range, setRange] = useState("all");

  const [showModal, setShowModal] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.transactions || [];

      setTransactions(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      setTransactions([]);
      setFiltered([]);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let data = [...transactions];

    if (search) {
      data = data.filter((t) =>
        t.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      data = data.filter((t) => t.type === typeFilter);
    }

    if (range !== "all") {
      const days = Number(range);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      data = data.filter((t) => new Date(t.date) >= cutoff);
    }

    setFiltered(data);
  }, [search, typeFilter, range, transactions]);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setRange("all");
  };

  // ===== CALCULATIONS (UNCHANGED) =====
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const grouped = {};
  filtered.forEach((t) => {
    const date = new Date(t.date).toLocaleDateString();
    if (!grouped[date]) {
      grouped[date] = { date, income: 0, expense: 0 };
    }
    grouped[date][t.type] += t.amount;
  });

  const lineData = Object.values(grouped);

  const categoryMap = {};
  filtered.forEach((t) => {
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

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

  filtered.forEach((t) => {
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
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold"
      >
        Dashboard
      </motion.h1>

      {/* SUMMARY */}
      <Summary transactions={filtered} />

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search category..."
          className="border px-3 py-2 rounded-lg flex-1 min-w-[180px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="30">Last 30 days</option>
          <option value="60">Last 60 days</option>
        </select>

        <button
          onClick={resetFilters}
          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
        >
          Reset
        </button>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm font-semibold mb-2">Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} dataKey="value">
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm font-semibold mb-2">Daily</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="income" stroke="#22c55e" />
              <Line dataKey="expense" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm font-semibold mb-2">Category</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} dataKey="value">
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={`hsl(${i * 60},70%,50%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-sm font-semibold mb-2">Monthly</h2>
          <ResponsiveContainer width="100%" height={180}>
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

      {/* LIST */}
      <TransactionList
        transactions={filtered}
        refresh={fetchTransactions}
      />

      {/* FLOAT BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full text-3xl shadow-xl"
      >
        +
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <div className="flex justify-between mb-4">
              <h2>Add Transaction</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <TransactionForm
              refresh={() => {
                fetchTransactions();
                setShowModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}