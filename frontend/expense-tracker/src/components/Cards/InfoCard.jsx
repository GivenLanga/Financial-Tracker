import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div
      className="flex gap-6 bg-white p-6 rounded-2xl border border-gray-200/50 transition-transform duration-300"
      style={{
        boxShadow:
          "0 8px 32px 0 rgba(109,40,217,0.18), 0 1.5px 8px 0 rgba(255,255,255,0.08) inset, 0 2px 16px 0 rgba(30,0,60,0.10)",
        transform:
          "perspective(900px) rotateY(-6deg) rotateX(3deg) scale3d(1.01,1.01,1)",
        background: "rgba(255,255,255,0.92)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "perspective(900px) rotateY(-2deg) rotateX(1deg) scale3d(1.03,1.03,1)";
        e.currentTarget.style.boxShadow =
          "0 16px 48px 0 rgba(109,40,217,0.22), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset, 0 4px 24px 0 rgba(30,0,60,0.13)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "perspective(900px) rotateY(-6deg) rotateX(3deg) scale3d(1.01,1.01,1)";
        e.currentTarget.style.boxShadow =
          "0 8px 32px 0 rgba(109,40,217,0.18), 0 1.5px 8px 0 rgba(255,255,255,0.08) inset, 0 2px 16px 0 rgba(30,0,60,0.10)";
      }}
    >
      <div
        className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}
        style={{
          boxShadow:
            "0 4px 16px 0 rgba(168,85,247,0.18), 0 1.5px 8px 0 rgba(255,255,255,0.10) inset",
        }}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-sm text-gray-500 mb-1">{label}</h6>
        <span className="text-[22px]">R{value}</span>
      </div>
    </div>
  );
};

export default InfoCard;
