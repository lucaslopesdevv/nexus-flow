import { useEffect } from 'react'
import { useTaskStore, type Task } from '../store/useTaskStore'
import { Button } from '../components/ui/button'
import { Loader2Icon, List } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TaskKanban() {
  const { tasks, isLoading, error, fetchTasks, updateTask } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const columns = [
    { id: 'todo', title: 'To Do', tasks: tasks.filter((t) => t.status === 'todo') },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: tasks.filter((t) => t.status === 'in-progress'),
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: tasks.filter((t) => t.status === 'completed'),
    },
  ]

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      default:
        return ''
    }
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Task Board</h2>
        <p className="text-muted-foreground">
          Manage your tasks using Kanban board
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column.id}
            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <h3 className="mb-4 font-semibold">{column.title}</h3>
            <div className="space-y-4">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border bg-background p-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                    <div className="flex gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      {task.status !== 'todo' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateTask(task.id, {
                              status:
                                task.status === 'completed'
                                  ? 'in-progress'
                                  : 'todo',
                            })
                          }
                        >
                          ←
                        </Button>
                      )}
                      {task.status !== 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateTask(task.id, {
                              status:
                                task.status === 'todo'
                                  ? 'in-progress'
                                  : 'completed',
                            })
                          }
                        >
                          →
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {column.tasks.length === 0 && (
                <div className="flex h-24 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground">No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 