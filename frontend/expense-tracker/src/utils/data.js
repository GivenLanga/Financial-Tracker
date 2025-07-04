import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
} from "react-icons/lu";
import { FaChartLine, FaCoins, FaCalculator } from "react-icons/fa";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense",
  },

  {
    id: "06",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  "Food",
  "Utilities",
  "Entertainment",
  "Transport",
  "Health",
  "Shopping",
  "Other",
];
