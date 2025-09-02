<xaiArtifact artifact_id="cbaed43b-436d-454b-8a2f-ef7a705aaf65" artifact_version_id="1b9d12d8-c4ae-404b-b524-30b877907b02" title="README.md" contentType="text/markdown">

# My Balance Buddy

A simple, responsive financial planning web application built with Next.js and TypeScript to help users manage their money by tracking their balance, fixed expenses, and flexible spending budget. It also provides financial tips if the user is projected to face a deficit in the next month.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Onboarding**: Guides users to input their starting balance, fixed monthly income, fixed expenses, and weekly savings goal.
- **Dashboard**: Displays current balance, upcoming fixed costs, net income/deficit, and available flexible spending (daily/weekly breakdown).
- **Transaction Logging**: Easy form to log income or expenses, with options for fixed/flexible costs and custom categories.
- **Transaction History**: View, filter, edit, or delete past transactions.
- **Alerts**: Low balance warnings and reminders for upcoming bills.
- **Financial Tips**: Suggests best practices (e.g., cutting expenses, increasing income) if a monthly deficit is detected.
- **Responsive Design**: Optimized for mobile and desktop use with a clean, encouraging interface.

## Tech Stack
- **Next.js**: React framework for server-side rendering and static site generation.
- **TypeScript**: Adds type safety to JavaScript.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **date-fns**: For date manipulation and formatting.
- **uuid**: For generating unique IDs for transactions and financial entries.
- **React Context**: Manages global state for financial data.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/VynceUpp/BalanceBuddy.git
   cd my-balance-buddy
   ```

2. **Install Dependencies**:
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Install Additional Packages**:
   ```bash
   npm install date-fns uuid @types/uuid
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Usage
1. **Onboarding**:
   - On first visit, complete the setup by entering your starting balance, fixed incomes, fixed expenses, and savings goal.
   - Navigate through the steps and click "Finish Setup" to proceed to the dashboard.

2. **Dashboard**:
   - View your current balance and flexible spending budget.
   - Mark fixed expenses as paid or incomes as received.
   - Add to savings or log new transactions.
   - If a deficit is detected (fixed expenses exceed income), see tailored financial tips.

3. **Transactions**:
   - Log transactions via the form, specifying amount, category, type (income/expense), and whether it’s fixed.
   - View, filter, edit, or delete transactions in the history section.

4. **Alerts**:
   - Get warnings if flexible spending drops below KSh 500.
   - Receive reminders for upcoming fixed expenses 3 days before their due date.

## File Structure
```
my-balance-buddy
├── .gitignore
├── README.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── onboarding
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── Dashboard.tsx
│   │   ├── TransactionForm.tsx
│   │   └── TransactionHistory.tsx
│   └── context
│       └── AppContext.tsx
└── tsconfig.json

```

## How It Works
- **State Management**: Uses React Context (`AppContext.tsx`) to store and manage financial data (balance, incomes, expenses, transactions) in local storage.
- **Onboarding**: Guides users through a 5-step process to set up their financial profile, saved in the browser.
- **Dashboard**: Calculates and displays:
  - Current balance.
  - Net fixed income/deficit (income - expenses).
  - Flexible spending (balance - remaining expenses - savings goal).
  - Daily/weekly spending suggestions based on days left in the month.
- **Deficit Tips**: If fixed expenses exceed income, a section appears with practical financial advice (e.g., cut expenses, increase income).
- **Transactions**: Logs transactions and updates balance in real-time, with the system learning fixed expenses for future calculations.
- **Responsive UI**: Built with Tailwind CSS for a clean, mobile-friendly interface.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please ensure your code follows the existing TypeScript and Tailwind CSS conventions.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

</xaiArtifact>