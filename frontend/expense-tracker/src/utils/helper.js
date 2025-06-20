import moment from "moment";

// Utility for formatting numbers with thousands separator

export function addThousandsSeparator(num) {
  if (num === null || num === undefined) return "0";
  const n = Number(num);
  if (isNaN(n)) return "0";
  return n.toLocaleString("en-ZA");
}

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    category: item?.category,
    amount: item?.amount,
  }));

  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount,
    source: item?.source,
  }));

  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount,
    category: item?.category,
  }));

  return chartData;
};

// --- Tax Helper Section ---

// 2024 South African tax brackets (monthly, for individuals under 65)
export const TAX_BRACKETS = [
  { upTo: 237100 / 12, rate: 0.18, base: 0, baseTax: 0 },
  { upTo: 370500 / 12, rate: 0.26, base: 237100 / 12, baseTax: 42678 / 12 },
  { upTo: 512800 / 12, rate: 0.31, base: 370500 / 12, baseTax: 77362 / 12 },
  { upTo: 673000 / 12, rate: 0.36, base: 512800 / 12, baseTax: 121475 / 12 },
  { upTo: 857900 / 12, rate: 0.39, base: 673000 / 12, baseTax: 179147 / 12 },
  { upTo: 1817000 / 12, rate: 0.41, base: 857900 / 12, baseTax: 251258 / 12 },
  { upTo: Infinity, rate: 0.45, base: 1817000 / 12, baseTax: 644489 / 12 },
];

export function calculateAnnualTax(income) {
  let tax = 0;
  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const { upTo, rate, base, baseTax } = TAX_BRACKETS[i];
    if (income <= upTo * 12) {
      tax = baseTax * 12 + (income - base * 12) * rate;
      break;
    }
  }
  tax = tax - 17235;
  return Math.max(0, tax);
}

export function calculateMonthlyTax(monthlyIncome) {
  const annualIncome = monthlyIncome * 12;
  const annualTax = calculateAnnualTax(annualIncome);
  return annualTax / 12;
}

// Helper to get tax estimate from transactions (like TaxQuest)
export function getTaxEstimateFromTransactions(transactions) {
  const incomeTx = transactions.filter((t) => t.type === "income");
  if (incomeTx.length === 0) return { monthly: 0, annual: 0, monthlyIncome: 0 };
  const months = new Set();
  incomeTx.forEach((t) => {
    if (t.date) {
      const d = new Date(t.date);
      months.add(`${d.getFullYear()}-${d.getMonth() + 1}`);
    }
  });
  const monthsWithIncome = months.size || 1;
  const totalIncome = incomeTx.reduce((sum, t) => sum + Number(t.amount), 0);
  const monthlyIncome = totalIncome / monthsWithIncome;
  const monthlyTax = calculateMonthlyTax(monthlyIncome);
  const annualTax = monthlyTax * 12;
  return {
    monthly: Math.round(monthlyTax),
    annual: Math.round(annualTax),
    monthlyIncome: Math.round(monthlyIncome),
  };
}
