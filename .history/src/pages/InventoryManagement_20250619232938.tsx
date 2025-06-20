import { useEffect, useState } from 'react'
import { useInventoryStore, type InventoryItem } from '../store/useInventoryStore'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '../components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip'
import { PlusIcon, Loader2Icon, AlertCircleIcon } from 'lucide-react'

export default function InventoryManagement() {
  const { items, isLoading, error, fetchItems, addItem, updateItem, deleteItem } =
    useInventoryStore()
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [isEditingItem, setIsEditingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 0,
    minQuantity: 0,
    category: '',
    price: 0,
    location: '',
  })

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleAddItem = async () => {
    setIsAddingItem(true)
    try {
      await addItem({
        ...newItem,
      })
      setNewItem({
        name: '',
        description: '',
        quantity: 0,
        minQuantity: 0,
        category: '',
        price: 0,
        location: '',
      })
    } finally {
      setIsAddingItem(false)
    }
  }

  const handleStartEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setIsEditingItem(true)
  }

  const handleEditItem = async () => {
    if (!editingItem) return
    setIsEditingItem(true)
    try {
      await updateItem(editingItem.id, {
        name: editingItem.name,
        description: editingItem.description,
        quantity: editingItem.quantity,
        minQuantity: editingItem.minQuantity,
        category: editingItem.category,
        price: editingItem.price,
        location: editingItem.location,
      })
      setEditingItem(null)
      setIsEditingItem(false)
    } finally {
      setIsEditingItem(false)
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
          <h2 className="text-3xl font-bold tracking-tight">
            Inventory Management
          </h2>
          <p className="text-muted-foreground">
            Track and manage your inventory items
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Quantity</label>
                  <input
                    type="number"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newItem.minQuantity}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        minQuantity: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newItem.location}
                    onChange={(e) =>
                      setNewItem({ ...newItem, location: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddItem}
                disabled={!newItem.name || isAddingItem}
              >
                {isAddingItem && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{item.name}</h3>
                {item.quantity <= item.minQuantity && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircleIcon className="h-4 w-4 text-destructive" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Low stock warning!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
              <div className="flex gap-2">
                <span className="text-sm text-muted-foreground">
                  Category: {item.category}
                </span>
                <span className="text-sm text-muted-foreground">
                  Location: {item.location}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-sm font-medium">
                  Quantity: {item.quantity}
                </span>
                <span className="text-sm text-muted-foreground">
                  Min: {item.minQuantity}
                </span>
                <span className="text-sm font-medium">
                  Price: ${item.price.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStartEdit(item)}
              >
                Edit
              </Button>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateItem(item.id, { quantity: item.quantity - 1 })
                  }
                disabled={item.quantity <= 0}
              >
                -
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  updateItem(item.id, { quantity: item.quantity + 1 })
                }
              >
                +
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteItem(item.id)}
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