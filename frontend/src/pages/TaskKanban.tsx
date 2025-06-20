import { useEffect } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Edit, Trash2, ListTodo, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult, 
  DroppableProvided, 
  DroppableStateSnapshot,
  DraggableProvided, 
  DraggableStateSnapshot 
} from '@hello-pangea/dnd'
import type { Task } from '../lib/schemas'

const COLUMNS = [
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'DONE', label: 'Done' }
] as const

export default function TaskKanban() {
  const { 
    tasks,
    isLoading,
    error, 
    fetchTasks, 
    deleteTask, 
    updateTask 
  } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500/10 text-red-500'
      case 'MEDIUM':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'LOW':
        return 'bg-green-500/10 text-green-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If dropped outside a valid droppable area
    if (!destination) return

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return

    // Find the task that was dragged
    const task = tasks.find(t => t.id === draggableId)
    if (!task) return

    // Update the task status
    updateTask(task.id, {
      status: destination.droppableId as Task['status']
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Board</h2>
          <p className="text-muted-foreground">
            Manage your tasks in a Kanban view
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/tasks">
              <ListTodo className="h-4 w-4 mr-2" />
              List View
            </Link>
          </Button>
          <Button asChild>
            <Link to="/tasks">
              Create Task
            </Link>
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          {COLUMNS.map(column => (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{column.label}</h3>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>
              <Droppable droppableId={column.id}>
                {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-4 rounded-lg p-4 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-muted/50 border-2 border-dashed border-primary/50' : ''
                    }`}
                  >
                    {tasks
                      .filter(task => task.status === column.id)
                      .map((task, index) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id} 
                          index={index}
                        >
                          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.8 : 1
                              }}
                            >
                              <Card>
                                <CardHeader className="space-y-0 p-4">
                                  <div className="flex items-start justify-between space-y-0">
                                    <CardTitle className="text-base">{task.title}</CardTitle>
                                    <div className="flex gap-1">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        asChild
                                      >
                                        <Link to="/tasks">
                                          <Edit className="h-4 w-4" />
                                        </Link>
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-destructive"
                                        onClick={() => deleteTask(task.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <p className="text-sm text-muted-foreground">
                                    {task.description}
                                  </p>
                                  <div className="mt-4 flex items-center gap-2">
                                    <span 
                                      className={`rounded px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}
                                    >
                                      {task.priority}
                                    </span>
                                    {task.dueDate && (
                                      <span className="rounded px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                                        Due: {task.dueDate.toLocaleDateString(undefined, { 
                                          year: 'numeric', 
                                          month: 'short', 
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
