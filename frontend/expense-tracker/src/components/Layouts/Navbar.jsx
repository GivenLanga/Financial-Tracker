import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import FinancialAI from "../../pages/FinancialAI";

// --- Mini Chatbot Component ---
const MiniChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me anything about your finances." },
  ]);
  // Placeholder for voice recognition
  const handleVoice = () => {
    setMessages((msgs) => [
      ...msgs,
      { from: "bot", text: "🎤 Voice command support coming soon!" },
    ]);
  };
  // Placeholder for smart home integration
  const handleSmartHome = () => {
    setMessages((msgs) => [
      ...msgs,
      { from: "bot", text: "🏠 Smart home integration coming soon!" },
    ]);
  };
  // Simulate chatbot reply
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          from: "bot",
          text: input.toLowerCase().includes("coffee")
            ? "You spent R120 on coffee this week."
            : input.toLowerCase().includes("car")
            ? "Based on your savings, you may need to save R800/month to afford a R10000 car next year."
            : "Sorry, I can't answer that yet, but I'm learning!",
        },
      ]);
    }, 900);
    setInput("");
  };

  return (
    <div className="relative ml-4">
      <button
        className="rounded-full bg-primary text-white w-10 h-10 flex items-center justify-center shadow hover:bg-purple-700 transition"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chatbot"
      >
        <span role="img" aria-label="chatbot">
          🤖
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-semibold text-gray-700">Financial AI</span>
            <button
              className="text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              &times;
            </button>
          </div>
          <div
            className="flex-1 overflow-y-auto px-4 py-2"
            style={{ maxHeight: 220 }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 text-sm ${
                  msg.from === "bot"
                    ? "text-gray-700"
                    : "text-right text-primary font-medium"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 px-3 py-2 border-t"
          >
            <button
              type="button"
              className="text-xl text-gray-500 hover:text-primary"
              onClick={handleVoice}
              title="Voice command"
              aria-label="Voice"
            >
              <span role="img" aria-label="voice">
                🎤
              </span>
            </button>
            <input
              className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="text-primary font-bold px-2"
              aria-label="Send"
            >
              ➤
            </button>
            <button
              type="button"
              className="text-xl text-gray-500 hover:text-primary"
              onClick={handleSmartHome}
              title="Smart home"
              aria-label="Smart home"
            >
              <span role="img" aria-label="smart home">
                🏠
              </span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
// --- End Mini Chatbot ---

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [showBot, setShowBot] = useState(false);

  return (
    <div className="flex gap-5 bg-white border boredr-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <h2 className="text-lg font-medium text-black flex-grow">
        Expense Tracker
      </h2>
      {/* FinancialAI mini widget, opens on click */}
      <div className="relative ml-4">
        <button
          className="rounded-full bg-primary text-white w-10 h-10 flex items-center justify-center shadow hover:bg-purple-700 transition"
          onClick={() => setShowBot((v) => !v)}
          aria-label="Open chatbot"
        >
          <span role="img" aria-label="chatbot">
            🤖
          </span>
        </button>
        {showBot && (
          <div className="absolute right-0 mt-2 z-50">
            <FinancialAI mini onClose={() => setShowBot(false)} />
          </div>
        )}
      </div>
      <button
        className="block lg:hidden text-black"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      {openSideMenu && (
        <div className="fixed top-[61px] right-0 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
