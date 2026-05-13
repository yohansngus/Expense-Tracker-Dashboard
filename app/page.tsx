"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
export default function Home() {
  const COLORS = [
    "#635bff",
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];
  type Expense = {
    id: number;
    expense: string;
    amount: number;
  };
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!expense || !amount) return;

    const newExpense: Expense = {
      id: Date.now(),
      expense,
      amount: Number(amount),
    };

    setExpenses([...expenses, newExpense]);

    setExpense("");
    setAmount("");
  };

  // getting data from local storage

  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // setting data to local storage

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const pieData = expenses.map((item) => ({
    expense: item.expense,
    amount: item.amount,
  }));

  const lineData = expenses.map((item, index) => ({
    month: item.expense,
    amount: item.amount,
  }));

  const highestExpense = expenses.reduce(
    (max, item) => (item.amount > max.amount ? item : max),
    { expense: "", amount: 0 },
  );

  const totalSpending = expenses.reduce(
    (initial, currentExpense) => initial + currentExpense.amount,
    0,
  );

  return (
    <div className="font-sans bg-white pb-10">
      {/*Nav bar*/}
      <div className="flex navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <h1 className="flex m-5 h-20 w-30 text-center items-center justify-center rounded-lg bg-black text-white font-bold shadow-md">
            Expense Tracker
          </h1>
        </div>
        <div className="flex flex-row gap-2 h-15 m-5">
          <div className="w-15 rounded-2xl border-4 border-gray-500">
            <img
              className="rounded-xl"
              alt="user profile picture"
              src="/assets/newup.jpg"
            />
          </div>
        </div>
      </div>
      {/*Main content*/}
      <main className="flex flex-col w-full flex-col p-6">
        <div className="max-w-md mx-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Expense name"
              value={expense}
              onChange={(e) => setExpense(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded text-gray-500"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded text-gray-500"
            />

            <button
              type="submit"
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer"
            >
              Add Expense
            </button>
          </form>
          <div className="mt-6">
            {expenses.map((item) => (
              <div key={item.id} className="flex justify-between border-b py-2">
                <span className="text-gray-500">{item.expense}</span>

                <div className="flex items-center gap-3">
                  <span className="text-gray-500">${item.amount}</span>

                  <button
                    onClick={() =>
                      setExpenses(expenses.filter((exp) => exp.id !== item.id))
                    }
                    className="text-red-500 font-bold cursor-pointer"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/*cards section*/}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Spending</p>

            <h2 className="text-3xl text-gray-400 font-bold mt-2">
              ${totalSpending}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            {" "}
            <p className="text-gray-500 text-sm">Highest expense</p>{" "}
            <h2 className="text-2xl text-gray-400 font-bold mt-2">
              {highestExpense.expense || "No expenses"}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Monthly Growth</p>

            <h2 className="text-2xl font-bold mt-2 text-green-500">+12%</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {" "}
          <div className="w-full h-[400px] bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg text-gray-300 font-semibold mb-4 pl-2">
              Monthly Spending Trend
            </h2>
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineData}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 5,
                    left: 0,
                  }}
                >
                  <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#635bff"
                    strokeWidth={3}
                    name="Expense"
                  />
                  <XAxis tick={{ fill: "#00000086" }} dataKey="month" />

                  <YAxis tick={{ fill: "#00000062" }} width="auto" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      color: "rgba(0, 0, 0, 0.66)",
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No data available
              </div>
            )}
          </div>
          <div className="flex justify-center border-2 border-gray-300 rounded-xl h-[400px]">
            <h2 className="text-gray-300 text-lg font-semibold mb-4 pl-2">
              Expense Categories
            </h2>
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="amount"
                    nameKey="expense"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                      background: "black",
                    }}
                  />
                  <Legend align="left" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No expenses yet
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
