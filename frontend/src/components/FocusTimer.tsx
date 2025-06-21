import { useEffect } from 'react';
import { useFocusStore } from '../store/useFocusStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { Button } from './ui/button';
import { PlayIcon, PauseIcon, SquareIcon as StopIcon } from 'lucide-react';

const formatTimeLeft = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export function FocusTimer() {
  const { currentSession, isActive, timeLeft, tick, completeSession, pauseSession, resumeSession, stopSession } = useFocusStore();
  const { addNotification } = useNotificationStore();

  // Timer tick effect
  useEffect(() => {
    if (!currentSession || !isActive) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession, isActive, tick]);

  // Timer notifications effect
  useEffect(() => {
    if (!currentSession || !isActive) return;

    // Check if time is up
    if (timeLeft <= 0) {
      completeSession(currentSession.id);
      addNotification({
        key: `focus-complete-${currentSession.id}`,
        title: 'Focus Session Complete',
        message: `Your ${currentSession.type} session has ended!`,
        type: 'info',
        category: 'focus',
        link: '/focus',
      });
      return;
    }

    // Notify when 5 minutes remaining
    if (timeLeft === 300) {
      addNotification({
        key: `focus-reminder-${currentSession.id}`,
        title: '5 Minutes Remaining',
        message: `Your ${currentSession.type} session will end in 5 minutes!`,
        type: 'info',
        category: 'focus',
        link: '/focus',
      });
    }
  }, [timeLeft, currentSession, isActive, completeSession, addNotification]);

  if (!currentSession) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[300px] rounded-lg border bg-card p-4 text-card-foreground shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold capitalize">
            {currentSession.type} Session
          </h3>
          <span className="text-2xl font-bold">
            {formatTimeLeft(timeLeft)}
          </span>
        </div>
        <div className="flex justify-end gap-2">
          {isActive ? (
            <Button variant="outline" size="sm" onClick={pauseSession}>
              <PauseIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={resumeSession}>
              <PlayIcon className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              stopSession();
              completeSession(currentSession.id);
            }}
          >
            <StopIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 