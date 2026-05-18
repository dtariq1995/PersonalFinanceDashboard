export interface Rule {
  id: number;
  name: string;
  merchant: string;
  categoryId: number | null;
  category: Category | null;
}

// The data shape of a category, matching the backend model
export interface Category {
  id: number;
  name: string;
  type: string; // "Income" or "Expense"
}

// The data shape of a transaction, matching the backend model
export interface Transaction {
  id: number;
  merchant: string;
  amount: number;
  date: string; // ISO format date string
  categoryId: number | null; // Category can be null if not categorized yet
  category?: Category | null;
}