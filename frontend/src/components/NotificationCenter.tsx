import { useState } from 'react'
import { useNotificationStore, type Notification } from '../store/useNotificationStore'
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  BellRing,
  Info,
  X,
} from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Link } from 'react-router-dom'

export default function NotificationCenter() {
  const { notifications, markAsRead, markAllAsRead, removeNotification } =
    useNotificationStore()
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case 'info':
        return <Info className="h-4 w-4 text-info" />
    }
  }

  const handleMarkAsRead = (notification: Notification) => {
    markAsRead(notification.id)
  }

  const handleRemove = (e: React.MouseEvent, notification: Notification) => {
    e.preventDefault()
    e.stopPropagation()
    removeNotification(notification.id)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          {unreadCount > 0 ? (
            <>
              <BellRing className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {unreadCount}
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <h4 className="font-medium">Notifications</h4>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              className="h-auto px-2 py-1 text-xs"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="cursor-pointer focus:bg-accent"
                onSelect={() => handleMarkAsRead(notification)}
              >
                <Link
                  to={notification.link || '#'}
                  className="flex w-full items-start gap-2 p-2"
                >
                  {getIcon(notification.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-sm font-medium ${
                          !notification.read ? '' : 'text-muted-foreground'
                        }`}
                      >
                        {notification.title}
                      </p>
                      <button
                        onClick={(e) => handleRemove(e, notification)}
                        className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </button>
                    </div>
                    <p
                      className={`text-xs ${
                        !notification.read
                          ? 'text-muted-foreground'
                          : 'text-muted-foreground/70'
                      }`}
                    >
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/50">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 