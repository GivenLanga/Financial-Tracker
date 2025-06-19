import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { UserContext } from "../../context/UserContext";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div>
      <Navbar
        activeMenu={activeMenu}
        onMenuClick={() => setShowMobileMenu(true)}
      />

      {user && (
        <div className="flex">
          {/* Main content */}
          <div className="grow mx-5">{children}</div>
          {/* SideMenu on the right for desktop */}
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>
        </div>
      )}

      {/* Mobile SideMenu Drawer (right side) */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setShowMobileMenu(false)}
          />
          {/* Drawer */}
          <div className="ml-auto w-64 h-full bg-white shadow-lg animate-slide-in-right relative z-50">
            <button
              className="absolute top-3 right-3 text-gray-500 text-2xl"
              onClick={() => setShowMobileMenu(false)}
              aria-label="Close menu"
            >
              &times;
            </button>
            <SideMenu activeMenu={activeMenu} />
          </div>
        </div>
      )}

      {/* Responsive hamburger for mobile */}
      <style>
        {`
          @media (max-width: 1080px) {
            .max-\\[1080px\\]\\:hidden {
              display: none !important;
            }
          }
          @keyframes slide-in-right {
            from { transform: translateX(100%);}
            to { transform: translateX(0);}
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.25s cubic-bezier(.4,0,.2,1);
          }
        `}
      </style>
    </div>
  );
};

export default DashboardLayout;
