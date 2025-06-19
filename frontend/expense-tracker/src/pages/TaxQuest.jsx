import React, { useMemo, useEffect, useState } from "react";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import { useSelector, useDispatch } from "react-redux";
import {
  FaCalculator,
  FaMoneyBillWave,
  FaInfoCircle,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import { addThousandsSeparator } from "../utils/helper";
import { fetchTransactions } from "../slices/transactionSlice";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import moment from "moment";

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

// 2024 South African tax brackets (monthly, for individuals under 65)
const TAX_BRACKETS = [
  { upTo: 237100 / 12, rate: 0.18, base: 0, baseTax: 0 },
  { upTo: 370500 / 12, rate: 0.26, base: 237100 / 12, baseTax: 42678 / 12 },
  { upTo: 512800 / 12, rate: 0.31, base: 370500 / 12, baseTax: 77362 / 12 },
  { upTo: 673000 / 12, rate: 0.36, base: 512800 / 12, baseTax: 121475 / 12 },
  { upTo: 857900 / 12, rate: 0.39, base: 673000 / 12, baseTax: 179147 / 12 },
  { upTo: 1817000 / 12, rate: 0.41, base: 857900 / 12, baseTax: 251258 / 12 },
  { upTo: Infinity, rate: 0.45, base: 1817000 / 12, baseTax: 644489 / 12 },
];

function calculateAnnualTax(income) {
  let tax = 0;
  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const { upTo, rate, base, baseTax } = TAX_BRACKETS[i];
    if (income <= upTo * 12) {
      tax = baseTax * 12 + (income - base * 12) * rate;
      break;
    }
  }
  tax = tax - 17235;
  return Math.max(0, tax);
}

function calculateMonthlyTax(monthlyIncome) {
  const annualIncome = monthlyIncome * 12;
  const annualTax = calculateAnnualTax(annualIncome);
  return annualTax / 12;
}

// Default deadlines
const TAX_DEADLINES = [
  {
    label: "Start of Tax Year",
    date: "2024-03-01",
    desc: "New tax year begins.",
    user: false,
  },
  {
    label: "Provisional Tax 1st Period",
    date: "2024-08-31",
    desc: "First provisional tax payment due.",
    user: false,
  },
  {
    label: "Provisional Tax 2nd Period",
    date: "2025-02-28",
    desc: "Second provisional tax payment due.",
    user: false,
  },
  {
    label: "Tax Season Opens",
    date: "2024-07-01",
    desc: "SARS opens for tax return submissions.",
    user: false,
  },
  {
    label: "Tax Season Closes (Non-provisional)",
    date: "2024-10-21",
    desc: "Deadline for non-provisional taxpayers.",
    user: false,
  },
  {
    label: "Tax Season Closes (Provisional)",
    date: "2025-01-20",
    desc: "Deadline for provisional taxpayers.",
    user: false,
  },
];

// Only show the next 5 unique (by label+date+desc+user) deadlines (static + user), sorted by date, no overlap
function getUpcomingDeadlines(staticDeadlines, userReminders) {
  const now = moment();
  // Combine and deduplicate by label+date+desc+user
  const all = [
    ...staticDeadlines,
    ...userReminders.map((r) => ({ ...r, user: true })),
  ];
  // Remove overlaps: if a user reminder has the same label+date as a static, prefer the user one
  const unique = [];
  const seen = new Set();
  for (const d of all) {
    const key = `${d.label}|${d.date}`;
    if (!seen.has(key)) {
      unique.push(d);
      seen.add(key);
    } else if (d.user) {
      // Replace static with user if user reminder exists for same label+date
      const idx = unique.findIndex((u) => `${u.label}|${u.date}` === key);
      if (idx !== -1) unique[idx] = d;
    }
  }
  return unique
    .filter((d) => moment(d.date).isAfter(now))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);
}

