export default function Summary({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-white p-4 rounded shadow text-center">
        <p>Income</p>
        <h2 className="text-green-500">₹{income}</h2>
      </div>

      <div className="bg-white p-4 rounded shadow text-center">
        <p>Expense</p>
        <h2 className="text-red-500">₹{expense}</h2>
      </div>

      <div className="bg-white p-4 rounded shadow text-center">
        <p>Balance</p>
        <h2>₹{balance}</h2>
      </div>
    </div>
  );
}