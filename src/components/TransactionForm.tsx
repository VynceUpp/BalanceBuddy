import { useState } from "react";
import { useAppContext } from "@/context/AppContext";

const categories = ['Food', 'Transport', 'Church', 'Entertainment', 'Shopping', 'Health', 'Education', 'Miscellaneous'];

const TransactionForm = () => {
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState(categories[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [fixed, setFixed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTransaction } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    
    setIsSubmitting(true);
    const finalCategory = customCategory || category;
    
    try {
      addTransaction({ amount, category: finalCategory, description, type, fixed });
      
      // Reset form with a slight delay for better UX
      setTimeout(() => {
        setAmount(0);
        setCategory(categories[0]);
        setCustomCategory("");
        setDescription("");
        setFixed(false);
        setIsSubmitting(false);
      }, 300);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const isFormValid = amount > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Add New Transaction</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type Toggle */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                type === 'expense'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>Expense</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                type === 'income'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>Income</span>
              </div>
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              KSh
            </span>
            <input
              type="number"
              value={amount || ""}
              onChange={e => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Fixed Expense Checkbox */}
        {type === 'expense' && (
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={fixed}
                  onChange={e => setFixed(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 border-2 rounded-md transition-all duration-200 ${
                  fixed 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300 hover:border-blue-500'
                }`}>
                  {fixed && (
                    <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                This is a fixed monthly expense
              </span>
            </label>
            {fixed && (
              <p className="text-xs text-blue-600 ml-9">
                Fixed expenses are automatically tracked for future months
              </p>
            )}
          </div>
        )}

        {/* Category Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white transition-all duration-200"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Custom Category */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Custom Category <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={customCategory}
            onChange={e => setCustomCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            placeholder="Enter custom category name"
          />
          {customCategory && (
            <p className="text-xs text-blue-600">
              Using custom category: "{customCategory}"
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
            placeholder="Add any additional details about this transaction..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 transform ${
            isFormValid && !isSubmitting
              ? `${type === 'expense' 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                } text-white shadow-lg hover:scale-105`
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Adding Transaction...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add {type === 'expense' ? 'Expense' : 'Income'}</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;