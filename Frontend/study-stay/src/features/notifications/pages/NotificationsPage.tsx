import React, { useEffect, useState } from 'react';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  type Notification,
} from '../notification.service';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface pt-24">
        <div className="text-primary font-bold text-xl animate-pulse">جاري تحميل الإشعارات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 lg:px-8 space-y-8">
        <section className="rounded-4xl bg-linear-to-br from-primary to-primary-container text-white p-8 lg:p-10 shadow-[0_18px_48px_rgba(20,27,43,0.12)]">
          <p className="text-sm font-bold tracking-[0.28em] uppercase text-white/75 mb-3">Notifications</p>
          <h1 className="font-headline text-3xl md:text-4xl font-black mb-2">الإشعارات</h1>
          <p className="text-white/90">{unreadCount > 0 ? `لديك ${unreadCount} إشعار غير مقروء` : 'كل الإشعارات مقروءة'}</p>
        </section>

        <div className="rounded-[1.75rem] bg-surface-container-lowest shadow-[0_12px_32px_rgba(20,27,43,0.06)] border border-slate-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">كل الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-sm font-semibold text-primary hover:underline"
              >
                تعليم الكل كمقروء
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant">لا توجد إشعارات حتى الآن.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex items-start justify-between gap-4 px-6 py-4 ${!notification.is_read ? 'bg-primary/5' : ''}`}
                >
                  <div>
                    <p className="font-bold text-sm text-slate-900">{notification.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{notification.body}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(notification.created_at).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {!notification.is_read && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(notification.id)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        تعليم كمقروء
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(notification.id)}
                      className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
