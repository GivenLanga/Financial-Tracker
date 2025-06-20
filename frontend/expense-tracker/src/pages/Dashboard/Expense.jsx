import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useSelector } from "react-redux";
import {
  FaPlus,
  FaTrashAlt,
  FaBell,
  FaRegCalendarAlt,
  FaRedo,
} from "react-icons/fa";
import moment from "moment";
import { addThousandsSeparator } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import ExpenseList from "../../components/Expense/ExpenseList";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import DeleteAlert from "../../components/DeleteAlert";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import CategoryManager from "../../components/Expense/CategoryManager";
import { DEFAULT_EXPENSE_CATEGORIES } from "../../utils/data";
import { useUserAuth } from "../../hooks/useUserAuth";

const Expense = () => {
  useUserAuth();

  const transactions = useSelector((state) => state.transactions.items || []);

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [editExpense, setEditExpense] = useState(null);

  const [categories, setCategories] = useState(DEFAULT_EXPENSE_CATEGORIES);

  // Subscription/Bill Management State
  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const saved = localStorage.getItem("subscriptions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newSub, setNewSub] = useState({
    name: "",
    price: "",
    nextDueDate: "",
    notes: "",
    recurring: false,
  });
  const [subError, setSubError] = useState("");

  useEffect(() => {
    fetchExpenseDetails();

    return () => {};
  }, []);

  useEffect(() => {
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  // Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon, notes } = expense;

    // Validation Checks
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
        notes,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Handle Edit Expense
  const handleEditExpense = async (expense) => {
    const { _id, category, amount, date, icon, notes } = expense;
    try {
      await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(_id), {
        category,
        amount,
        date,
        icon,
        notes,
      });
      setEditExpense(null);
      toast.success("Expense updated successfully");
      fetchExpenseDetails();
    } catch (error) {
      toast.error("Failed to update expense.");
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  // handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob",
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  // Recurring logic for detected subscriptions
  const getRecurringExpenses = (transactions) => {
    const recurring = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const key = (t.category || t.notes || "Other").toLowerCase();
        if (!recurring[key]) recurring[key] = [];
        recurring[key].push(t);
      });
    return Object.entries(recurring)
      .filter(([_, txs]) => txs.length >= 3)
      .map(([key, txs]) => {
        const sorted = [...txs].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        let isMonthly = true;
        for (let i = 1; i < sorted.length; i++) {
          const prev = moment(sorted[i - 1].date);
          const curr = moment(sorted[i].date);
          const diff = curr.diff(prev, "days");
          if (diff < 25 || diff > 35) {
            isMonthly = false;
            break;
          }
        }
        return isMonthly
          ? {
              name: key,
              lastAmount: sorted[sorted.length - 1].amount,
              lastDate: sorted[sorted.length - 1].date,
              count: sorted.length,
            }
          : null;
      })
      .filter(Boolean);
  };

  const getUpcomingBills = (subscriptions) => {
    const now = moment();
    return subscriptions.filter((sub) => {
      if (!sub.nextDueDate) return false;
      const due = moment(sub.nextDueDate);
      return due.isAfter(now) && due.diff(now, "days") <= 10;
    });
  };

  const recurring = getRecurringExpenses(transactions);
  const upcoming = getUpcomingBills(subscriptions);

  // Add subscription
  const handleAddSub = (e) => {
    e.preventDefault();
    setSubError("");
    if (!newSub.name || !newSub.price) {
      setSubError("Please enter a name and price.");
      return;
    }
    // Add to top so user sees it immediately
    setSubscriptions((subs) => [{ ...newSub, id: Date.now() }, ...subs]);
    setNewSub({
      name: "",
      price: "",
      nextDueDate: "",
      notes: "",
      recurring: false,
    });
  };

  // Delete subscription
  const handleDeleteSub = (id) => {
    setSubscriptions((subs) => subs.filter((s) => s.id !== id));
  };

  // --- UI ---
  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 w-full">
        {" "}
        {/* Changed mx-auto to w-full */}
        <div className="grid grid-cols-1 gap-6 w-full">
          {" "}
          {/* Added w-full */}
          <CategoryManager
            categories={categories}
            setCategories={setCategories}
          />
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>
          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
            onEdit={(expense) => setEditExpense(expense)}
          />
          <Modal
            isOpen={openAddExpenseModal}
            onClose={() => setOpenAddExpenseModal(false)}
            title="Add Expense"
          >
            <AddExpenseForm onAddExpense={handleAddExpense} />
          </Modal>
          <Modal
            isOpen={!!editExpense}
            onClose={() => setEditExpense(null)}
            title="Edit Expense"
          >
            <AddExpenseForm
              initialData={editExpense}
              onAddExpense={handleEditExpense}
              isEdit
            />
          </Modal>
          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure you want to delete this expense detail?"
              onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
          </Modal>
        </div>
        {/* Subscription and Bill Management */}
        <div className="mt-10 mb-8 w-full">
          <div className="flex items-center gap-2 mb-4">
            <FaRegCalendarAlt className="text-2xl text-primary" />
            <h3 className="text-xl font-bold text-primary tracking-tight">
              Subscriptions & Bills
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Add Subscription Form */}
            <form
              onSubmit={handleAddSub}
              className="bg-gradient-to-br from-purple-50 to-white border border-primary/10 rounded-2xl shadow-lg p-6 flex flex-col gap-4 md:w-1/2 w-full"
              style={{ minWidth: 0 }}
            >
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  className="border border-primary/20 rounded-lg px-4 py-2 text-sm flex-1 focus:ring-2 focus:ring-primary/30 min-w-0"
                  type="text"
                  placeholder="Subscription name"
                  value={newSub.name}
                  onChange={(e) =>
                    setNewSub((s) => ({ ...s, name: e.target.value }))
                  }
                  required
                />
                <input
                  className="border border-primary/20 rounded-lg px-4 py-2 text-sm w-32 focus:ring-2 focus:ring-primary/30 min-w-0"
                  type="number"
                  placeholder="Price"
                  value={newSub.price}
                  onChange={(e) =>
                    setNewSub((s) => ({ ...s, price: e.target.value }))
                  }
                  required
                  min={0}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  className="border border-primary/20 rounded-lg px-4 py-2 text-sm flex-1 focus:ring-2 focus:ring-primary/30 min-w-0"
                  type="date"
                  placeholder="Next due date"
                  value={newSub.nextDueDate}
                  onChange={(e) =>
                    setNewSub((s) => ({ ...s, nextDueDate: e.target.value }))
                  }
                />
                <input
                  className="border border-primary/20 rounded-lg px-4 py-2 text-sm flex-1 focus:ring-2 focus:ring-primary/30 min-w-0"
                  type="text"
                  placeholder="Notes (optional)"
                  value={newSub.notes}
                  onChange={(e) =>
                    setNewSub((s) => ({ ...s, notes: e.target.value }))
                  }
                />
                <label className="flex items-center gap-1 text-xs text-gray-600 ml-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={newSub.recurring}
                    onChange={(e) =>
                      setNewSub((s) => ({ ...s, recurring: e.target.checked }))
                    }
                    className="accent-primary"
                  />
                  <FaRedo className="text-xs" />
                  Recurring?
                </label>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold shadow hover:bg-purple-700 transition whitespace-nowrap"
                  title="Add subscription"
                >
                  <FaPlus />
                  Add
                </button>
              </div>
              {subError && (
                <div className="text-xs text-red-500 mt-1">{subError}</div>
              )}
            </form>

            {/* Subscriptions List */}
            <div className="bg-gradient-to-br from-white to-purple-50 border border-primary/10 rounded-2xl shadow-lg p-6 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <FaBell className="text-lg text-yellow-500" />
                <span className="font-semibold text-gray-700 text-base">
                  Your Subscriptions
                </span>
              </div>
              <ul className="space-y-3">
                {subscriptions.length === 0 && (
                  <li className="text-xs text-gray-400">
                    No subscriptions added yet.
                  </li>
                )}
                {subscriptions.map((sub) => (
                  <li
                    key={sub.id}
                    className="flex flex-wrap items-center gap-3 bg-white border border-primary/10 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
                  >
                    <span className="font-bold text-primary text-base">
                      {sub.name}
                    </span>
                    <span className="text-xs text-gray-700 ml-auto">
                      {sub.nextDueDate
                        ? `Due: ${moment(sub.nextDueDate).format("D MMM YYYY")}`
                        : "No due date"}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      R{addThousandsSeparator(sub.price)}
                    </span>
                    {sub.recurring && (
                      <span className="ml-2 text-xs text-primary font-semibold flex items-center gap-1">
                        <FaRedo /> Recurring
                      </span>
                    )}
                    {sub.notes && (
                      <span className="ml-2 text-xs text-gray-400 italic max-w-[120px] truncate">
                        {sub.notes}
                      </span>
                    )}
                    <button
                      className="ml-2 text-red-400 hover:text-red-600"
                      title="Remove subscription"
                      type="button"
                      onClick={() => handleDeleteSub(sub.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recurring Subscriptions Detected */}
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-2">
              <FaRegCalendarAlt className="text-lg text-primary" />
              <span className="font-semibold text-gray-700 text-base">
                Detected Recurring Subscriptions
              </span>
            </div>
            <ul className="space-y-2">
              {recurring.length === 0 && (
                <li className="text-xs text-gray-400">
                  No recurring subscriptions detected.
                </li>
              )}
              {recurring.map((rec) => (
                <li
                  key={rec.name}
                  className="flex items-center gap-3 bg-purple-50 border-l-4 border-primary/40 rounded px-3 py-2"
                >
                  <span className="font-bold text-primary">{rec.name}</span>
                  <span className="text-xs text-gray-700 ml-auto">
                    Last: {moment(rec.lastDate).format("D MMM YYYY")}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    R{addThousandsSeparator(rec.lastAmount)}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {rec.count} months
                  </span>
                  {rec.count >= 3 &&
                    moment().diff(moment(rec.lastDate), "months") >= 3 && (
                      <span className="ml-2 text-xs text-red-500 font-semibold">
                        Not used in 3+ months. Consider cancelling.
                      </span>
                    )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* ...rest of expense page... */}
      </div>
    </DashboardLayout>
  );
};

export default Expense;
