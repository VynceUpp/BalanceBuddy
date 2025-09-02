"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FixedExpense, FixedIncome, useAppContext } from "@/context/AppContext";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [startingBalance, setStartingBalance] = useState("");
  const [fixedIncomes, setFixedIncomes] = useState<Omit<FixedIncome, 'id' | 'received'>[]>([]);
  const [currentIncome, setCurrentIncome] = useState({ name: "", amount: 0, dueDay: 1 });
  const [fixedExpenses, setFixedExpenses] = useState<Omit<FixedExpense, 'id' | 'paid'>[]>([]);
  const [currentExpense, setCurrentExpense] = useState({ name: "", amount: 0, dueDay: 1 });
  const [savingsGoal, setSavingsGoal] = useState("");
  const { setInitialBalance, addFixedIncome, addFixedExpense, setSavingsGoalWeekly, setOnboardingComplete } = useAppContext();
  const router = useRouter();

  const totalSteps = 5;

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleAddIncome = () => {
    if (currentIncome.name && currentIncome.amount > 0) {
      setFixedIncomes([...fixedIncomes, currentIncome]);
      setCurrentIncome({ name: "", amount: 0, dueDay: 1 });
    }
  };

  const handleRemoveIncome = (index: number) => {
    setFixedIncomes(fixedIncomes.filter((_, i) => i !== index));
  };

  const handleAddExpense = () => {
    if (currentExpense.name && currentExpense.amount > 0) {
      setFixedExpenses([...fixedExpenses, currentExpense]);
      setCurrentExpense({ name: "", amount: 0, dueDay: 1 });
    }
  };

  const handleRemoveExpense = (index: number) => {
    setFixedExpenses(fixedExpenses.filter((_, i) => i !== index));
  };

  const finishOnboarding = () => {
    setInitialBalance(parseFloat(startingBalance) || 0);
    fixedIncomes.forEach(addFixedIncome);
    fixedExpenses.forEach(addFixedExpense);
    setSavingsGoalWeekly(parseFloat(savingsGoal) || 0);
    setOnboardingComplete(true);
    router.push("/");
  };

  const isStepValid = () => {
    switch (step) {
      case 2: return startingBalance !== "";
      case 5: return savingsGoal !== "";
      default: return true;
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Step {step} of {totalSteps}</span>
        <span className="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to My Balance Buddy</h1>
              <p className="text-lg text-gray-600">Let's set up your personalized financial plan in just a few quick steps.</p>
            </div>
            <button 
              onClick={nextStep} 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Starting Balance</h2>
              <p className="text-gray-600">What's your current account balance?</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    KSh
                  </span>
                  <input
                    type="number"
                    value={startingBalance}
                    onChange={e => setStartingBalance(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="12,500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={prevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                Back
              </button>
              <button 
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Monthly Income</h2>
              <p className="text-gray-600">Add your regular income sources</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Income Source</label>
                  <input
                    type="text"
                    placeholder="e.g., Salary, From Mom, Side Job"
                    value={currentIncome.name}
                    onChange={e => setCurrentIncome({ ...currentIncome, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KSh)</label>
                    <input
                      type="number"
                      placeholder="5,000"
                      value={currentIncome.amount || ""}
                      onChange={e => setCurrentIncome({ ...currentIncome, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day of Month</label>
                    <input
                      type="number"
                      placeholder="15"
                      value={currentIncome.dueDay}
                      onChange={e => setCurrentIncome({ ...currentIncome, dueDay: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      min="1"
                      max="31"
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={handleAddIncome}
                disabled={!currentIncome.name || currentIncome.amount <= 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                Add Income Source
              </button>
            </div>

            {fixedIncomes.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Your Income Sources:</h3>
                {fixedIncomes.map((inc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">{inc.name}</p>
                      <p className="text-green-700">KSh {inc.amount.toLocaleString()} on day {inc.dueDay}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveIncome(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button 
                onClick={prevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                Back
              </button>
              <button 
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Monthly Expenses</h2>
              <p className="text-gray-600">Add your regular monthly expenses</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expense Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Rent, Phone Bill, Transport"
                    value={currentExpense.name}
                    onChange={e => setCurrentExpense({ ...currentExpense, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KSh)</label>
                    <input
                      type="number"
                      placeholder="1,500"
                      value={currentExpense.amount || ""}
                      onChange={e => setCurrentExpense({ ...currentExpense, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Day</label>
                    <input
                      type="number"
                      placeholder="1"
                      value={currentExpense.dueDay}
                      onChange={e => setCurrentExpense({ ...currentExpense, dueDay: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      min="1"
                      max="31"
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={handleAddExpense}
                disabled={!currentExpense.name || currentExpense.amount <= 0}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                Add Expense
              </button>
            </div>

            {fixedExpenses.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Your Monthly Expenses:</h3>
                {fixedExpenses.map((exp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <p className="font-medium text-red-900">{exp.name}</p>
                      <p className="text-red-700">KSh {exp.amount.toLocaleString()} on day {exp.dueDay}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveExpense(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button 
                onClick={prevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                Back
              </button>
              <button 
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Savings Goal</h2>
              <p className="text-gray-600">How much do you want to save each week?</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Savings Target
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    KSh
                  </span>
                  <input
                    type="number"
                    value={savingsGoal}
                    onChange={e => setSavingsGoal(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="100"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  This equals KSh {savingsGoal ? (parseFloat(savingsGoal) * 4.33).toFixed(0) : '0'} per month
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button 
                onClick={prevStep}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                Back
              </button>
              <button 
                onClick={finishOnboarding}
                disabled={!isStepValid()}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Complete Setup
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step > 1 && renderProgressBar()}
          {renderStep()}
        </div>
      </div>
    </div>
  );
}