const TimelineRemindersCard = ({
  deadlines,
  onAdd,
  onDelete,
  newReminder,
  setNewReminder,
  error,
}) => (
  <div className="w-full bg-white rounded-2xl shadow p-6 mt-6 flex flex-col items-stretch overflow-x-auto">
    <h5 className="font-semibold text-primary mb-4 flex items-center gap-2">
      <FaInfoCircle className="text-base" />
      Tax Timeline & Reminders
    </h5>
    <div className="w-full overflow-x-auto">
      <ul className="space-y-2 mb-4 min-w-[340px]">
        {deadlines.length === 0 && (
          <li className="text-xs text-gray-400">No upcoming deadlines.</li>
        )}
        {deadlines.map((d, idx) => (
          <li
            key={d.label + d.date + (d.user ? "-user" : "")}
            className="flex items-center gap-3 bg-purple-50 border-l-4 border-primary/40 rounded px-3 py-2 min-w-0"
            style={{ wordBreak: "break-word", overflow: "hidden" }}
          >
            <span className="font-bold text-primary whitespace-nowrap">
              {moment(d.date).format("D MMM YYYY")}
            </span>
            <span className="font-medium text-gray-700 truncate max-w-[120px]">
              {d.label}
            </span>
            <span className="text-xs text-gray-500 ml-auto truncate max-w-[120px]">
              {d.desc}
            </span>
            {d.user && (
              <button
                className="ml-2 text-red-400 hover:text-red-600 flex-shrink-0"
                title="Remove reminder"
                type="button"
                onClick={() => onDelete(d)}
              >
                <FaTrashAlt />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
    <form
      className="flex flex-col md:flex-row gap-2 items-center"
      onSubmit={onAdd}
      autoComplete="off"
    >
      <input
        className="border rounded px-3 py-2 text-sm flex-1 min-w-0"
        type="text"
        placeholder="Reminder label (e.g. 'My Tax Filing')"
        value={newReminder.label}
        onChange={(e) =>
          setNewReminder((r) => ({ ...r, label: e.target.value }))
        }
        required
        autoComplete="off"
      />
      <input
        className="border rounded px-3 py-2 text-sm flex-1 min-w-0"
        type="date"
        value={newReminder.date}
        onChange={(e) =>
          setNewReminder((r) => ({ ...r, date: e.target.value }))
        }
        required
        autoComplete="off"
      />
      <input
        className="border rounded px-3 py-2 text-sm flex-1 min-w-0"
        type="text"
        placeholder="Description"
        value={newReminder.desc}
        onChange={(e) =>
          setNewReminder((r) => ({ ...r, desc: e.target.value }))
        }
        autoComplete="off"
      />
      <button
        type="submit"
        className="flex items-center gap-1 px-3 py-2 rounded bg-primary text-white text-xs font-semibold shadow hover:bg-purple-700 transition flex-shrink-0"
        title="Add reminder"
      >
        <FaPlus />
        Add
      </button>
    </form>
    {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
  </div>
);

const TaxQuest = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.items || []);
  const loading = useSelector((state) => state.transactions.loading);
  const loaded = useSelector((state) => state.transactions.loaded);

  // Fetch transactions on mount if not loaded
  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(fetchTransactions());
    }
  }, [loaded, loading, dispatch]);

  // Tax calculations
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0),
    [transactions]
  );

  const monthsWithIncome = useMemo(() => {
    const months = new Set();
    transactions
      .filter((t) => t.type === "income")
      .forEach((t) => {
        if (t.date) {
          const d = new Date(t.date);
          months.add(`${d.getFullYear()}-${d.getMonth() + 1}`);
        }
      });
    return months.size || 1;
  }, [transactions]);

  const monthlyIncome = monthsWithIncome
    ? totalIncome / monthsWithIncome
    : totalIncome;

  const monthlyTax = calculateMonthlyTax(monthlyIncome);
  const annualTax = monthlyTax * 12;

  // Pie chart
  const pieData = {
    labels: ["Net Income", "Tax"],
    datasets: [
      {
        data: [
          Math.max(0, Math.round(monthlyIncome - monthlyTax)),
          Math.round(monthlyTax),
        ],
        backgroundColor: ["rgba(34,197,94,0.85)", "rgba(139,92,246,0.85)"],
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 12,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: { position: "bottom", labels: { font: { size: 13 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: R${addThousandsSeparator(ctx.parsed)}`,
        },
      },
    },
  };

  // Timeline & Reminders state
  const [reminders, setReminders] = useState(() => {
    // Load user reminders from localStorage
    try {
      const saved = localStorage.getItem("taxReminders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newReminder, setNewReminder] = useState({
    label: "",
    date: "",
    desc: "",
  });
  const [error, setError] = useState("");

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem("taxReminders", JSON.stringify(reminders));
  }, [reminders]);

  // Combine static deadlines and user reminders, deduplicate by label+date, prefer user
  const upcomingDeadlines = useMemo(
    () => getUpcomingDeadlines(TAX_DEADLINES, reminders),
    [reminders]
  );

  // Add reminder handler
  const handleAddReminder = (e) => {
    e.preventDefault();
    setError("");
    if (!newReminder.label || !newReminder.date) {
      setError("Please enter a label and date.");
      return;
    }
    // Prevent overlap: don't allow same label+date as any existing (static or user)
    const exists = [...TAX_DEADLINES, ...reminders].some(
      (d) => d.label === newReminder.label && d.date === newReminder.date
    );
    if (exists) {
      setError(
        "A reminder or deadline with this label and date already exists."
      );
      return;
    }
    setReminders((rem) => [...rem, { ...newReminder, user: true }]);
    setNewReminder({ label: "", date: "", desc: "" });
  };

  // Delete reminder handler
  const handleDeleteReminder = (reminder) => {
    setReminders((rem) =>
      rem.filter(
        (r) =>
          !(
            r.label === reminder.label &&
            r.date === reminder.date &&
            r.desc === reminder.desc
          )
      )
    );
  };

  // --- Layout similar to Dashboard ---
  return (
    <DashboardLayout activeMenu="Tax Quest">
      <div className="flex flex-col md:flex-row gap-8 justify-center min-h-[70vh] mt-8">
        {/* Left: Tax Estimator Card */}
        <div className="flex-1 max-w-xl flex flex-col">
          <div className="rounded-2xl shadow-xl bg-white/95 border border-primary/20 p-0 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-6 border-b bg-gradient-to-r from-primary/10 to-purple-100">
              <FaCalculator className="text-2xl text-primary" />
              <span className="font-bold text-lg text-primary">
                South African Tax Estimator
              </span>
            </div>
            <div className="px-6 py-6 flex flex-col gap-4">
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  Loading your transactions...
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <FaMoneyBillWave className="text-xl text-green-500" />
                    <span className="font-semibold text-gray-700">
                      Estimated Monthly Income:
                    </span>
                    <span className="ml-auto text-lg font-bold text-green-700">
                      R{addThousandsSeparator(Math.round(monthlyIncome))}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCalculator className="text-xl text-purple-500" />
                    <span className="font-semibold text-gray-700">
                      Estimated Monthly Tax:
                    </span>
                    <span className="ml-auto text-lg font-bold text-purple-700">
                      R{addThousandsSeparator(Math.round(monthlyTax))}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCalculator className="text-xl text-purple-400" />
                    <span className="font-semibold text-gray-700">
                      Estimated Annual Tax:
                    </span>
                    <span className="ml-auto text-lg font-bold text-purple-700">
                      R{addThousandsSeparator(Math.round(annualTax))}
                    </span>
                  </div>
                  <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                    <FaInfoCircle className="text-base" />
                    <span>
                      This is an estimate based on your recorded income and 2024
                      SARS tax brackets (primary rebate applied, under 65).
                      Actual tax may differ based on deductions, age, and other
                      factors.
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Timeline & Reminders Card */}
          <TimelineRemindersCard
            deadlines={upcomingDeadlines}
            onAdd={handleAddReminder}
            onDelete={handleDeleteReminder}
            newReminder={newReminder}
            setNewReminder={setNewReminder}
            error={error}
          />
        </div>
        {/* Right: Pie Chart only */}
        <div className="flex-1 flex flex-col gap-8 items-center max-w-xl justify-center">
          <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col items-center">
            <h5 className="font-semibold text-primary mb-4 text-center">
              Net Income vs Tax
            </h5>
            <Pie data={pieData} options={pieOptions} width={220} height={220} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TaxQuest;
