import { useEffect, useCallback, useState } from "react";
import { useFocusStore, type FocusSessionPreset } from "../store/useFocusStore";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../components/ui/dialog";
import { format } from "date-fns";
import {
  PlayIcon,
  PauseIcon,
  SquareIcon,
  TimerIcon,
  CheckCircleIcon,
  XCircleIcon,
  Loader2Icon,
  PlusIcon,
  Settings2Icon,
} from "lucide-react";

const FOCUS_TIME = 25; // minutes
const BREAK_TIME = 5; // minutes

export default function FocusTime() {
  const {
    sessions,
    presets,
    isLoading,
    error,
    isActive,
    timeLeft,
    currentSession,
    fetchSessions,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    tick,
    addPreset,
    updatePreset,
    deletePreset,
  } = useFocusStore();

  const [isAddingPreset, setIsAddingPreset] = useState(false);
  const [isEditingPreset, setIsEditingPreset] = useState(false);
  const [editingPreset, setEditingPreset] = useState<FocusSessionPreset | null>(
    null
  );
  const [newPreset, setNewPreset] = useState({
    name: "",
    duration: 25,
    type: "focus" as "focus" | "break",
  });

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, tick]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const handleStartFocus = () => {
    startSession(FOCUS_TIME, "focus");
  };

  const handleStartBreak = () => {
    startSession(BREAK_TIME, "break");
  };

  const handleTogglePause = () => {
    if (isActive) {
      pauseSession();
    } else {
      resumeSession();
    }
  };

  const handleStartPreset = (preset: FocusSessionPreset) => {
    startSession(preset.duration, preset.type);
  };

  const handleAddPreset = () => {
    setIsAddingPreset(true);
    try {
      addPreset({
        name: newPreset.name,
        duration: newPreset.duration,
        type: newPreset.type,
      });
      setNewPreset({
        name: "",
        duration: 25,
        type: "focus",
      });
    } finally {
      setIsAddingPreset(false);
    }
  };

  const handleStartEdit = (preset: FocusSessionPreset) => {
    setEditingPreset(preset);
    setIsEditingPreset(true);
  };

  const handleEditPreset = () => {
    if (!editingPreset) return;
    setIsEditingPreset(true);
    try {
      updatePreset(editingPreset.id, {
        name: editingPreset.name,
        duration: editingPreset.duration,
        type: editingPreset.type,
      });
      setEditingPreset(null);
      setIsEditingPreset(false);
    } finally {
      setIsEditingPreset(false);
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Focus Time</h2>
        <p className="text-muted-foreground">
          Stay productive with the Pomodoro Technique
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Focus Presets</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
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
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={newPreset.name}
                      onChange={(e) =>
                        setNewPreset({ ...newPreset, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={newPreset.duration}
                      onChange={(e) =>
                        setNewPreset({
                          ...newPreset,
                          duration: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={newPreset.type}
                      onChange={(e) =>
                        setNewPreset({
                          ...newPreset,
                          type: e.target.value as "focus" | "break",
                        })
                      }
                    >
                      <option value="focus">Focus</option>
                      <option value="break">Break</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddPreset}
                    disabled={
                      !newPreset.name || !newPreset.duration || isAddingPreset
                    }
                  >
                    {isAddingPreset && (
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Preset
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between rounded-lg border bg-background p-3"
              >
                <div>
                  <p className="font-medium">{preset.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {preset.duration} minutes ({preset.type})
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartEdit(preset)}
                  >
                    <Settings2Icon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleStartPreset(preset)}
                  >
                    Start
                  </Button>
                  {!["default-focus", "default-break"].includes(preset.id) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePreset(preset.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="mb-8 flex items-center gap-2">
            <TimerIcon className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">
              {currentSession
                ? currentSession.type === "focus"
                  ? "Focus Session"
                  : "Break Time"
                : "Start a Session"}
            </h3>
          </div>
          <div className="mb-8 text-6xl font-bold tabular-nums">
            {formatTime(timeLeft)}
          </div>
          <div className="flex gap-4">
            {!currentSession ? (
              <>
                <Button onClick={handleStartFocus}>
                  <PlayIcon className="mr-2 h-4 w-4" />
                  Start Focus (25m)
                </Button>
                <Button variant="secondary" onClick={handleStartBreak}>
                  <PlayIcon className="mr-2 h-4 w-4" />
                  Start Break (5m)
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleTogglePause}>
                  {isActive ? (
                    <>
                      <PauseIcon className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayIcon className="mr-2 h-4 w-4" />
                      Resume
                    </>
                  )}
                </Button>
                <Button variant="destructive" onClick={stopSession}>
                  <SquareIcon className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-xl font-semibold">Session History</h3>
          </div>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {session.completed ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">
                      {session.duration} minute{session.duration !== 1 && "s"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(session.startTime, "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {session.completed ? "Completed" : "Interrupted"}
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">
                  No focus sessions yet. Start your first session!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={!!editingPreset}
        onOpenChange={(open) => !open && setEditingPreset(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Focus Preset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={editingPreset?.name ?? ""}
                onChange={(e) =>
                  setEditingPreset(
                    editingPreset
                      ? { ...editingPreset, name: e.target.value }
                      : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <input
                type="number"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={editingPreset?.duration ?? 0}
                onChange={(e) =>
                  setEditingPreset(
                    editingPreset
                      ? {
                          ...editingPreset,
                          duration: parseInt(e.target.value) || 1,
                        }
                      : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={editingPreset?.type ?? "focus"}
                onChange={(e) =>
                  setEditingPreset(
                    editingPreset
                      ? {
                          ...editingPreset,
                          type: e.target.value as "focus" | "break",
                        }
                      : null
                  )
                }
              >
                <option value="focus">Focus</option>
                <option value="break">Break</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleEditPreset}
              disabled={
                !editingPreset?.name ||
                !editingPreset?.duration ||
                isEditingPreset
              }
            >
              {isEditingPreset && (
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
