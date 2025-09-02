import { useState } from "react";
import { Transaction, useAppContext } from "@/context/AppContext";
import { format } from "date-fns";

const TransactionHistory = () => {
  const { state, editTransaction, deleteTransaction } = useAppContext();
  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  const filteredTransactions = state.transactions.filter((t) => {
    const dateMatch =
      !filterDate || format(t.date, "yyyy-MM-dd") === filterDate;
    const catMatch =
      !filterCategory ||
      t.category.toLowerCase().includes(filterCategory.toLowerCase());
    return dateMatch && catMatch;
  });

  const startEditing = (t: Transaction) => {
    setEditingId(t.id);
    setEditForm(t);
  };

  const saveEdit = () => {
    if (editingId) {
      editTransaction(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 0V4m0 0l-2 2m2-2l2 2M4 12c0-1.657.895-3 2-3s2 1.343 2 3-1.343 3-2 3-2-1.343-2-3zm16 0c0-1.657-.895-3-2-3s-2 1.343-2 3 1.343 3 2 3 2-1.343 2-3z"
          />
        </svg>
        <span>Transaction History</span>
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <input
          type="text"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          placeholder="Filter by category"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            No transactions found for selected filters.
          </p>
        ) : (
          filteredTransactions.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl shadow-md p-5 flex justify-between items-start"
            >
              {editingId === t.id ? (
                <div className="w-full space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          amount: parseFloat(e.target.value),
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <select
                      value={editForm.type}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          type: e.target.value as "income" | "expense",
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Transaction details */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {format(t.date, "yyyy-MM-dd")}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      KSh {t.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-700">
                      {t.category}{" "}
                      {t.fixed && (
                        <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">
                          Fixed
                        </span>
                      )}
                    </p>
                    {t.description && (
                      <p className="text-sm text-gray-500 italic mt-1">
                        {t.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        t.type === "income"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {t.type}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(t)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
