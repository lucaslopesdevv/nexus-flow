import { useEffect, useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { PlusIcon, Loader2Icon, KanbanSquare, CheckCircle2, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from '../components/ui/use-toast'
import { CreateTask, UpdateTask, Task } from '../lib/schemas'
import { TaskForm } from '../components/TaskForm'
import { Search } from '../components/ui/search'

export default function TaskManager() {
  const {
    tasks,
    filteredTasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setSearchQuery,
  } = useTaskStore();
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (data: CreateTask) => {
    try {
      await createTask(data)
      setIsDialogOpen(false)
      toast({
        title: 'Success',
        description: 'Task created successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateTask = async (id: string, data: UpdateTask) => {
    try {
      await updateTask(id, data)
      setIsDialogOpen(false)
      setSelectedTask(null)
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive',
      })
    }
  }

  const handleCompleteTask = async (task: Task) => {
    try {
      await updateTask(task.id, { status: 'DONE' })
      toast({
        title: 'Success',
        description: 'Task marked as complete',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete task',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      })
    }
  }

  const handleEditClick = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedTask(null)
  }

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
          <h2 className="text-3xl font-bold tracking-tight">Task Manager</h2>
          <p className="text-muted-foreground">
            Manage and track your tasks
          </p>
        </div>
        <div className="flex gap-2">
          <Search onSearch={setSearchQuery} className="w-[200px]" />
          <Button variant="outline" asChild>
            <Link to="/kanban">
              <KanbanSquare className="h-4 w-4 mr-2" />
              Kanban View
            </Link>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedTask(null)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedTask ? 'Edit Task' : 'Create New Task'}
                </DialogTitle>
              </DialogHeader>
              <TaskForm
                onSubmit={
                  selectedTask
                    ? (data) => handleUpdateTask(selectedTask.id, data)
                    : handleCreateTask
                }
                initialData={
                  selectedTask
                    ? {
                        title: selectedTask.title,
                        description: selectedTask.description,
                        status: selectedTask.status,
                        priority: selectedTask.priority,
                        dueDate: selectedTask.dueDate,
                      }
                    : undefined
                }
                mode={selectedTask ? 'edit' : 'create'}
                onCancel={handleDialogClose}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{task.title}</h3>
                {task.priority === 'HIGH' && task.status !== 'DONE' && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    High Priority
                  </span>
                )}
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
              <div className="flex gap-2 mt-2">
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    task.status === 'TODO'
                      ? 'bg-gray-100 text-gray-800'
                      : task.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {task.status === 'TODO'
                    ? 'To Do'
                    : task.status === 'IN_PROGRESS'
                    ? 'In Progress'
                    : 'Done'}
                </span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    task.priority === 'LOW'
                      ? 'bg-gray-100 text-gray-800'
                      : task.priority === 'MEDIUM'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {task.priority === 'LOW'
                    ? 'Low'
                    : task.priority === 'MEDIUM'
                    ? 'Medium'
                    : 'High'}
                </span>
                {task.dueDate && (
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                    Due: {new Date(task.dueDate).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {task.status !== 'DONE' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => handleCompleteTask(task)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditClick(task)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            {tasks.length === 0 ? 'No tasks yet. Create your first task!' : 'No tasks match your search.'}
          </div>
        )}
      </div>
    </div>
  );
}
