import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
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
      <div className="my-5 mx-auto">
        {/* Greeting and avatar */}
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

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expenses"
            value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
            color="bg-red-500"
          />
        </div>

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* 1st row: Recent Transactions & Financial Overview */}
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpenses || 0}
          />

          {/* 2nd row: Savings & Goals */}
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
              onAddSaving={(amt) => setSavings(savings + amt)}
            />
            {savings === 0 && (
              <EmptyState
                icon={<FaPiggyBank />}
                title="No savings yet"
                subtitle="Start saving to see your progress here."
              />
            )}
            <style>
              {`
                @keyframes dashboard-card-border {
                  0% { filter: blur(2.5px) hue-rotate(0deg);}
                  100% { filter: blur(2.5px) hue-rotate(360deg);}
                }
              `}
            </style>
          </div>

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

          {/* 3rd row: Expense/Income analytics */}
          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />

          <RecentIncomeWithChart
            data={
              dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []
            }
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />
        </div>
      </div>
      {/* Accessibility: visually hidden live region for toast updates */}
      <div aria-live="polite" className="sr-only" />
    </DashboardLayout>
  );
};

export default Home;
