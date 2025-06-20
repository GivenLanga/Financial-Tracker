import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { IoMdCard } from "react-icons/io";
import { LuWalletMinimal, LuHandCoins } from "react-icons/lu";
import { FaPiggyBank, FaBullseye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import InfoCard from "../../components/Cards/InfoCard";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { addThousandsSeparator } from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";
import RecentIncome from "../../components/Dashboard/RecentIncome";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import GoalsOverview from "../../components/Dashboard/GoalsOverview";
import SavingsOverview from "../../components/Dashboard/SavingsOverview";

const cardClipPath =
  "polygon(0 8%, 8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%)";
const cardStyle = {
  clipPath: cardClipPath,
  background: "rgba(255,255,255,0.72)",
  boxShadow:
    "0 8px 32px 0 rgba(109,40,217,0.13), 0 2px 16px 0 rgba(30,0,60,0.10), 0 0 0 2.5px rgba(168,85,247,0.12)",
  border: "none",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  position: "relative",
  overflow: "hidden",
};
const borderStyle = {
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
};

const EmptyState = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="mb-2 text-4xl text-gray-300">{icon}</div>
    <div className="text-lg font-semibold text-gray-400">{title}</div>
    <div className="text-xs text-gray-300">{subtitle}</div>
  </div>
);

const useInView = (options = {}) => {
  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return [ref, inView];
};

const FadeInCard = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(40px)",
        transition: `opacity 0.6s ${delay}ms cubic-bezier(.4,0,.2,1), transform 0.6s ${delay}ms cubic-bezier(.4,0,.2,1)`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

const financialCardThemes = [
  {
    label: "Total Balance",
    icon: <IoMdCard />,
    gradient: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
    border: "2.5px solid #a855f7",
    shadow: "0 4px 24px 0 rgba(34,197,94,0.10)",
    color: "text-primary",
    ring: "ring-2 ring-primary/20",
  },
  {
    label: "Total Income",
    icon: <LuWalletMinimal />,
    gradient: "linear-gradient(135deg, #e0f7fa 0%, #a7ffeb 100%)",
    border: "2.5px solid #22c55e",
    shadow: "0 4px 24px 0 rgba(34,197,94,0.13)",
    color: "text-green-700",
    ring: "ring-2 ring-green-200",
  },
  {
    label: "Total Expenses",
    icon: <LuHandCoins />,
    gradient: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
    border: "2.5px solid #ef4444",
    shadow: "0 4px 24px 0 rgba(239,68,68,0.13)",
    color: "text-red-600",
    ring: "ring-2 ring-red-200",
  },
];

