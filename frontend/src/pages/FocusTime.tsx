import { useEffect, useCallback } from "react";
import { useFocusStore } from "../store/useFocusStore";
import { Button } from "../components/ui/button";
import {
  PlayIcon,
  PauseIcon,
  SquareIcon,
  Loader2Icon,
} from "lucide-react";

const FOCUS_TIME = 25; // minutes
const BREAK_TIME = 5; // minutes

export default function FocusTime() {
  const {
    sessions,
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
  } = useFocusStore();

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
            <h3 className="font-semibold">Timer</h3>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="text-6xl font-bold">
              {formatTime(timeLeft)}
            </div>
            <div className="flex items-center gap-2">
              {!isActive && !currentSession && (
                <>
                  <Button onClick={handleStartFocus}>
                    <PlayIcon className="mr-2 h-4 w-4" />
                    Start Focus
                  </Button>
                  <Button onClick={handleStartBreak} variant="outline">
                    <PlayIcon className="mr-2 h-4 w-4" />
                    Start Break
                  </Button>
                </>
              )}
              {currentSession && (
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
                  <Button onClick={stopSession} variant="outline">
                    <SquareIcon className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Session History</h3>
          </div>

          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg border bg-background p-3"
              >
                <div>
                  <p className="font-medium">
                    {session.type === "focus" ? "Focus Session" : "Break"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.duration} minutes
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(session.startTime).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
