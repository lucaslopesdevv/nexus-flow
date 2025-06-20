import { useState } from 'react'
import { Button } from './ui/button'
import { createTaskSchema, type CreateTask, type UpdateTask } from '../lib/schemas'

interface TaskFormProps {
  onSubmit: (data: CreateTask) => Promise<void>
  initialData?: Partial<CreateTask>
  onCancel: () => void
  mode?: 'create' | 'edit'
}

export function TaskForm({ onSubmit, initialData, onCancel, mode = 'create' }: TaskFormProps) {
  const [formData, setFormData] = useState<Partial<CreateTask>>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    status: initialData?.status ?? 'TODO',
    priority: initialData?.priority ?? 'MEDIUM',
    dueDate: initialData?.dueDate ?? undefined,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const validatedData = createTaskSchema.parse({
        ...formData,
        title: formData.title?.trim(),
        description: formData.description?.trim(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      })
      await onSubmit(validatedData)
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ form: error.message })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1 text-foreground">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title ?? ''}
          onChange={handleChange}
          className="w-full p-2 border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="text-destructive text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1 text-foreground">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description ?? ''}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter task description"
        />
        {errors.description && (
          <p className="text-destructive text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1 text-foreground">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status ?? 'TODO'}
          onChange={handleChange}
          className="w-full p-2 border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        {errors.status && (
          <p className="text-destructive text-sm mt-1">{errors.status}</p>
        )}
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium mb-1 text-foreground">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority ?? 'MEDIUM'}
          onChange={handleChange}
          className="w-full p-2 border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        {errors.priority && (
          <p className="text-destructive text-sm mt-1">{errors.priority}</p>
        )}
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium mb-1 text-foreground">
          Due Date
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate ?? ''}
          onChange={handleChange}
          className="w-full p-2 border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.dueDate && (
          <p className="text-destructive text-sm mt-1">{errors.dueDate}</p>
        )}
      </div>

      {errors.form && (
        <p className="text-destructive text-sm mt-1">{errors.form}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Update Task'}
        </Button>
      </div>
    </form>
  )
} 