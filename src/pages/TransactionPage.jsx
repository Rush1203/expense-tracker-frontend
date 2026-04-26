import TransactionList from "../components/TransactionList";
import { useEffect, useState } from "react";
import API from "../api/axios";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await API.get("/transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Transactions</h1>
      <TransactionList
        transactions={transactions}
        refresh={fetchTransactions}
      />
    </div>
  );
}