import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import { useSelector, useDispatch } from "react-redux";
import { fetchTransactions } from "../slices/transactionSlice";
import { addThousandsSeparator } from "../utils/helper";

const FinancialAI = ({ mini, onClose }) => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.items || []);
  const transactionsLoading = useSelector(
    (state) => state.transactions.loading
  );
  const transactionsLoaded = useSelector((state) => state.transactions.loaded);

  const goalsRedux = useSelector((state) => state.goals.items || []);
  const user = useSelector((state) => state.user.user);
  const categoriesRedux = useSelector((state) => state.categories.items || []);
  let goals = [];
  let savings = 0;
  try {
    goals = JSON.parse(localStorage.getItem("goals")) || goalsRedux;
    savings = Number(localStorage.getItem("savings")) || 0;
  } catch {
    goals = goalsRedux;
    savings = 0;
  }
  const budgets = useSelector((state) => state.budgets?.items || []);

  useEffect(() => {
    if (!transactionsLoaded && !transactionsLoading) {
      dispatch(fetchTransactions());
    }
    // eslint-disable-next-line
  }, [transactionsLoaded, transactionsLoading, dispatch]);

  // Helper: Sum expenses
  const getTotalExpense = () =>
    transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

  // Helper: Sum income
  const getTotalIncome = () =>
    transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

  // Helper: Get total balance
  const getTotalBalance = () =>
    transactions.reduce(
      (sum, t) =>
        t.type === "income"
          ? sum + Number(t.amount)
          : t.type === "expense"
          ? sum - Number(t.amount)
          : sum,
      0
    );

  // Helper: Get budgets
  const getBudgets = () => {
    if (budgets.length > 0) return budgets;
    return [];
  };

  // Helper: Get goals
  const getGoals = () => goals;

  // Helper: Get savings
  const getSavings = () => savings;

  // Helper: Get category spend
  const getCategorySpend = (cat) =>
    transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category &&
          t.category.toLowerCase().includes(cat.toLowerCase())
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

  // Helper: Get all categories
  const getAllCategories = () => {
    const txCats = transactions
      .filter((t) => t.category)
      .map((t) => t.category);
    const reduxCats = categoriesRedux.map((c) =>
      typeof c === "string" ? c : c.name
    );
    return Array.from(new Set([...txCats, ...reduxCats]));
  };

  // Helper: Get recent transactions
  const getRecentTransactions = (count = 5) =>
    [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, count);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me anything about your finances." },
  ]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Main AI logic
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);

    setTimeout(() => {
      // If transactions are still loading, show a loading message
      if (transactionsLoading) {
        setMessages((msgs) => [
          ...msgs,
          { from: "bot", text: "Loading your financial data, please wait..." },
        ]);
        return;
      }

      const q = input.toLowerCase();
      let answer = "Sorry, I can't answer that yet, but I'm learning!";

      // Total balance
      if (
        q.includes("total balance") ||
        (q.includes("balance") && !q.includes("bank"))
      ) {
        answer = `Your total balance is R${addThousandsSeparator(
          getTotalBalance()
        )}.`;
      }
      // Total expense
      else if (
        q.includes("total expense") ||
        q.includes("total spent") ||
        q.includes("total spending") ||
        (q.includes("expense") && !q.includes("category"))
      ) {
        answer = `Your total expenses are R${addThousandsSeparator(
          getTotalExpense()
        )}.`;
      }
      // Total income
      else if (
        q.includes("total income") ||
        q.includes("total earned") ||
        q.includes("total earnings") ||
        q.includes("income") ||
        q.includes("earn")
      ) {
        answer = `Your total income is R${addThousandsSeparator(
          getTotalIncome()
        )}.`;
      }
      // Savings
      else if (
        q.includes("savings") ||
        q.includes("how much saved") ||
        q.includes("my savings")
      ) {
        answer = `Your savings are R${addThousandsSeparator(getSavings())}.`;
      }
      // Budgets
      else if (
        q.includes("budget") ||
        q.includes("budgets") ||
        q.includes("my budget")
      ) {
        const b = getBudgets();
        if (b.length === 0) {
          answer = "You have no budgets set.";
        } else {
          answer =
            "Your budgets: " +
            b
              .map(
                (bud) =>
                  `${bud.category || bud.name}: R${addThousandsSeparator(
                    bud.amount || bud.limit
                  )}`
              )
              .join(", ");
        }
      }
      // Goals
      else if (
        q.includes("goal") ||
        q.includes("financial goal") ||
        q.includes("my goals")
      ) {
        const g = getGoals();
        if (!g || g.length === 0) {
          answer = "You have no goals set.";
        } else {
          answer =
            "Your goals: " +
            g
              .map(
                (goal) =>
                  `${goal.name || goal.title} (Target: R${addThousandsSeparator(
                    goal.target || goal.amount
                  )}, Saved: R${addThousandsSeparator(goal.saved || 0)})`
              )
              .join(", ");
        }
      }
      // Category spend: "How much did I spend on X?"
      else if (q.includes("spend on")) {
        const match = q.match(/spend on ([a-zA-Z]+)/);
        if (match && match[1]) {
          const cat = match[1];
          const spent = getCategorySpend(cat);
          answer = `You spent R${addThousandsSeparator(spent)} on ${cat}.`;
        }
      }
      // List categories
      else if (q.includes("categories")) {
        const cats = getAllCategories();
        answer =
          cats.length > 0
            ? "Your categories: " + cats.join(", ")
            : "You have no categories yet.";
      }
      // Recent transactions
      else if (
        q.includes("recent transactions") ||
        q.includes("latest transactions") ||
        q.includes("last transactions")
      ) {
        const txs = getRecentTransactions();
        if (txs.length === 0) {
          answer = "You have no recent transactions.";
        } else {
          answer =
            "Your recent transactions:\n" +
            txs
              .map(
                (t) =>
                  `${t.type === "income" ? "Income" : "Expense"}: ${
                    t.category || t.source
                  } R${addThousandsSeparator(t.amount)} (${
                    t.date ? new Date(t.date).toLocaleDateString() : ""
                  })`
              )
              .join("\n");
        }
      }
      // Affordability
      else if (q.includes("afford") && q.match(/r\d+/)) {
        const match = q.match(/r(\d+)/);
        if (match && match[1]) {
          const price = Number(match[1]);
          const balance = getTotalBalance();
          if (balance >= price) {
            answer = `Yes, you can afford it! Your balance is R${addThousandsSeparator(
              balance
            )}.`;
          } else {
            answer = `You need R${addThousandsSeparator(
              price - balance
            )} more to afford that.`;
          }
        }
      }
      // Who am I
      else if (q.includes("who am i") || q.includes("my name")) {
        answer = user?.fullName
          ? `You are ${user.fullName}.`
          : "I don't know your name yet!";
      }
      // Fallback: try to match category spend
      else {
        // Try to match "spend on X" for any category
        const cats = getAllCategories();
        for (let cat of cats) {
          if (q.includes(cat.toLowerCase())) {
            const spent = getCategorySpend(cat);
            answer = `You spent R${addThousandsSeparator(spent)} on ${cat}.`;
            break;
          }
        }
      }

      setMessages((msgs) => [...msgs, { from: "bot", text: answer }]);
    }, 900);

    setInput("");
  };

  // --- Modern UI Styles ---
  const botBg =
    "bg-gradient-to-br from-primary/10 via-purple-50 to-white border border-primary/20";
  const userMsg =
    "bg-primary/90 text-white ml-auto rounded-2xl px-4 py-2 w-fit shadow";
  const botMsg =
    "bg-white text-gray-800 rounded-2xl px-4 py-2 w-fit shadow border border-primary/10";
  const inputBar =
    "flex items-center gap-2 px-4 py-3 border-t bg-gradient-to-r from-primary/5 to-white";
  const chatContainer =
    "flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent";

  // Mini widget mode for navbar
  if (mini) {
    return (
      <div
        className={`w-80 rounded-2xl shadow-2xl ${botBg} flex flex-col`}
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(109,40,217,0.13), 0 2px 16px 0 rgba(30,0,60,0.10)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-primary/10 to-purple-100">
          <span className="font-semibold text-primary text-lg flex items-center gap-2">
            <span role="img" aria-label="chatbot" className="text-2xl">
              🤖
            </span>
            Financial AI
          </span>
          <button
            className="text-gray-400 hover:text-gray-700 text-xl"
            onClick={onClose}
            aria-label="Close chatbot"
          >
            &times;
          </button>
        </div>
        <div className={chatContainer} style={{ maxHeight: 260 }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 text-sm ${
                msg.from === "bot" ? botMsg : userMsg
              }`}
              style={msg.from === "bot" ? {} : { maxWidth: "80%" }}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className={inputBar}>
          <button
            type="button"
            className="text-xl text-gray-500 hover:text-primary"
            onClick={() =>
              setMessages((msgs) => [
                ...msgs,
                { from: "bot", text: "🎤 Voice command support coming soon!" },
              ])
            }
            title="Voice command"
            aria-label="Voice"
          >
            <span role="img" aria-label="voice">
              🎤
            </span>
          </button>
          <div className="flex-1 flex">
            <input
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none bg-white"
              style={{
                borderColor: "#a855f7",
                background: "#f9f7fd",
                minWidth: 0,
              }}
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="text-primary font-bold px-2 text-xl"
            aria-label="Send"
          >
            ➤
          </button>
        </form>
      </div>
    );
  }

  // --- Full page mode ---
  return (
    <DashboardLayout activeMenu="Financial AI">
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div
          className={`w-full max-w-md rounded-2xl shadow-2xl ${botBg} p-0 overflow-hidden`}
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(109,40,217,0.13), 0 2px 16px 0 rgba(30,0,60,0.10)",
          }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-primary/10 to-purple-100">
            <span className="font-semibold text-primary text-lg flex items-center gap-2">
              <span role="img" aria-label="chatbot" className="text-2xl">
                🤖
              </span>
              Financial AI
            </span>
          </div>
          <div className={chatContainer} style={{ maxHeight: 340 }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 text-sm ${
                  msg.from === "bot" ? botMsg : userMsg
                }`}
                style={msg.from === "bot" ? {} : { maxWidth: "80%" }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className={inputBar}>
            <button
              type="button"
              className="text-xl text-gray-500 hover:text-primary"
              onClick={() =>
                setMessages((msgs) => [
                  ...msgs,
                  {
                    from: "bot",
                    text: "🎤 Voice command support coming soon!",
                  },
                ])
              }
              title="Voice command"
              aria-label="Voice"
            >
              <span role="img" aria-label="voice">
                🎤
              </span>
            </button>
            <div className="flex-1 flex">
              <input
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none bg-white"
                style={{
                  borderColor: "#a855f7",
                  background: "#f9f7fd",
                  minWidth: 0,
                }}
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="text-primary font-bold px-2 text-xl"
              aria-label="Send"
            >
              ➤
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinancialAI;
