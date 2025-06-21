import { useEffect, useState } from "react";
import { useFinanceStore } from "../store/useFinanceStore";
import type { Transaction } from "../lib/schemas";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { format } from "date-fns";
import {
  PlusIcon,
  Loader2Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  WalletIcon,
  Edit,
  Trash2,
} from "lucide-react";
import { Label } from "../components/ui/label";

type TransactionType = 'income' | 'expense';
type TransactionCategory =
  | 'salary'
  | 'investment'
  | 'other_income'
  | 'food'
  | 'transportation'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'healthcare'
  | 'other_expense';

const transactionCategories: Record<TransactionType, TransactionCategory[]> = {
  income: ["salary", "investment", "other_income"],
  expense: [
    "food",
    "transportation",
    "utilities",
    "entertainment",
    "shopping",
    "healthcare",
    "other_expense",
  ],
};

export default function FinancialManagement() {
  const {
    transactions,
    filteredTransactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getBalance,
    getIncomeTotal,
    getExpenseTotal,
  } = useFinanceStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingTransaction, setIsEditingTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    type: "expense" as TransactionType,
    category: "other_expense" as TransactionCategory,
    amount: 0,
    description: "",
    date: new Date().toISOString(),
  });

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddTransaction = async () => {
    setIsProcessing(true);
    try {
      await createTransaction({
        ...newTransaction,
      });
      setNewTransaction({
        type: "expense",
        category: "other_expense",
        amount: 0,
        description: "",
        date: new Date().toISOString(),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartEdit = (transaction: Transaction) => {
    setEditingTransaction({
      ...transaction,
      date: new Date(transaction.date).toISOString(),
    });
    setIsEditingTransaction(true);
  };

  const handleEditTransaction = async () => {
    if (!editingTransaction) return;
    setIsProcessing(true);
    try {
      await updateTransaction(editingTransaction.id, {
        type: editingTransaction.type,
        category: editingTransaction.category,
        amount: editingTransaction.amount,
        description: editingTransaction.description,
        date: editingTransaction.date,
      });
      setEditingTransaction(null);
      setIsEditingTransaction(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Financial Management
          </h2>
          <p className="text-muted-foreground">
            Track your income and expenses
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditingTransaction
                  ? "Edit Transaction"
                  : "Add New Transaction"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={isEditingTransaction ? editingTransaction?.type : newTransaction.type}
                    onValueChange={(value: TransactionType) => {
                      if (isEditingTransaction && editingTransaction) {
                        setEditingTransaction({
                          ...editingTransaction,
                          type: value,
                          category: transactionCategories[value][0],
                        });
                      } else {
                        setNewTransaction({
                          ...newTransaction,
                          type: value,
                          category: transactionCategories[value][0],
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={isEditingTransaction ? editingTransaction?.category : newTransaction.category}
                    onValueChange={(value: TransactionCategory) => {
                      if (isEditingTransaction && editingTransaction) {
                        setEditingTransaction({
                          ...editingTransaction,
                          category: value,
                        });
                      } else {
                        setNewTransaction({
                          ...newTransaction,
                          category: value,
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(isEditingTransaction
                        ? transactionCategories[editingTransaction?.type || "expense"]
                        : transactionCategories[newTransaction.type]
                      ).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <input
                  type="number"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={
                    isEditingTransaction
                      ? editingTransaction?.amount
                      : newTransaction.amount
                  }
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value);
                    if (isEditingTransaction && editingTransaction) {
                      setEditingTransaction({
                        ...editingTransaction,
                        amount,
                      });
                    } else {
                      setNewTransaction({
                        ...newTransaction,
                        amount,
                      });
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <input
                  type="text"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={
                    isEditingTransaction
                      ? editingTransaction?.description
                      : newTransaction.description
                  }
                  onChange={(e) => {
                    const description = e.target.value;
                    if (isEditingTransaction && editingTransaction) {
                      setEditingTransaction({
                        ...editingTransaction,
                        description,
                      });
                    } else {
                      setNewTransaction({
                        ...newTransaction,
                        description,
                      });
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="datetime-local"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={isEditingTransaction 
                    ? new Date(editingTransaction?.date || '').toISOString().slice(0, 16) 
                    : new Date(newTransaction.date).toISOString().slice(0, 16)}
                  onChange={(e) => {
                    const date = new Date(e.target.value).toISOString();
                    if (isEditingTransaction && editingTransaction) {
                      setEditingTransaction({
                        ...editingTransaction,
                        date,
                      });
                    } else {
                      setNewTransaction({
                        ...newTransaction,
                        date,
                      });
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditingTransaction(false);
                  setEditingTransaction(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  isEditingTransaction
                    ? handleEditTransaction
                    : handleAddTransaction
                }
                disabled={isProcessing}
              >
                {isProcessing && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditingTransaction ? "Save Changes" : "Add Transaction"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center gap-2">
            <WalletIcon className="h-4 w-4" />
            <h3 className="font-semibold">Balance</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(getBalance())}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="h-4 w-4 text-green-500" />
            <h3 className="font-semibold">Total Income</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-500">
            {formatCurrency(getIncomeTotal())}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingDownIcon className="h-4 w-4 text-red-500" />
            <h3 className="font-semibold">Total Expenses</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-500">
            {formatCurrency(getExpenseTotal())}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4">
          <h3 className="font-semibold">Recent Transactions</h3>
        </div>
        <div className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No transactions found
            </div>
          ) : (
            <div className="divide-y">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-full p-2 ${
                        transaction.type === "income"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpIcon
                          className="h-4 w-4 text-green-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <ArrowDownIcon
                          className="h-4 w-4 text-red-500"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(transaction.date), "PPP")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p
                      className={`text-sm font-medium ${
                        transaction.type === "income"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTransaction(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
