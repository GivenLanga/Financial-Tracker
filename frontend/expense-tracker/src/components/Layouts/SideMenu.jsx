import React, { useContext, useEffect, useRef, useState } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import CharAvatar from "../Cards/CharAvatar";
import { FaPiggyBank, FaBullseye } from "react-icons/fa";
import { GiTreasureMap } from "react-icons/gi";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const menuRef = useRef();
  const [shouldAnimate] = useState(() => {
    return !sessionStorage.getItem("sidebarAnimated");
  });

  // Mouse-following line state
  const lineRef = useRef();
  useEffect(() => {
    const handleMove = (e) => {
      if (!lineRef.current) return;
      // Get mouse X relative to the sidebar
      const sidebar = menuRef.current;
      if (!sidebar) return;
      const rect = sidebar.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      // Animate the line's left position
      lineRef.current.style.left = `${x - 40}px`;
    };
    // Only listen when sidebar is visible
    menuRef.current?.addEventListener("mousemove", handleMove);
    return () => {
      menuRef.current?.removeEventListener("mousemove", handleMove);
    };
  }, []);

  useEffect(() => {
    if (menuRef.current && shouldAnimate) {
      menuRef.current.style.opacity = 1;
      menuRef.current.style.transform = "translateX(0)";
      sessionStorage.setItem("sidebarAnimated", "1");
    } else if (menuRef.current) {
      menuRef.current.style.opacity = 1;
      menuRef.current.style.transform = "translateX(0)";
      menuRef.current.style.transition = "none";
    }
    // eslint-disable-next-line
  }, []);

  const handleClick = (route) => {
    if (route === "logout") {
      handelLogout();
      return;
    }
    navigate(route);
  };

  const handelLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
    sessionStorage.removeItem("sidebarAnimated");
  };

  return (
    <div
      ref={menuRef}
      className="w-64 h-[calc(100vh-61px)] sticky top-[61px] z-20 flex flex-col"
      style={{
        opacity: 0,
        transform: "translateX(32px)",
        transition: shouldAnimate
          ? "opacity 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1)"
          : "none",
        // Glassy background
        background: "rgba(255,255,255,0.72)",
        boxShadow:
          "0 8px 32px 0 rgba(109,40,217,0.13), 0 2px 16px 0 rgba(30,0,60,0.10), 0 0 0 2.5px rgba(168,85,247,0.12)",
        border: "2.5px solid rgba(168,85,247,0.13)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderRadius: "28px",
        overflow: "hidden",
      }}
    >
      {/* Decorative border overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "28px",
          background:
            "conic-gradient(from 180deg at 50% 50%, #a855f7 0%, #facc15 50%, #a855f7 100%)",
          filter: "blur(2.5px)",
          opacity: 0.13,
          zIndex: 1,
        }}
      />
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7 relative z-10">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
            boxShadow: "0 4px 24px 0 rgba(168,85,247,0.10)",
            border: "2.5px solid #a855f7",
            width: 80,
            height: 80,
          }}
        >
          {user?.profileImageUrl ? (
            <img
              src={user?.profileImageUrl || ""}
              alt="Profile Image"
              className="w-20 h-20 bg-slate-400 rounded-full"
              style={{
                border: "2.5px solid #a855f7",
                boxShadow: "0 2px 8px 0 rgba(168,85,247,0.10)",
              }}
            />
          ) : (
            <CharAvatar
              fullName={user.fullName}
              width="w-20"
              height="h-20"
              style="text-xl"
            />
          )}
        </div>
        <h5 className="text-gray-950 font-medium leading-6">
          {user.fullName || ""}
        </h5>
      </div>

      <div className="flex flex-col gap-1 flex-grow relative z-10">
        {SIDE_MENU_DATA.filter(
          (item) => !["Logout", "Savings", "Goals"].includes(item.label)
        ).map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] transition-transform duration-200 side-menu-item ${
              activeMenu === item.label ? "side-menu-active" : ""
            } py-3 px-6 rounded-xl mb-1`}
            onClick={() => handleClick(item.path)}
            tabIndex={0}
            style={{
              background:
                activeMenu === item.label
                  ? "linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)"
                  : "rgba(255,255,255,0.55)",
              color: activeMenu === item.label ? "#3d1c5c" : "#22223b",
              boxShadow:
                activeMenu === item.label
                  ? "0 2px 16px 0 rgba(168,85,247,0.13)"
                  : "0 1px 4px 0 rgba(168,85,247,0.06)",
              border: "1.5px solid rgba(168,85,247,0.10)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}
        {/* Savings menu item */}
        <button
          className={`w-full flex items-center gap-4 text-[15px] transition-transform duration-200 side-menu-item ${
            activeMenu === "Savings" ? "side-menu-active" : ""
          } py-3 px-6 rounded-xl mb-1`}
          onClick={() => handleClick("/savings")}
          tabIndex={0}
          style={{
            background:
              activeMenu === "Savings"
                ? "linear-gradient(90deg, #f8fafc 0%, #dbeafe 100%)"
                : "rgba(255,255,255,0.55)",
            color: activeMenu === "Savings" ? "#a855f7" : "#22223b",
            boxShadow:
              activeMenu === "Savings"
                ? "0 2px 16px 0 rgba(168,85,247,0.13)"
                : "0 1px 4px 0 rgba(168,85,247,0.06)",
            border: "1.5px solid rgba(168,85,247,0.10)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <FaPiggyBank className="text-xl" />
          Savings
        </button>
        <button
          className={`w-full flex items-center gap-4 text-[15px] transition-transform duration-200 side-menu-item ${
            activeMenu === "Goals" ? "side-menu-active" : ""
          } py-3 px-6 rounded-xl mb-1`}
          onClick={() => handleClick("/goals")}
          tabIndex={0}
          style={{
            background:
              activeMenu === "Goals"
                ? "linear-gradient(90deg, #fff1f2 0%, #ffe4e6 100%)"
                : "rgba(255,255,255,0.55)",
            color: activeMenu === "Goals" ? "#ef4444" : "#22223b",
            boxShadow:
              activeMenu === "Goals"
                ? "0 2px 16px 0 rgba(239,68,68,0.13)"
                : "0 1px 4px 0 rgba(168,85,247,0.06)",
            border: "1.5px solid rgba(239,68,68,0.10)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <FaBullseye className="text-xl" />
          Goals
        </button>
        <button
          className={`w-full flex items-center gap-4 text-[15px] transition-transform duration-200 side-menu-item ${
            activeMenu === "Tax Quest" ? "side-menu-active" : ""
          } py-3 px-6 rounded-xl mb-1`}
          onClick={() => handleClick("/tax-quest")}
          tabIndex={0}
          style={{
            background:
              activeMenu === "Tax Quest"
                ? "linear-gradient(90deg, #facc15 0%, #f8fafc 100%)"
                : "rgba(255,255,255,0.55)",
            color: activeMenu === "Tax Quest" ? "#facc15" : "#22223b",
            boxShadow:
              activeMenu === "Tax Quest"
                ? "0 2px 16px 0 rgba(250,204,21,0.13)"
                : "0 1px 4px 0 rgba(168,85,247,0.06)",
            border: "1.5px solid rgba(250,204,21,0.10)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <GiTreasureMap className="text-xl text-yellow-600" />
          Taxation
        </button>
      </div>

      {/* Logout button at the end */}
      <div className="flex-grow" />
      <button
        className={`w-full flex items-center gap-4 text-[15px] transition-transform duration-200 side-menu-item ${
          activeMenu === "Logout" ? "side-menu-active" : ""
        } py-3 px-6 rounded-xl mb-1 relative z-10`}
        onClick={() => handleClick("logout")}
        tabIndex={0}
        style={{
          background:
            activeMenu === "Logout"
              ? "linear-gradient(90deg, #f8fafc 0%, #dbeafe 100%)"
              : "rgba(255,255,255,0.55)",
          color: activeMenu === "Logout" ? "#a855f7" : "#22223b",
          boxShadow:
            activeMenu === "Logout"
              ? "0 2px 16px 0 rgba(168,85,247,0.13)"
              : "0 1px 4px 0 rgba(168,85,247,0.06)",
          border: "1.5px solid rgba(168,85,247,0.10)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        {(() => {
          const LogoutIcon = SIDE_MENU_DATA.find(
            (item) => item.label === "Logout"
          )?.icon;
          return LogoutIcon ? <LogoutIcon className="text-xl" /> : null;
        })()}
        Logout
      </button>
      {/* Animation styles */}
      <style>
        {`
          .side-menu-item {
            will-change: transform, background, box-shadow;
            position: relative;
            overflow: hidden;
            font-weight: 500;
            letter-spacing: 0.01em;
            transition: background 0.3s, color 0.3s, box-shadow 0.3s, transform 0.2s;
          }
          .side-menu-item:hover, .side-menu-item:focus {
            transform: scale(1.045);
            box-shadow: 0 4px 24px 0 rgba(168,85,247,0.13);
            z-index: 2;
            background: linear-gradient(90deg, #f3e7e9 0%, #e3eeff 100%);
            color: #a855f7 !important;
          }
          .side-menu-active {
            background: linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%) !important;
            color: #3d1c5c !important;
            box-shadow: 0 2px 16px 0 rgba(168,85,247,0.13);
          }
        `}
      </style>
    </div>
  );
};

export default SideMenu;
