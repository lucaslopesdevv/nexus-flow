import { useEffect, useState } from 'react'
import {
  useFinanceStore,
  type Transaction,
  type TransactionType,
  type TransactionCategory,
} from '../store/useFinanceStore'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '../components/ui/dialog'
import { format } from 'date-fns'
import {
  PlusIcon,
  Loader2Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  WalletIcon,
} from 'lucide-react'

const transactionCategories: Record<TransactionType, TransactionCategory[]> = {
  income: ['salary', 'investment', 'other_income'],
  expense: [
    'food',
    'transportation',
    'utilities',
    'entertainment',
    'shopping',
    'healthcare',
    'other_expense',
  ],
}

export default function FinancialManagement() {
  const {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getBalance,
    getIncomeTotal,
    getExpenseTotal,
  } = useFinanceStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isEditingTransaction, setIsEditingTransaction] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as TransactionType,
    category: 'other_expense' as TransactionCategory,
    amount: 0,
    description: '',
    date: new Date(),
  })

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleAddTransaction = async () => {
    setIsProcessing(true)
    try {
      await addTransaction({
        ...newTransaction,
      })
      setNewTransaction({
        type: 'expense',
        category: 'other_expense',
        amount: 0,
        description: '',
        date: new Date(),
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStartEdit = (transaction: Transaction) => {
    setEditingTransaction({
      ...transaction,
      date: new Date(transaction.date),
    })
    setIsEditingTransaction(true)
  }

  const handleEditTransaction = async () => {
    if (!editingTransaction) return
    setIsProcessing(true)
    try {
      await updateTransaction(editingTransaction.id, {
        type: editingTransaction.type,
        category: editingTransaction.category,
        amount: editingTransaction.amount,
        description: editingTransaction.description,
        date: editingTransaction.date,
      })
      setEditingTransaction(null)
      setIsEditingTransaction(false)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
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
                {isEditingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTransaction.type}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        type: e.target.value as TransactionType,
                        category:
                          transactionCategories[e.target.value as TransactionType][0],
                      })
                    }
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTransaction.category}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        category: e.target.value as TransactionCategory,
                      })
                    }
                  >
                    {transactionCategories[newTransaction.type].map((category) => (
                      <option key={category} value={category}>
                        {category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={isEditingTransaction ? handleEditTransaction : handleAddTransaction}
                disabled={!newTransaction.amount || isProcessing}
              >
                {isProcessing && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditingTransaction ? 'Update Transaction' : 'Add Transaction'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center gap-2">
            <WalletIcon className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Current Balance</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(getBalance())}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Total Income</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-500">
            {formatCurrency(getIncomeTotal())}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingDownIcon className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold">Total Expenses</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-500">
            {formatCurrency(getExpenseTotal())}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="flex items-center gap-4">
              {transaction.type === 'income' ? (
                <ArrowUpIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-medium">
                  {transaction.description || transaction.category}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(transaction.date, 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p
                className={`text-lg font-bold ${
                  transaction.type === 'income'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteTransaction(transaction.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}