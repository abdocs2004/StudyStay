import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  type Notification,
} from '../../features/notifications/notification.service';

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const refreshUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) loadNotifications();
  };

  const handleMarkRead = async (notification: Notification) => {
    if (notification.is_read) return;
    try {
      await markNotificationRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative rounded-full p-2 text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
        aria-label="الإشعارات"
      >
        <span className="material-symbols-outlined text-2xl align-middle">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-white shadow-xl border border-slate-100 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h4 className="font-bold text-sm text-slate-800">الإشعارات</h4>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-primary hover:underline"
              >
                تعليم الكل كمقروء
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">لا توجد إشعارات حالياً.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {notifications.slice(0, 8).map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => handleMarkRead(notification)}
                    className={`w-full text-right px-4 py-3 hover:bg-slate-50 transition-colors ${
                      !notification.is_read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-800">{notification.title}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notification.body}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(notification.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="block text-center py-3 text-xs font-bold text-primary border-t border-slate-100 hover:bg-slate-50 transition-colors"
          >
            عرض كل الإشعارات
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
