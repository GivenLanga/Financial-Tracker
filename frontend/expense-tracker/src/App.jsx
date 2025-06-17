import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import LoginForm from "./pages/Auth/LoginForm";
import SignUpForm from "./pages/Auth/SignUpForm";
import UserProvider from "./context/UserContext";

import { Toaster } from "react-hot-toast";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import GoalsOverview from "./components/Dashboard/GoalsOverview";
import SavingsOverview from "./components/Dashboard/SavingsOverview";
import DashboardLayout from "./components/Layouts/DashboardLayout";

const App = () => {
  // State for goals and savings (shared across dashboard and pages)
  const [goals, setGoals] = React.useState(() => {
    const stored = localStorage.getItem("goals");
    return stored ? JSON.parse(stored) : [];
  });
  const [savings, setSavings] = React.useState(() => {
    const stored = localStorage.getItem("savings");
    return stored ? Number(stored) : 0;
  });

  // Persist to localStorage when changed
  React.useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);
  React.useEffect(() => {
    localStorage.setItem("savings", savings);
  }, [savings]);

  return (
    <div>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<LoginForm />} />
            <Route path="/signUp" exact element={<SignUpForm />} />
            <Route
              path="/dashboard"
              exact
              element={
                <Home
                  goals={goals}
                  setGoals={setGoals}
                  savings={savings}
                  setSavings={setSavings}
                />
              }
            />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
            {/* Wrap Goals and Savings in DashboardLayout for persistent sidebar */}
            <Route
              path="/goals"
              element={
                <DashboardLayout activeMenu="Goals">
                  <GoalsOverview
                    goals={goals}
                    onAddGoal={(g) => setGoals([...goals, g])}
                  />
                </DashboardLayout>
              }
            />
            <Route
              path="/savings"
              element={
                <DashboardLayout activeMenu="Savings">
                  <SavingsOverview
                    savings={savings}
                    onAddSaving={(amt) => setSavings(savings + amt)}
                  />
                </DashboardLayout>
              }
            />
          </Routes>
        </Router>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </UserProvider>
    </div>
  );
};

// Define the Root component to handle the initial redirect
const Root = () => {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

export default App;