const Home = ({ goals, setGoals, savings, setSavings }) => {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);

  // Responsive greeting
  const userName = dashboardData?.user?.fullName || "";

  // Add edit/delete logic for goals
  const handleEditGoal = (idx, updatedGoal) => {
    setGoals(goals.map((g, i) => (i === idx ? updatedGoal : g)));
  };
  const handleDeleteGoal = (idx) => {
    setGoals(goals.filter((_, i) => i !== idx));
  };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 w-full">
        {" "}
        {/* Changed mx-auto to w-full */}
        {/* Greeting and avatar */}
        <FadeInCard delay={0}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
              {userName ? userName[0].toUpperCase() : <IoMdCard />}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Welcome{userName && `, ${userName}`}!
              </div>
              <div className="text-xs text-gray-500">
                Here’s your financial dashboard.
              </div>
            </div>
          </div>
        </FadeInCard>
        {/* Financial Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              ...financialCardThemes[0],
              value: addThousandsSeparator(dashboardData?.totalBalance || 0),
            },
            {
              ...financialCardThemes[1],
              value: addThousandsSeparator(dashboardData?.totalIncome || 0),
            },
            {
              ...financialCardThemes[2],
              value: addThousandsSeparator(dashboardData?.totalExpenses || 0),
            },
          ].map((card, idx) => (
            <div
              key={card.label}
              className={`rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl ${card.ring}`}
              style={{
                background: card.gradient,
                border: card.border,
                boxShadow: card.shadow,
                minHeight: 140,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                className={`mb-2 text-3xl ${card.color}`}
                style={{
                  filter: "drop-shadow(0 2px 8px rgba(168,85,247,0.10))",
                }}
              >
                {card.icon}
              </div>
              <div className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-1">
                {card.label}
              </div>
              <div
                className={`text-2xl font-bold ${card.color} tracking-tight`}
                style={{
                  letterSpacing: "-0.01em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                R{card.value}
              </div>
              {/* Decorative SVG for financial theme */}
              <svg
                width="100"
                height="40"
                viewBox="0 0 100 40"
                fill="none"
                className="absolute bottom-0 right-0 opacity-20"
                style={{ zIndex: 0 }}
              >
                <ellipse
                  cx="80"
                  cy="35"
                  rx="30"
                  ry="8"
                  fill={
                    idx === 0 ? "#a855f7" : idx === 1 ? "#22c55e" : "#ef4444"
                  }
                />
              </svg>
            </div>
          ))}
        </div>
        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FadeInCard delay={0}>
            <RecentTransactions
              transactions={dashboardData?.recentTransactions}
              onSeeMore={() => navigate("/expense")}
            />
          </FadeInCard>
          <FadeInCard delay={100}>
            <FinanceOverview
              totalBalance={dashboardData?.totalBalance || 0}
              totalIncome={dashboardData?.totalIncome || 0}
              totalExpense={dashboardData?.totalExpenses || 0}
            />
          </FadeInCard>
          <FadeInCard delay={200}>
            <div
              className="card transition-transform duration-300"
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 16px 48px 0 rgba(109,40,217,0.18), 0 4px 24px 0 rgba(30,0,60,0.13), 0 0 0 3.5px rgba(168,85,247,0.18)";
                e.currentTarget.style.transform = "scale(1.022)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 32px 0 rgba(109,40,217,0.13), 0 2px 16px 0 rgba(30,0,60,0.10), 0 0 0 2.5px rgba(168,85,247,0.12)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div style={borderStyle} />
              <div className="flex items-center gap-2 mb-3">
                <FaPiggyBank className="text-2xl text-purple-400" />
                <span className="text-lg font-semibold text-gray-800">
                  Savings
                </span>
              </div>
              <SavingsOverview
                savings={savings}
                onAddSaving={
                  setSavings ? (amt) => setSavings(savings + amt) : undefined
                }
              />
            </div>
          </FadeInCard>
          <FadeInCard delay={300}>
            <div
              className="card transition-transform duration-300"
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 16px 48px 0 rgba(109,40,217,0.18), 0 4px 24px 0 rgba(30,0,60,0.13), 0 0 0 3.5px rgba(168,85,247,0.18)";
                e.currentTarget.style.transform = "scale(1.022)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 32px 0 rgba(109,40,217,0.13), 0 2px 16px 0 rgba(30,0,60,0.10), 0 0 0 2.5px rgba(168,85,247,0.12)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div style={borderStyle} />
              <div className="flex items-center gap-2 mb-3">
                <FaBullseye className="text-2xl text-yellow-400" />
                <span className="text-lg font-semibold text-gray-800">
                  Financial Goals
                </span>
              </div>
              <GoalsOverview goals={goals} setGoals={setGoals} />
              <style>
                {`
                  @keyframes dashboard-card-border {
                    0% { filter: blur(2.5px) hue-rotate(0deg);}
                    100% { filter: blur(2.5px) hue-rotate(360deg);}
                  }
                `}
              </style>
            </div>
          </FadeInCard>
          <FadeInCard delay={400}>
            <ExpenseTransactions
              transactions={
                dashboardData?.last30DaysExpenses?.transactions || []
              }
              onSeeMore={() => navigate("/expense")}
            />
          </FadeInCard>
          <FadeInCard delay={500}>
            <Last30DaysExpenses
              data={dashboardData?.last30DaysExpenses?.transactions || []}
            />
          </FadeInCard>
          <FadeInCard delay={600}>
            <RecentIncomeWithChart
              data={
                dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []
              }
              totalIncome={dashboardData?.totalIncome || 0}
            />
          </FadeInCard>
          <FadeInCard delay={700}>
            <RecentIncome
              transactions={dashboardData?.last60DaysIncome?.transactions || []}
              onSeeMore={() => navigate("/income")}
            />
          </FadeInCard>
        </div>
      </div>
      {/* Accessibility: visually hidden live region for toast updates */}
      <div aria-live="polite" className="sr-only" />
    </DashboardLayout>
  );
};

export default Home;
