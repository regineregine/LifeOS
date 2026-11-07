import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
};

function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("lifeos-transactions");

    if (saved) {
      try {
        return JSON.parse(saved) as Transaction[];
      } catch {
        console.error("Could not load transactions.");
      }
    }

    return [];
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Other");

  useEffect(() => {
    localStorage.setItem(
      "lifeos-transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = totalIncome - totalExpenses;

  const addTransaction = () => {
    const parsedAmount = Number(amount);

    if (!title.trim() || !amount || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      date: new Date().toISOString().split("T")[0],
    };

    setTransactions((previous) => [...previous, newTransaction]);

    setTitle("");
    setAmount("");
    setCategory("Other");
  };

  const deleteTransaction = (id: number) => {
    setTransactions((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const money = (value: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">My Finance</h2>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Manage your income, expenses, and balance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div
          className="border rounded-2xl p-5"
          style={{ borderColor: "var(--border-color)" }}
        >
          <TrendingUp size={22} />
          <p className="text-sm mt-3" style={{ color: "var(--text-secondary)" }}>
            Total Income
          </p>
          <h3 className="text-2xl font-semibold mt-1">
            {money(totalIncome)}
          </h3>
        </div>

        <div
          className="border rounded-2xl p-5"
          style={{ borderColor: "var(--border-color)" }}
        >
          <TrendingDown size={22} />
          <p className="text-sm mt-3" style={{ color: "var(--text-secondary)" }}>
            Total Expenses
          </p>
          <h3 className="text-2xl font-semibold mt-1">
            {money(totalExpenses)}
          </h3>
        </div>

        <div
          className="border rounded-2xl p-5"
          style={{ borderColor: "var(--border-color)" }}
        >
          <Wallet size={22} />
          <p className="text-sm mt-3" style={{ color: "var(--text-secondary)" }}>
            Remaining Balance
          </p>
          <h3 className="text-2xl font-semibold mt-1">
            {money(balance)}
          </h3>
        </div>
      </div>

      {/* Add Transaction */}
      <div
        className="border rounded-2xl p-5 mb-8"
        style={{ borderColor: "var(--border-color)" }}
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Plus size={18} />
          Add Transaction
        </h3>

        <div className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Transaction name..."
            className="border rounded-xl px-4 py-3 outline-none"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in PHP..."
            className="border rounded-xl px-4 py-3 outline-none"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "income" | "expense")
            }
            className="border rounded-xl px-4 py-3"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-xl px-4 py-3"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <option>Other</option>
            <option>Food</option>
            <option>Transportation</option>
            <option>Education</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Salary</option>
            <option>Allowance</option>
            <option>Savings</option>
          </select>

          <button
            onClick={addTransaction}
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium"
            style={{
              background: "var(--text-primary)",
              color: "var(--bg-primary)",
            }}
          >
            <Plus size={18} />
            Save Transaction
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <PiggyBank size={20} />
          <h3 className="font-semibold">Transaction History</h3>
        </div>

        {transactions.length === 0 ? (
          <p
            className="text-center p-8 border rounded-2xl"
            style={{
              color: "var(--text-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            No transactions yet. Add your first transaction!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-4 flex items-center justify-between gap-3"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.category} · {item.date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold whitespace-nowrap">
                    {item.type === "income" ? "+" : "-"}
                    {money(item.amount)}
                  </span>

                  <button
                    onClick={() => deleteTransaction(item.id)}
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Finance;
