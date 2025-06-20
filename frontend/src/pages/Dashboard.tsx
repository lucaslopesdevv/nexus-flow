import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTaskStore } from '../store/useTaskStore'
import { useInventoryStore } from '../store/useInventoryStore'
import { useFinanceStore } from '../store/useFinanceStore'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import {
  CheckCircle2,
  Package,
  Wallet,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import type { Inventory } from '../lib/schemas'

export default function Dashboard() {
  const { tasks, fetchTasks } = useTaskStore()
  const { inventory, fetchInventory } = useInventoryStore()
  const { transactions, fetchTransactions } = useFinanceStore()

  useEffect(() => {
    fetchTasks()
    fetchInventory()
    fetchTransactions()
  }, [fetchTasks, fetchInventory, fetchTransactions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const stats = [
    {
      title: 'Tasks',
      value: tasks.length,
      details: {
        todo: tasks.filter(t => t.status === 'TODO').length,
        inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        done: tasks.filter(t => t.status === 'DONE').length
      },
      icon: CheckCircle2,
      link: '/tasks',
      color: 'text-blue-500'
    },
    {
      title: 'Inventory Items',
      value: inventory.length,
      details: {
        lowStock: inventory.filter((i: Inventory) => i.quantity <= i.minQuantity).length,
        totalItems: inventory.reduce((acc: number, i: Inventory) => acc + i.quantity, 0),
        unit: 'items'
      },
      icon: Package,
      link: '/inventory',
      color: 'text-green-500'
    },
    {
      title: 'Financial Balance',
      value: formatCurrency(transactions.reduce((acc, f) => 
        f.type === 'income' ? acc + f.amount : acc - f.amount, 0
      )),
      details: {
        income: formatCurrency(transactions.filter(f => f.type === 'income')
          .reduce((acc, f) => acc + f.amount, 0)),
        expenses: formatCurrency(transactions.filter(f => f.type === 'expense')
          .reduce((acc, f) => acc + f.amount, 0))
      },
      icon: Wallet,
      link: '/finance',
      color: 'text-yellow-500'
    }
  ]

  const alerts = [
    ...tasks.filter(t => t.priority === 'HIGH' && t.status !== 'DONE')
      .map(t => ({
        type: 'task',
        message: `High priority task: ${t.title}`,
        icon: AlertCircle,
        color: 'text-red-500'
      })),
    ...inventory.filter((i: Inventory) => i.quantity <= i.minQuantity)
      .map(i => ({
        type: 'inventory',
        message: `Low stock alert: ${i.name} (${i.quantity}/${i.minQuantity})`,
        icon: Package,
        color: 'text-orange-500'
      }))
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back!</h2>
        <p className="text-sm text-muted-foreground">
          Here's what's happening across your workspace
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardHeader className="space-y-0 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
                {stat.details.unit && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {' '}{stat.details.unit}
                  </span>
                )}
              </div>
              <div className="mt-3 space-y-1.5">
                {Object.entries(stat.details).map(([key, value]) => {
                  if (key === 'unit') return null
                  return (
                    <div key={key} className="flex items-center text-sm">
                      <span className="capitalize text-muted-foreground">
                        {key}:
                      </span>
                      <span className="ml-auto font-medium">
                        {value}
                      </span>
                    </div>
                  )
                })}
              </div>
              <Button
                variant="ghost"
                className="mt-3 h-8 w-full justify-between text-sm"
                asChild
              >
                <Link to={stat.link}>
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md border p-3"
                >
                  <alert.icon className={`h-4 w-4 shrink-0 ${alert.color}`} />
                  <p className="text-sm flex-1">{alert.message}</p>
                  <Button variant="ghost" size="sm" className="h-7 w-7" asChild>
                    <Link to={`/${alert.type}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 