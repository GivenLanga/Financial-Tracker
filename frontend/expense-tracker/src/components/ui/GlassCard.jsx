import React from "react";

const GlassCard = ({
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
        "0 8px 32px 0 rgba(109,40,217,0.18), 0 0 60px 10px rgba(168,85,247,0.10), 0 1.5px 8px 0 rgba(255,255,255,0.08) inset",
      border: "2.5px solid transparent",
      clipPath,
      // 3D effect
      transform:
        "perspective(900px) rotateY(-6deg) rotateX(3deg) scale3d(1.01,1.01,1)",
      transition: "transform 0.3s cubic-bezier(.4,0,.2,1), box-shadow 0.3s",
      ...style,
    }}
  >
    {/* 3D highlight overlay */}
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        borderRadius: "28px",
        background:
          "conic-gradient(from 180deg at 50% 50%, #a855f7 0%, #facc15 50%, #a855f7 100%)",
        filter: "blur(2px)",
        opacity: 0.35,
        zIndex: 1,
      }}
    />
    <div
      className="absolute left-0 top-0 w-full h-1/3 pointer-events-none"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 100%)",
        borderRadius: "28px 28px 0 0",
        zIndex: 2,
      }}
    />
    <div className="relative z-10 p-6">{children}</div>
  </div>
);

export default GlassCard;
