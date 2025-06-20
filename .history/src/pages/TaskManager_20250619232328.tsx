import { useEffect, useState } from 'react'
import { useTaskStore, type Task, type TaskPriority, type TaskStatus } from '../store/useTaskStore'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '../components/ui/dialog'
import { PlusIcon, Loader2Icon, Plus, KanbanSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TaskManager() {
  const { tasks, isLoading, error, fetchTasks, addTask, updateTask, deleteTask } =
    useTaskStore()
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isEditingTask, setIsEditingTask] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    status: 'todo' as TaskStatus,
    dueDate: null,
  })

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleAddTask = async () => {
    setIsAddingTask(true)
    try {
      await addTask({
        ...newTask,
      })
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: null,
      })
    } finally {
      setIsAddingTask(false)
    }
  }

  const handleEditTask = async () => {
    if (!editingTask) return
    setIsEditingTask(true)
    try {
      await updateTask(editingTask.id, newTask)
      setEditingTask(null)
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: null,
      })
    } finally {
      setIsEditingTask(false)
    }
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
      default:
        return ''
    }
  }

  const getStatusBadgeColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Manager</h2>
          <p className="text-muted-foreground">
            Manage and organize your tasks efficiently
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/tasks/kanban">
              <KanbanSquare className="mr-2 h-4 w-4" />
              Kanban View
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="priority"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        priority: e.target.value as TaskPriority,
                      })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddTask}
                  disabled={!newTask.title || isAddingTask}
                >
                  {isAddingTask && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="space-y-1">
              <h3 className="font-semibold">{task.title}</h3>
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
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateTask(task.id, {
                    status:
                      task.status === 'todo'
                        ? 'in-progress'
                        : task.status === 'in-progress'
                        ? 'completed'
                        : 'todo',
                  })
                }
              >
                {task.status === 'todo'
                  ? 'Start'
                  : task.status === 'in-progress'
                  ? 'Complete'
                  : 'Reopen'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteTask(task.id)}
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