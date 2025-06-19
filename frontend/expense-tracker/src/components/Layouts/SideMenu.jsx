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
      className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20 flex flex-col"
      style={{
        opacity: 0,
        transform: "translateX(32px)",
        transition: shouldAnimate
          ? "opacity 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1)"
          : "none",
      }}
    >
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageUrl ? (
          <img
            src={user?.profileImageUrl || ""}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        ) : (
          <CharAvatar
            fullName={user.fullName}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        )}

        <h5 className="text-gray-950 font-medium leading-6">
          {user.fullName || ""}
        </h5>
      </div>

      <div className="flex flex-col gap-1 flex-grow">
        {SIDE_MENU_DATA.filter(
          (item) => !["Logout", "Savings", "Goals"].includes(item.label)
        ).map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] transition-transform duration-200 side-menu-item ${
              activeMenu === item.label ? "side-menu-active" : ""
            } py-3 px-6 rounded-lg mb-1`}
            onClick={() => handleClick(item.path)}
            tabIndex={0}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}
        {/* Add unique menu items only once */}
        <button
          className={`w-full flex items-center gap-4 text-[15px] transition-transform duration-200 side-menu-item ${
            activeMenu === "Savings" ? "side-menu-active" : ""
          } py-3 px-6 rounded-lg mb-1`}
          onClick={() => handleClick("/savings")}
          tabIndex={0}
        >
          <FaPiggyBank className="text-xl" />
          Savings
        </button>
        <button
          className={`w-full flex items-center gap-4 text-[15px] transition-transform duration-200 side-menu-item ${
            activeMenu === "Goals" ? "side-menu-active" : ""
          } py-3 px-6 rounded-lg mb-1`}
          onClick={() => handleClick("/goals")}
          tabIndex={0}
        >
          <FaBullseye className="text-xl" />
          Goals
        </button>
        {/* Tax Quest Game Mode */}
        <button
          className={`w-full flex items-center gap-4 text-[15px] transition-transform duration-200 side-menu-item ${
            activeMenu === "Tax Quest" ? "side-menu-active" : ""
          } py-3 px-6 rounded-lg mb-1`}
          onClick={() => handleClick("/tax-quest")}
          tabIndex={0}
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
        } py-3 px-6 rounded-lg mb-1`}
        onClick={() => handleClick("logout")}
        tabIndex={0}
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
            background: transparent;
            color: #22223b;
            position: relative;
            overflow: hidden;
          }
          .side-menu-item:hover, .side-menu-item:focus {
            transform: scale(1.045);
            box-shadow: 0 2px 12px 0 rgba(168,85,247,0.10);
            z-index: 1;
            background: linear-gradient(90deg, #f3e7e9 0%, #e3eeff 100%);
            color: #3d1c5c;
          }
          .side-menu-active {
            background: linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%);
            color: #3d1c5c;
            box-shadow: 0 2px 16px 0 rgba(168,85,247,0.13);
            transition: background 0.4s cubic-bezier(.4,0,.2,1), color 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.4s cubic-bezier(.4,0,.2,1);
          }
        `}
      </style>
    </div>
  );
};

export default SideMenu;
