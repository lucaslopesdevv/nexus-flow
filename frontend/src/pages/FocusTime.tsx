import { useEffect, useState } from "react";
import { useFocusStore } from "../store/useFocusStore";
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
import { Label } from "../components/ui/label";
import { format, formatDistance } from "date-fns";
import {
  PlusIcon,
  Loader2Icon,
  PlayIcon,
  PauseIcon,
  SquareIcon as StopIcon,
  Edit,
  Trash2,
  SaveIcon,
} from "lucide-react";
import { FocusType, FocusPreset } from "../lib/schemas";

export default function FocusTime() {
  const {
    sessions,
    presets,
    currentSession,
    isLoading,
    error,
    isActive,
    timeLeft,
    fetchSessions,
    fetchPresets,
    createSession,
    completeSession,
    createPreset,
    updatePreset,
    deletePreset,
    pauseSession,
    resumeSession,
  } = useFocusStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showPresetDialog, setShowPresetDialog] = useState(false);
  const [editingPreset, setEditingPreset] = useState<FocusPreset | null>(null);
  const [newPreset, setNewPreset] = useState({
    name: "",
    description: "",
    duration: 25,
    type: "focus" as FocusType,
  });

  useEffect(() => {
    fetchSessions();
    fetchPresets();
  }, [fetchSessions, fetchPresets]);

  const handleStartSession = async (preset?: FocusPreset) => {
    setIsProcessing(true);
    try {
      const now = new Date();
      await createSession({
        duration: preset?.duration || 25,
        type: preset?.type || "focus",
        startTime: now.toISOString(),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteSession = async (id: string) => {
    setIsProcessing(true);
    try {
      await completeSession(id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddPreset = async () => {
    setIsProcessing(true);
    try {
      await createPreset(newPreset);
      setNewPreset({
        name: "",
        description: "",
        duration: 25,
        type: "focus",
      });
      setShowPresetDialog(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditPreset = async () => {
    if (!editingPreset) return;
    setIsProcessing(true);
    try {
      await updatePreset(editingPreset.id, {
        name: editingPreset.name,
        description: editingPreset.description,
        duration: editingPreset.duration,
        type: editingPreset.type,
      });
      setEditingPreset(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePreset = async (id: string) => {
    setIsProcessing(true);
    try {
      await deletePreset(id);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Focus Presets</h2>
          <Dialog open={showPresetDialog} onOpenChange={setShowPresetDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Preset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Focus Preset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newPreset.name}
                    onChange={(e) =>
                      setNewPreset({ ...newPreset, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newPreset.description}
                    onChange={(e) =>
                      setNewPreset({ ...newPreset, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <input
                    type="number"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={newPreset.duration}
                    onChange={(e) =>
                      setNewPreset({
                        ...newPreset,
                        duration: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={newPreset.type}
                    onValueChange={(value: FocusType) =>
                      setNewPreset({
                        ...newPreset,
                        type: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="focus">Focus</SelectItem>
                      <SelectItem value="break">Break</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddPreset}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add Preset"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{preset.name}</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingPreset(preset)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePreset(preset.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {preset.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {preset.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">
                    Duration: {preset.duration} minutes
                  </p>
                  <p className="text-sm capitalize">
                    Type: {preset.type}
                  </p>
                </div>
                <Button
                  onClick={() => handleStartSession(preset)}
                  disabled={isProcessing || !!currentSession}
                >
                  {isProcessing ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlayIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Current Session</h2>
        {currentSession ? (
          <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold capitalize">
                  {currentSession.type} Session
                </p>
                <p className="text-sm">
                  Duration: {currentSession.duration} minutes
                </p>
                <p className="text-sm">
                  Started: {format(new Date(currentSession.startTime), "HH:mm")}
                </p>
                <p className="text-2xl font-bold mt-2">
                  {formatTimeLeft(timeLeft)}
                </p>
              </div>
              <div className="flex gap-2">
                {isActive ? (
                  <Button
                    variant="outline"
                    onClick={pauseSession}
                    disabled={isProcessing}
                  >
                    <PauseIcon className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={resumeSession}
                    disabled={isProcessing}
                  >
                    <PlayIcon className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  onClick={() => handleCompleteSession(currentSession.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <StopIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No active session</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Session History</h2>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold capitalize">
                    {session.type} Session
                  </p>
                  <p className="text-sm">
                    Duration: {session.duration} minutes
                  </p>
                  <p className="text-sm">
                    Started: {format(new Date(session.startTime), "HH:mm")}
                  </p>
                  {session.endTime && (
                    <p className="text-sm">
                      Ended: {format(new Date(session.endTime), "HH:mm")}
                    </p>
                  )}
                </div>
                <div
                  className={`px-2 py-1 rounded text-sm ${
                    session.completed
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {session.completed ? "Completed" : "In Progress"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingPreset && (
        <Dialog open={!!editingPreset} onOpenChange={() => setEditingPreset(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Focus Preset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={editingPreset.name}
                  onChange={(e) =>
                    setEditingPreset({ ...editingPreset, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={editingPreset.description || ""}
                  onChange={(e) =>
                    setEditingPreset({
                      ...editingPreset,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (minutes)</label>
                <input
                  type="number"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={editingPreset.duration}
                  onChange={(e) =>
                    setEditingPreset({
                      ...editingPreset,
                      duration: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={editingPreset.type}
                  onValueChange={(value: FocusType) =>
                    setEditingPreset({
                      ...editingPreset,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="focus">Focus</SelectItem>
                    <SelectItem value="break">Break</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleEditPreset}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
