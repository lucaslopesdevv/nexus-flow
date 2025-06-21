import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
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
        <Label htmlFor="title">Title</Label>
        <Input
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
        <Label htmlFor="description">Description</Label>
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
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status ?? 'TODO'}
          onValueChange={(value: "TODO" | "IN_PROGRESS" | "DONE") => {
            setFormData((prev) => ({
              ...prev,
              status: value
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODO">To Do</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-destructive text-sm mt-1">{errors.status}</p>
        )}
      </div>

      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={formData.priority ?? 'MEDIUM'}
          onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") => {
            setFormData((prev) => ({
              ...prev,
              priority: value
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
        {errors.priority && (
          <p className="text-destructive text-sm mt-1">{errors.priority}</p>
        )}
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <input
          type="datetime-local"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate ? formData.dueDate.slice(0, 16) : ''}
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