import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  getAdminConversations,
  getAdminConversationMessages,
  type AdminConversation,
  type AdminMessage,
} from '../admin.service';

const AdminConversations: React.FC = () => {
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminConversation | null>(null);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = async (conversation: AdminConversation) => {
    setSelected(conversation);
    setMessagesLoading(true);
    try {
      const data = await getAdminConversationMessages(conversation.id);
      setMessages(data);
    } catch (error) {
      console.error('Error loading conversation messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="font-headline text-2xl font-black text-slate-900">مراقبة المحادثات</h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
          <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="max-h-[70vh] overflow-y-auto divide-y divide-slate-50">
              {loading ? (
                <p className="p-6 text-slate-400 text-sm">جاري التحميل...</p>
              ) : conversations.length === 0 ? (
                <p className="p-6 text-slate-400 text-sm">لا توجد محادثات</p>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className={`w-full text-right px-5 py-4 hover:bg-slate-50 transition-colors ${selected?.id === c.id ? 'bg-primary/5' : ''}`}
                  >
                    <p className="text-sm font-bold text-slate-800">{c.student_name} ↔ {c.owner_name}</p>
                    {c.property_title && <p className="text-xs text-slate-500 mt-0.5">{c.property_title}</p>}
                    <p className="text-[11px] text-slate-400 mt-1">{c.message_count} رسالة</p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5 max-h-[70vh] overflow-y-auto">
            {!selected ? (
              <p className="text-slate-400 text-sm">اختر محادثة لعرض الرسائل</p>
            ) : messagesLoading ? (
              <p className="text-slate-400 text-sm">جاري تحميل الرسائل...</p>
            ) : messages.length === 0 ? (
              <p className="text-slate-400 text-sm">لا توجد رسائل في هذه المحادثة</p>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className="rounded-xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-700">{m.sender_name}</span>
                      <span className="text-[10px] text-slate-400">{new Date(m.created_at).toLocaleString('ar-EG')}</span>
                    </div>
                    <p className="text-sm text-slate-700">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminConversations;
