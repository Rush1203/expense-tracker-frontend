import { useState } from "react";
import API from "../api/axios";

export default function TransactionForm({ refresh }) {
  const [form, setForm] = useState({
    category: "",
    amount: "",
    type: "expense",
    date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/transactions", {
        ...form,
        amount: Number(form.amount),
      });

      setForm({
        category: "",
        amount: "",
        type: "expense",
        date: "",
      });

      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow mb-4"
    >
      {/* Category */}
      <input
        type="text"
        placeholder="Category"
        value={form.category}
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      />

      {/* Amount */}
      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, amount: e.target.value })
        }
      />

      {/* Type */}
      <select
        value={form.type}
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, type: e.target.value })
        }
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      {/* Date */}
      <input
        type="date"
        value={form.date}
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />

      <button className="bg-green-500 text-white p-2 w-full">
        Add Transaction
      </button>
    </form>
  );
}