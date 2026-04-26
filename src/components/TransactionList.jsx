import API from "../api/axios";

export default function TransactionList({ transactions, refresh }) {
  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (transactions.length === 0) {
    return <p className="text-center">No transactions yet</p>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      {transactions.map((t) => (
        <div
          key={t._id}
          className="flex justify-between items-center border-b py-2"
        >
          {/* Left Side */}
          <div>
            {/* Category */}
            <p className="font-medium">{t.category}</p>

            {/* Date */}
            <small className="text-gray-500">
              {new Date(t.date).toLocaleDateString()}
            </small>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Amount */}
            <span
              className={
                t.type === "income"
                  ? "text-green-500 font-semibold"
                  : "text-red-500 font-semibold"
              }
            >
              {t.type === "income" ? "+" : "-"} ₹{t.amount}
            </span>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(t._id)}
              className="text-red-500 font-bold"
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}