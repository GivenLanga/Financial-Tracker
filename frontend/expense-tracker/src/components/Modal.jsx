import React from "react";

// Glassy modal style
const glassModalStyle = {
  borderRadius: "32px",
  background:
    "linear-gradient(120deg, rgba(168,85,247,0.13) 0%, rgba(236,233,254,0.92) 60%, #fff 100%)",
  boxShadow:
    "0 12px 48px 0 rgba(109,40,217,0.18), 0 2px 16px 0 rgba(30,0,60,0.13), 0 0 0 3px rgba(168,85,247,0.13)",
  border: "2.5px solid rgba(168,85,247,0.13)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  position: "relative",
  overflow: "hidden",
  padding: 0,
};

const borderOverlay = {
  content: "''",
  position: "absolute",
  inset: 0,
  zIndex: 1,
  borderRadius: "32px",
  pointerEvents: "none",
  background:
    "conic-gradient(from 180deg at 50% 50%, #a855f7 0%, #facc15 50%, #a855f7 100%)",
  opacity: 0.11,
  filter: "blur(2.5px)",
  animation: "dashboard-card-border 6s linear infinite",
};

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/30 bg-opacity-60">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div style={glassModalStyle} className="relative">
          <div style={borderOverlay} />
          {/* Modal header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60"
            style={{
              background: "rgba(255,255,255,0.22)",
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              position: "relative",
              zIndex: 2,
            }}
          >
            <h3 className="text-lg font-semibold text-purple-800 tracking-tight">
              {title}
            </h3>
            <button
              type="button"
              className="text-purple-400 bg-transparent hover:bg-purple-100 hover:text-purple-700 rounded-full text-xl w-9 h-9 flex justify-center items-center transition"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          {/* Modal body */}
          <div className="p-6 md:p-8 space-y-4 relative z-10">{children}</div>
          <style>
            {`
              @keyframes dashboard-card-border {
                0% { filter: blur(2.5px) hue-rotate(0deg);}
                100% { filter: blur(2.5px) hue-rotate(360deg);}
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default Modal;
