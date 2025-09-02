import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import {
  format,
  endOfMonth,
  differenceInDays,
  addDays,
  isWithinInterval,
} from "date-fns";
import TransactionForm from "./TransactionForm";
import TransactionHistory from "./TransactionHistory";

const Dashboard = () => {
  const { state, markIncomeReceived, markExpensePaid, addToSavings } =
    useAppContext();
  const [savingsAmount, setSavingsAmount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const currentDate = new Date();
  const daysLeftInMonth =
    differenceInDays(endOfMonth(currentDate), currentDate) + 1;
  const weeksLeftInMonth = daysLeftInMonth / 7;

  const totalFixedIncome = state.fixedIncomes.reduce(
    (sum, inc) => sum + inc.amount,
    0
  );
  const totalFixedExpense = state.fixedExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );
  const netFixed = totalFixedIncome - totalFixedExpense;

  const remainingFixedExpenses = state.fixedExpenses
    .filter((exp) => !exp.paid)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const monthlySavingsGoal = state.savingsGoalWeekly * 4; // Approximate 4 weeks
  const remainingSavings = monthlySavingsGoal - state.savedThisMonth;

  const flexibleSpending =
    state.balance - remainingFixedExpenses - remainingSavings;
  const perDay = flexibleSpending / daysLeftInMonth;
  const perWeek = flexibleSpending / weeksLeftInMonth;

  const lowBalance = flexibleSpending < 500;

  const getUpcomingBills = () => {
    return state.fixedExpenses
      .filter((exp) => !exp.paid)
      .sort((a, b) => a.dueDay - b.dueDay);
  };

  const checkReminder = (dueDay: number) => {
    const dueDateThisMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dueDay
    );
    const threeDaysBefore = addDays(dueDateThisMonth, -3);
    return isWithinInterval(currentDate, {
      start: threeDaysBefore,
      end: dueDateThisMonth,
    });
  };

  const handleAddToSavings = () => {
    if (savingsAmount > 0) {
      addToSavings(savingsAmount);
      setSavingsAmount(0);
    }
  };

  const savingsProgress = (state.savedThisMonth / monthlySavingsGoal) * 100;
  const balanceColor =
    state.balance > 1000
      ? "text-green-600"
      : state.balance > 500
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Balance Buddy
              </h1>
              <p className="text-gray-600 mt-1">
                {format(currentDate, "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Days left in month</p>
              <p className="text-2xl font-bold text-blue-600">
                {daysLeftInMonth}
              </p>
            </div>
          </div>
        </div>

        {/* Low Balance Warning */}
        {lowBalance && (
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center">
              <svg
                className="w-8 h-8 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <h3 className="font-bold text-lg">Low Balance Alert</h3>
                <p>
                  Your flexible spending is low (KSh{" "}
                  {flexibleSpending.toFixed(2)}). Consider reviewing your
                  expenses.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-lg">Current Balance</p>
              <p className="text-4xl font-bold">
                KSh {state.balance.toLocaleString()}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flexible Spending */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Flexible Spending</h3>
              <div className="bg-green-100 p-2 rounded-full">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              KSh {flexibleSpending.toFixed(0)}
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>KSh {perDay.toFixed(0)} per day</p>
              <p>KSh {perWeek.toFixed(0)} per week</p>
            </div>
          </div>

          {/* Net Fixed */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Net Fixed</h3>
              <div
                className={`p-2 rounded-full ${
                  netFixed >= 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    netFixed >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
            <p
              className={`text-2xl font-bold mb-2 ${
                netFixed >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              KSh {netFixed.toFixed(0)}
            </p>
            <p className="text-sm text-gray-600">
              {netFixed < 0 ? "Monthly Deficit" : "Monthly Surplus"}
            </p>
          </div>

          {/* Remaining Expenses */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Pending Bills</h3>
              <div className="bg-orange-100 p-2 rounded-full">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              KSh {remainingFixedExpenses.toFixed(0)}
            </p>
            <p className="text-sm text-gray-600">
              {getUpcomingBills().length} bills pending
            </p>
          </div>
        </div>

        {/* Upcoming Bills */}
        {getUpcomingBills().length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Upcoming Bills
              </h2>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {getUpcomingBills().length} pending
              </span>
            </div>
            <div className="space-y-3">
              {getUpcomingBills().map((exp) => (
                <div
                  key={exp.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                    checkReminder(exp.dueDay)
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        checkReminder(exp.dueDay)
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {exp.dueDay}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {exp.name}
                      </h3>
                      <p className="text-gray-600">
                        KSh {exp.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {checkReminder(exp.dueDay) && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Due Soon!
                      </span>
                    )}
                    <button
                      onClick={() => markExpensePaid(exp.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Mark Paid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Savings Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Savings Progress
            </h2>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                KSh {state.savedThisMonth.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                of KSh {monthlySavingsGoal.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Monthly Goal Progress
              </span>
              <span className="text-sm text-gray-500">
                {Math.min(savingsProgress, 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(savingsProgress, 100)}%` }}
              />
            </div>
          </div>

          {/* Add to Savings */}
          <div className="bg-green-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add to Savings
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  KSh
                </span>
                <input
                  type="number"
                  value={savingsAmount || ""}
                  onChange={(e) =>
                    setSavingsAmount(parseFloat(e.target.value) || 0)
                  }
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="100"
                  min="0"
                />
              </div>
              <button
                onClick={handleAddToSavings}
                disabled={savingsAmount <= 0}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowTransactionForm(!showTransactionForm)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>{showTransactionForm ? "Hide" : "Add"} Transaction</span>
            </div>
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{showHistory ? "Hide" : "View"} History</span>
            </div>
          </button>
        </div>

        {/* Transaction Form Modal */}
        {showTransactionForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm min-h:screen"
              onClick={() => setShowTransactionForm(false)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 pt-0 z-10">
              {/* Sticky Header */}
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-20 py-3 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  Add Transaction
                </h2>
                <button
                  onClick={() => setShowTransactionForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Scrollable form content */}
              <div className="pb-4">
                <TransactionForm />
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        {showHistory && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Transaction History
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <TransactionHistory />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
