import React from "react";

const ModernGlassCard = ({
  children,
  className = "",
  style = {},
  clipPath = "polygon(0 12%, 12% 0, 88% 0, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0 88%, 0 12%, 10% 20%, 90% 20%, 90% 80%, 10% 80%, 0 88%)",
}) => (
  <div
    className={`relative overflow-hidden ${className}`}
    style={{
      borderRadius: "28px",
      background: "rgba(30, 0, 60, 0.55)",
      boxShadow:
        "0 8px 32px 0 rgba(109,40,217,0.10), 0 0 60px 10px rgba(168,85,247,0.08)",
      border: "2.5px solid transparent",
      clipPath,
      ...style,
    }}
  >
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        borderRadius: "28px",
        background:
          "conic-gradient(from 180deg at 50% 50%, #a855f7 0%, #facc15 50%, #a855f7 100%)",
        filter: "blur(2px)",
        opacity: 0.25,
        zIndex: 1,
      }}
    />
    <div className="relative z-10 p-6">{children}</div>
  </div>
);

export default ModernGlassCard;
