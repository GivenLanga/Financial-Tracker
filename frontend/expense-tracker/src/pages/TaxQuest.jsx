import React, { useMemo, useEffect, useState } from "react";
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

// Full dashboard card style (matches dashboard cards)
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
  // Optional: mimic dashboard card border effect
  // You can add a pseudo-element or a div for the conic-gradient border if you want the animated border
};

const inputClass =
  "modern-tax-input border-none outline-none rounded-lg px-3 py-2 text-sm shadow focus:ring-2 focus:ring-primary/30 transition placeholder:text-gray-400";

const TimelineRemindersCard = ({
  deadlines,
  onAdd,
  onDelete,
  newReminder,
  setNewReminder,
  error,
}) => (
  <div
    style={cardStyle}
    className="w-full mt-6 flex flex-col items-stretch overflow-x-auto relative"
  >
    {/* Animated border overlay for card */}
    <div
      style={{
        content: "''",
        position: "absolute",
        inset: 0,
        zIndex: 1,
        borderRadius: "22px",
        pointerEvents: "none",
        background:
          "conic-gradient(from 180deg at 50% 50%, #a855f7 0%, #facc15 50%, #a855f7 100%)",
        opacity: 0.18,
        filter: "blur(2.5px)",
        animation: "dashboard-card-border 6s linear infinite",
      }}
    />
    <div style={{ position: "relative", zIndex: 2 }}>
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
              style={{
                wordBreak: "break-word",
                overflow: "hidden",
                background:
                  "linear-gradient(90deg, rgba(236,233,254,0.85) 0%, rgba(255,255,255,0.85) 100%)",
                borderLeft: "4px solid #a855f7",
              }}
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
          className={inputClass + " flex-1 w-full"}
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
          className={inputClass + " flex-1 w-full"}
          type="date"
          value={newReminder.date}
          onChange={(e) =>
            setNewReminder((r) => ({ ...r, date: e.target.value }))
          }
          required
          autoComplete="off"
        />
        <input
          className={inputClass + " flex-1 w-full"}
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
    <style>
      {`
        .modern-tax-input {
          background: rgba(248,250,252,0.95);
          border: 1.5px solid #a855f71a;
          color: #3b0764;
          font-weight: 500;
          box-shadow: 0 1.5px 6px 0 #a855f71a;
          transition: border 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .modern-tax-input:focus {
          border: 1.5px solid #a855f7;
          background: #fff;
          box-shadow: 0 2px 8px 0 #a855f733;
        }
        .modern-tax-input::placeholder {
          color: #a78bfa;
          opacity: 1;
        }
      `}
    </style>
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
    <div className="flex flex-col gap-8 justify-center min-h-[70vh] mt-8">
      {/* Top: Two cards side by side, both fill available width equally */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full flex-1">
        {/* South African Tax Estimator */}
        <div className="flex flex-col h-full">
          <div
            style={{
              ...cardStyle,
              background:
                "linear-gradient(120deg, #f3e8ff 0%, #ede9fe 60%, #fff 100%)",
              boxShadow:
                "0 8px 32px 0 rgba(139,92,246,0.13), 0 2px 16px 0 rgba(30,0,60,0.10), 0 0 0 2.5px #a855f733",
              border: "1.5px solid #a855f71a",
              borderRadius: "26px",
              padding: "2.2rem 2rem",
              position: "relative",
              overflow: "hidden",
              width: "100%",
              maxWidth: "100%",
            }}
            className="h-full flex flex-col justify-between"
          >
            {/* Decorative accent */}
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, #a855f7 0%, #f3e8ff 80%, transparent 100%)",
                opacity: 0.13,
                zIndex: 1,
                filter: "blur(2px)",
              }}
            />
            <div
              className="flex items-center gap-3 pb-4 border-b bg-gradient-to-r from-primary/10 to-purple-100"
              style={{
                margin: "-2rem",
                marginBottom: "2rem",
                borderRadius: "22px 22px 0 0",
                padding: "2rem",
                position: "relative",
                zIndex: 2,
                borderBottom: "1.5px solid #a855f733",
                boxShadow: "0 2px 8px 0 #a855f71a",
              }}
            >
              <FaCalculator className="text-2xl text-primary drop-shadow" />
              <span className="font-bold text-lg text-primary tracking-tight drop-shadow">
                South African Tax Estimator
              </span>
            </div>
            <div
              className="flex flex-col gap-4"
              style={{ position: "relative", zIndex: 2 }}
            >
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
        </div>
        {/* Net Income vs Tax Pie Chart */}
        <div className="flex flex-col h-full">
          <div
            style={{ ...cardStyle, width: "100%", maxWidth: "100%" }}
            className="w-full flex flex-col items-center h-full justify-center"
          >
            <div
              style={{
                content: "''",
                position: "absolute",
                inset: 0,
                zIndex: 1,
                borderRadius: "22px",
                pointerEvents: "none",
                background:
                  "conic-gradient(from 180deg at 50% 50%, #a855f7 0%, #facc15 50%, #a855f7 100%)",
                opacity: 0.18,
                filter: "blur(2.5px)",
                animation: "dashboard-card-border 6s linear infinite",
              }}
            />
            <h5
              className="font-semibold text-primary mb-4 text-center"
              style={{ position: "relative", zIndex: 2 }}
            >
              Net Income vs Tax
            </h5>
            <div
              style={{
                position: "relative",
                zIndex: 2,
                width: 220,
                height: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 220,
                minHeight: 220,
                maxWidth: 220,
                maxHeight: 220,
              }}
            >
              <Pie
                data={pieData}
                options={pieOptions}
                width={220}
                height={220}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Bottom: Timeline & Reminders fills remaining width */}
      <div className="w-full">
        <TimelineRemindersCard
          deadlines={upcomingDeadlines}
          onAdd={handleAddReminder}
          onDelete={handleDeleteReminder}
          newReminder={newReminder}
          setNewReminder={setNewReminder}
          error={error}
        />
      </div>
      <style>
        {`
          @keyframes dashboard-card-border {
            0% { filter: blur(2.5px) hue-rotate(0deg);}
            100% { filter: blur(2.5px) hue-rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
};

export default TaxQuest;
