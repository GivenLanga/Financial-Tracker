import React from "react";
import {
  FaCoins,
  FaPiggyBank,
  FaWallet,
  FaChartLine,
  FaRegStar,
} from "react-icons/fa";
import SplineBot from "../../pages/ui-materials/SplineBot";

// Animated path with moving coin
const AdventurePath = () => (
  <svg
    width="260"
    height="80"
    viewBox="0 0 260 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mb-2"
  >
    <path
      id="adventure-path"
      d="M20 60 Q 60 10, 120 40 T 220 30"
      stroke="#a855f7"
      strokeWidth="5"
      fill="none"
      strokeDasharray="8 8"
      opacity="0.3"
    />
    <circle r="10" fill="#facc15" opacity="0.85">
      <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
        <mpath xlinkHref="#adventure-path" />
      </animateMotion>
    </circle>
  </svg>
);

// Glassy credit card with animated shine
const GlassCreditCard = () => (
  <div
    className="relative mx-auto"
    style={{
      width: 320,
      height: 200,
      perspective: 800,
      marginBottom: "2.5rem",
      zIndex: 30,
    }}
  >
    <div
      className="absolute w-full h-full rounded-3xl shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #a855f7 60%, #6d28d9 100%)",
        filter: "blur(32px)",
        opacity: 0.25,
        zIndex: 1,
        top: 18,
        left: 18,
      }}
    />
    <div
      className="w-full h-full rounded-3xl relative overflow-hidden"
      style={{
        background: "rgba(30,0,60,0.55)",
        border: "2.5px solid rgba(168,85,247,0.22)",
        boxShadow:
          "0 8px 32px 0 rgba(109,40,217,0.18), 0 0 60px 10px rgba(168,85,247,0.10)",
        transform: "rotateY(-12deg) rotateX(6deg)",
        zIndex: 2,
      }}
    >
      {/* Animated shine */}
      <div
        className="absolute left-0 top-0 w-full h-full pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.02) 60%)",
          mixBlendMode: "screen",
          animation: "shine 3.5s linear infinite",
        }}
      />
      {/* Card content */}
      <div className="flex flex-col justify-between h-full p-7 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-white/80 font-bold text-lg tracking-widest">
            EXPENSE
          </span>
          <FaRegStar className="text-yellow-300" size={28} />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <span className="text-white/70 text-xs tracking-widest">
            CARD HOLDER
          </span>
          <span className="text-white/90 font-bold text-xl tracking-widest">
            YOUR JOURNEY
          </span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-white/60 text-xs">**** 1234</span>
          <span className="text-white/60 text-xs">12/29</span>
        </div>
      </div>
    </div>
    <style>
      {`
        @keyframes shine {
          0% { opacity: 0.7; transform: translateX(-100%) skewX(-12deg);}
          60% { opacity: 1; }
          100% { opacity: 0.7; transform: translateX(120%) skewX(-12deg);}
        }
      `}
    </style>
  </div>
);

// Confetti effect
const Confetti = () => (
  <>
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute z-40"
        style={{
          top: `${10 + Math.random() * 70}%`,
          left: `${10 + Math.random() * 80}%`,
          width: 8 + Math.random() * 8,
          height: 8 + Math.random() * 8,
          borderRadius: "50%",
          background: ["#a855f7", "#facc15", "#34d399", "#60a5fa"][i % 4],
          opacity: 0.18 + Math.random() * 0.5,
          animation: `confetti-float 3.5s ease-in-out ${
            i * 0.3
          }s infinite alternate`,
        }}
      />
    ))}
    <style>
      {`
        @keyframes confetti-float {
          0% { transform: translateY(0) scale(1);}
          100% { transform: translateY(-24px) scale(1.15);}
        }
      `}
    </style>
  </>
);

// Floating finance icons (smaller, more subtle)
const FloatingIcon = ({ Icon, style, color, delay }) => (
  <div
    className="absolute z-30"
    style={{
      ...style,
      color,
      opacity: 0.7,
      animation: `floatCoin 5s ease-in-out ${delay}s infinite alternate`,
      pointerEvents: "none",
    }}
  >
    <Icon size={22} />
  </div>
);

const TimelineStep = ({ icon, label }) => (
  <div className="flex items-center gap-3">
    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-700/60 text-white shadow">
      {icon}
    </div>
    <span className="text-purple-100 text-sm font-medium">{label}</span>
  </div>
);

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Animated background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-[#1e003c] via-[#2d0a5c] to-[#0f051d] animate-bg-move" />
        {/* Soft glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-purple-700/30 blur-3xl opacity-60 pointer-events-none" />
      </div>
      {/* Main content container */}
      <div className="relative z-10 flex w-full max-w-6xl min-h-[80vh] rounded-3xl shadow-2xl overflow-hidden bg-white/0 backdrop-blur-xl border border-purple-700/10">
        {/* Left: Auth Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 bg-white/10 backdrop-blur-2xl">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-purple-400 mb-8 drop-shadow-lg text-center tracking-tight">
              Expense Tracker
            </h2>
            {children}
          </div>
        </div>
        {/* Right: Hero/Info */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center relative bg-gradient-to-br from-purple-900/60 via-purple-700/40 to-yellow-200/10">
          {/* Card & Adventure centered and responsive */}
          <div
            className="relative z-20 flex flex-col items-center justify-center mx-auto"
            style={{
              width: "100%",
              maxWidth: "410px",
              minWidth: "0",
              margin: "0 auto",
              backdropFilter: "blur(18px)",
              background: "rgba(30, 0, 60, 0.44)",
              border: "2.5px solid rgba(168,85,247,0.18)",
              boxShadow:
                "0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 0 60px 10px rgba(168,85,247,0.10)",
              borderRadius: "32px",
              padding: "2.5rem 2rem 2rem 2rem",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GlassCreditCard />
            <div className="flex flex-col items-center gap-2 w-full">
              <AdventurePath />
              <h3
                className="text-2xl font-extrabold text-center mt-2 tracking-tight drop-shadow-lg"
                style={{
                  background:
                    "linear-gradient(90deg, #a855f7 20%, #facc15 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Your Financial Adventure Starts Here
              </h3>
              <p className="text-purple-100 text-center text-base font-semibold mb-2">
                The most beautiful way to master your money.
              </p>
              <div className="flex flex-col gap-4 mt-4 w-full">
                <TimelineStep
                  icon={<FaWallet />}
                  label="Track every expense & income"
                />
                <TimelineStep
                  icon={<FaChartLine />}
                  label="Visualize your progress"
                />
                <TimelineStep
                  icon={<FaPiggyBank />}
                  label="Grow your savings"
                />
                <TimelineStep icon={<FaCoins />} label="Achieve your goals" />
              </div>
            </div>
          </div>
          {/* SplineBot floating in the background */}
          {/*  <div
            className="absolute bottom-0 right-0 w-2/3 h-2/3 pointer-events-none z-0"
            style={{ minWidth: 220, minHeight: 220 }}
          >
            <SplineBot />
          </div> */}
        </div>
      </div>
      {/* Animated background keyframes */}
      <style>
        {`
          @keyframes bg-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-bg-move {
            background-size: 200% 200%;
            animation: bg-move 16s ease-in-out infinite;
          }
          @media (max-width: 1200px) {
            .max-w-6xl {
              max-width: 98vw !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AuthLayout;
