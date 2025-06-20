import React, { useState, useEffect } from "react";
import {
  FaPiggyBank,
  FaChartLine,
  FaPlus,
  FaTrashAlt,
  FaRedo,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { addThousandsSeparator } from "../../utils/helper";
import SavingsOverview from "../../components/Dashboard/SavingsOverview";

Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const cardStyle = {
  background: "rgba(255,255,255,0.72)",
  boxShadow:
    "0 8px 32px 0 rgba(109,40,217,0.13), 0 2px 16px 0 rgba(30,0,60,0.10), 0 0 0 2.5px rgba(168,85,247,0.12)",
  border: "none",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  borderRadius: "22px",
  position: "relative",
  overflow: "hidden",
  padding: "2rem",
};

const Savings = () => {
  // Savings state and logic
  const [savings, setSavings] = useState(() => {
    try {
      const stored = localStorage.getItem("savings");
      return stored !== null && !isNaN(Number(stored)) ? Number(stored) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem("savings", String(savings));
  }, [savings]);

  // --- Investment Tracking State ---
  const [investments, setInvestments] = useState(() => {
    try {
      const saved = localStorage.getItem("investments");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newInv, setNewInv] = useState({
    name: "",
    monthly: false,
    amount: "",
    interest: "",
    startDate: "",
  });
  const [invError, setInvError] = useState("");
  const [projectionMonths, setProjectionMonths] = useState(24);

  useEffect(() => {
    localStorage.setItem("investments", JSON.stringify(investments));
  }, [investments]);

  // Add investment
  const handleAddInvestment = (e) => {
    e.preventDefault();
    setInvError("");
    if (
      !newInv.name ||
      !newInv.amount ||
      !newInv.interest ||
      !newInv.startDate
    ) {
      setInvError("Please fill all fields.");
      return;
    }
    setInvestments((inv) => [...inv, { ...newInv, id: Date.now() }]);
    setNewInv({
      name: "",
      monthly: false,
      amount: "",
      interest: "",
      startDate: "",
    });
  };

  // Delete investment
  const handleDeleteInvestment = (id) => {
    setInvestments((inv) => inv.filter((i) => i.id !== id));
  };

  // --- Investment Projection Logic ---
  function getProjection(inv, months) {
    const data = [];
    let balance = 0;
    const monthlyRate = Number(inv.interest) / 100 / 12;
    for (let m = 1; m <= months; m++) {
      if (inv.monthly) balance += Number(inv.amount);
      else if (m === 1) balance += Number(inv.amount);
      balance = balance * (1 + monthlyRate);
      data.push(Math.round(balance));
    }
    return data;
  }

  const chartLabels = Array.from(
    { length: projectionMonths },
    (_, i) => `Month ${i + 1}`
  );
  const chartData = {
    labels: chartLabels,
    datasets: investments.map((inv, idx) => ({
      label: inv.name,
      data: getProjection(inv, projectionMonths),
      borderColor: ["#a855f7", "#22c55e", "#ef4444", "#facc15", "#3b82f6"][
        idx % 5
      ],
      backgroundColor: "rgba(168,85,247,0.08)",
      tension: 0.18,
      pointRadius: 2,
      fill: false,
    })),
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx) => `R${addThousandsSeparator(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) => `R${addThousandsSeparator(v)}`,
        },
      },
    },
  };

  // --- UI: match Income/Expense page layout ---
  return (
    <div className="my-5 mx-auto">
      <div className="grid grid-cols-1 gap-6">
        {/* Savings Overview Card */}
        <div style={cardStyle}>
          <SavingsOverview
            savings={savings}
            onAddSaving={(amt) =>
              setSavings((prev) => Number(prev) + Number(amt))
            }
          />
        </div>

        {/* Investment Tracking & Insights Card */}
        <div style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaChartLine className="text-2xl text-green-600" />
              <h3 className="text-lg font-bold text-green-700 tracking-tight">
                Investment Tracking & Insights
              </h3>
            </div>
            <span className="ml-auto flex items-center gap-2 text-xs">
              <label htmlFor="proj-months" className="text-gray-500">
                Months:
              </label>
              <input
                id="proj-months"
                type="number"
                min={6}
                max={120}
                value={projectionMonths}
                onChange={(e) =>
                  setProjectionMonths(
                    Math.max(6, Math.min(120, Number(e.target.value) || 24))
                  )
                }
                className="border rounded px-2 py-1 w-16 text-xs"
              />
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Add Investment Form */}
            <form
              onSubmit={handleAddInvestment}
              className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl shadow-lg p-6 flex flex-col gap-4 md:w-1/2 w-full"
              style={{ minWidth: 0 }}
            >
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  className="border border-green-300 rounded-lg px-4 py-2 text-sm flex-1 focus:ring-2 focus:ring-green-200 min-w-0"
                  type="text"
                  placeholder="Investment name"
                  value={newInv.name}
                  onChange={(e) =>
                    setNewInv((s) => ({ ...s, name: e.target.value }))
                  }
                  required
                />
                <input
                  className="border border-green-300 rounded-lg px-4 py-2 text-sm w-32 focus:ring-2 focus:ring-green-200 min-w-0"
                  type="number"
                  placeholder="Amount"
                  value={newInv.amount}
                  onChange={(e) =>
                    setNewInv((s) => ({ ...s, amount: e.target.value }))
                  }
                  required
                  min={0}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  className="border border-green-300 rounded-lg px-4 py-2 text-sm w-32 focus:ring-2 focus:ring-green-200 min-w-0"
                  type="number"
                  placeholder="Interest % p.a."
                  value={newInv.interest}
                  onChange={(e) =>
                    setNewInv((s) => ({ ...s, interest: e.target.value }))
                  }
                  required
                  min={0}
                  step="0.01"
                />
                <input
                  className="border border-green-300 rounded-lg px-4 py-2 text-sm flex-1 focus:ring-2 focus:ring-green-200 min-w-0"
                  type="date"
                  placeholder="Start date"
                  value={newInv.startDate}
                  onChange={(e) =>
                    setNewInv((s) => ({ ...s, startDate: e.target.value }))
                  }
                  required
                />
                <label className="flex items-center gap-1 text-xs text-gray-600 ml-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={newInv.monthly}
                    onChange={(e) =>
                      setNewInv((s) => ({
                        ...s,
                        monthly: e.target.checked,
                      }))
                    }
                    className="accent-green-500"
                  />
                  <FaRedo className="text-xs" />
                  Monthly Payment?
                </label>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-semibold shadow hover:bg-green-700 transition whitespace-nowrap"
                  title="Add investment"
                >
                  <FaPlus />
                  Add
                </button>
              </div>
              {invError && (
                <div className="text-xs text-red-500 mt-1">{invError}</div>
              )}
            </form>

            {/* Investments List */}
            <div className="bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-2xl shadow-lg p-6 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <FaPiggyBank className="text-lg text-green-600" />
                <span className="font-semibold text-gray-700 text-base">
                  Your Investments
                </span>
              </div>
              <ul className="space-y-3">
                {investments.length === 0 && (
                  <li className="text-xs text-gray-400">
                    No investments added yet.
                  </li>
                )}
                {investments.map((inv) => (
                  <li
                    key={inv.id}
                    className="flex flex-wrap items-center gap-3 bg-white border border-green-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
                  >
                    <span className="font-bold text-green-700 text-base">
                      {inv.name}
                    </span>
                    <span className="text-xs text-gray-700 ml-auto">
                      {inv.startDate
                        ? `Start: ${inv.startDate}`
                        : "No start date"}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      R{addThousandsSeparator(inv.amount)}
                    </span>
                    <span className="text-xs text-green-600 ml-2">
                      {inv.interest}% p.a.
                    </span>
                    {inv.monthly && (
                      <span className="ml-2 text-xs text-green-700 font-semibold flex items-center gap-1">
                        <FaRedo /> Monthly
                      </span>
                    )}
                    <button
                      className="ml-2 text-red-400 hover:text-red-600"
                      title="Remove investment"
                      type="button"
                      onClick={() => handleDeleteInvestment(inv.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Investment Projection Chart */}
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <FaChartLine className="text-lg text-green-600" />
              <span className="font-semibold text-green-700 text-base">
                Investment Growth Projection
              </span>
            </div>
            <div className="w-full overflow-x-auto">
              <div style={{ minWidth: 320 }}>
                <Line data={chartData} options={chartOptions} height={220} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Savings;
