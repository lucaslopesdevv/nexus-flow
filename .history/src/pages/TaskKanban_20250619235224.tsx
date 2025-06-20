import { useEffect, useState } from "react";
import {
  useTaskStore,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "../store/useTaskStore";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../components/ui/dialog";
import { Loader2Icon, List, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function TaskKanban() {
  const { tasks, isLoading, error, fetchTasks, updateTask, addTask } =
    useTaskStore();
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as TaskPriority,
    status: "todo" as TaskStatus,
    dueDate: null,
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async () => {
    setIsAddingTask(true);
    try {
      await addTask({
        ...newTask,
      });
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        dueDate: null,
      });
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleEditTask = async () => {
    if (!editingTask) return;
    setIsEditingTask(true);
    try {
      await updateTask(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
      });
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setEditingTask(null);
      setIsEditingTask(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDraggedOver(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      updateTask(taskId, { status: newStatus });
    }
    setDraggedOver(null);
  };

  const columns = [
    {
      id: "todo",
      title: "To Do",
      tasks: tasks.filter((t) => t.status === "todo"),
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: tasks.filter((t) => t.status === "in-progress"),
    },
    {
      id: "completed",
      title: "Completed",
      tasks: tasks.filter((t) => t.status === "completed"),
    },
  ];

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default:
        return "";
    }
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
          <h2 className="text-3xl font-bold tracking-tight">Task Board</h2>
          <p className="text-muted-foreground">
            Manage your tasks using Kanban board
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/tasks">
              <List className="mr-2 h-4 w-4" />
              List View
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors ${
              draggedOver === column.id
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id as TaskStatus)}
          >
            <h3 className="mb-4 font-semibold">{column.title}</h3>
            <div className="space-y-4 min-h-[200px]">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border bg-background p-4 shadow-sm cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
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
                      {task.status !== "todo" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateTask(task.id, {
                              status:
                                task.status === "completed"
                                  ? "in-progress"
                                  : "todo",
                            })
                          }
                        >
                          ←
                        </Button>
                      )}
                      {task.status !== "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateTask(task.id, {
                              status:
                                task.status === "todo"
                                  ? "in-progress"
                                  : "completed",
                            })
                          }
                        >
                          →
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(task)}
                      >
                        Edit
                      </Button>
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

      <Dialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="edit-title"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Title
              </label>
              <input
                id="edit-title"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={editingTask?.title ?? ""}
                onChange={(e) =>
                  setEditingTask(
                    editingTask
                      ? { ...editingTask, title: e.target.value }
                      : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-description"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description
              </label>
              <textarea
                id="edit-description"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={editingTask?.description ?? ""}
                onChange={(e) =>
                  setEditingTask(
                    editingTask
                      ? { ...editingTask, description: e.target.value }
                      : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-priority"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Priority
              </label>
              <select
                id="edit-priority"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={editingTask?.priority ?? "medium"}
                onChange={(e) =>
                  setEditingTask(
                    editingTask
                      ? {
                          ...editingTask,
                          priority: e.target.value as TaskPriority,
                        }
                      : null
                  )
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
              onClick={handleEditTask}
              disabled={!editingTask?.title || isEditingTask}
            >
              {isEditingTask && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
