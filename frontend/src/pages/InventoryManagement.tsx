import { useEffect, useState } from "react";
import { useInventoryStore } from "../store/useInventoryStore";
import type { Inventory, CreateInventory,  InventoryCategory } from "../lib/schemas";
import { INVENTORY_CATEGORIES } from "../lib/schemas";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { PlusIcon, Loader2Icon, AlertCircleIcon } from "lucide-react";
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useToast } from '../components/ui/use-toast'

export default function InventoryManagement() {
  const {
    filteredInventory,
    isLoading,
    error,
    fetchInventory,
    createInventory,
    updateInventory,
    deleteInventory,
  } = useInventoryStore();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);
  const [newItem, setNewItem] = useState<CreateInventory>({
    name: "",
    description: "",
    quantity: 0,
    minQuantity: 0,
    category: "other",
    price: 0,
    location: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    if (editingItem) {
      setNewItem({
        name: editingItem.name,
        description: editingItem.description || '',
        quantity: editingItem.quantity,
        minQuantity: editingItem.minQuantity,
        category: editingItem.category,
        price: editingItem.price,
        location: editingItem.location,
      });
    } else {
      setNewItem({
        name: "",
        description: "",
        quantity: 0,
        minQuantity: 0,
        category: "other",
        price: 0,
        location: "",
      });
    }
  }, [editingItem]);

  const handleAddItem = async () => {
    setIsAddingItem(true);
    try {
      await createInventory(newItem);
      setNewItem({
        name: "",
        description: "",
        quantity: 0,
        minQuantity: 0,
        category: "other",
        price: 0,
        location: "",
      });
      toast({
        title: 'Success',
        description: 'Item added successfully'
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item',
        variant: 'destructive'
      });
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleStartEdit = (item: Inventory) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleEditItem = async () => {
    if (!editingItem) return;
    setIsEditingItem(true);
    try {
      await updateInventory(editingItem.id, newItem);
      toast({
        title: 'Success',
        description: 'Item updated successfully'
      });
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive'
      });
    } finally {
      setIsEditingItem(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInventory(id);
      toast({
        title: 'Success',
        description: 'Item deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive'
      });
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
          <h2 className="text-3xl font-bold tracking-tight">
            Inventory Management
          </h2>
          <p className="text-muted-foreground">
            Track and manage your inventory items
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="minQuantity">Minimum Quantity</Label>
                <Input
                  id="minQuantity"
                  type="number"
                  value={newItem.minQuantity}
                  onChange={(e) => setNewItem({ ...newItem, minQuantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value: InventoryCategory) => setNewItem({ ...newItem, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {INVENTORY_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={editingItem ? handleEditItem : handleAddItem}
                  disabled={!newItem.name || isAddingItem || isEditingItem}
                >
                  {(isAddingItem || isEditingItem) && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingItem ? 'Update' : 'Add'} Item
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInventory.map((item) => (
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
                  <span className="text-sm font-medium">
                    Quantity: {item.quantity}
                  </span>
                  {item.quantity <= item.minQuantity && (
                    <span className="text-red-500">(Low Stock)</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-muted-foreground">
                    Min: {item.minQuantity}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm font-medium">
                    Price: ${item.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-muted-foreground">
                    Category: {item.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-sm text-muted-foreground">
                    Location: {item.location}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateInventory(item.id, { quantity: item.quantity - 1 })}
                    disabled={item.quantity <= 0}
                  >
                    -
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateInventory(item.id, { quantity: item.quantity + 1 })}
                  >
                    +
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
