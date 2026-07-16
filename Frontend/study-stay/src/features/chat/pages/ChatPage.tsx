import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { getConversations, getMessages, createConversation, sendMessage, markConversationRead, type Conversation, type Message } from '../chat.service';
import ConversationList from '../components/ConversationList';
import ChatInput from '../components/ChatInput';
import MessageBubble from '../components/MessageBubble';

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const queryUserId = searchParams.get('userId');
  const queryPropertyId = searchParams.get('propertyId');

  const [subscribed, setSubscribed] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activeUser, setActiveUser] = useState<{ id: number; name: string; role: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    try {
      const response = await getConversations();
      setConversations(response);
      return response;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      const response = await getMessages(conversationId);
      setMessages(response);
      await markConversationRead(conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (!subscribed) return;

    const initChat = async () => {
      const currentConversations = await loadConversations();
      let selectedConversation: Conversation | null = null;

      if (queryUserId) {
        const parsedQueryId = parseInt(queryUserId);
        selectedConversation = currentConversations.find((conversation) => conversation.other_user_id === parsedQueryId) || null;

        if (!selectedConversation) {
          const payload = {
            student_id: user?.role === 'student' ? user.id : parsedQueryId,
            owner_id: user?.role === 'owner' ? user.id : parsedQueryId,
            property_id: queryPropertyId ? Number(queryPropertyId) : null,
          };

          try {
            const conversation = await createConversation(payload as { student_id: number; owner_id: number; property_id?: number | null });
            selectedConversation = conversation;
            setConversations((prev) => [conversation, ...prev.filter((item) => item.id !== conversation.id)]);
          } catch (error) {
            console.error('Error opening conversation:', error);
          }
        }
      }

      if (!selectedConversation && currentConversations.length > 0) {
        selectedConversation = currentConversations[0];
      }

      if (selectedConversation) {
        setActiveConversation(selectedConversation);
        setActiveUser({
          id: selectedConversation.other_user_id,
          name: selectedConversation.other_user_name,
          role: selectedConversation.other_user_role,
        });
      }
    };

    initChat();
  }, [subscribed, queryUserId, user]);

  useEffect(() => {
    if (!subscribed || !activeConversation) return;
    loadMessages(activeConversation.id);
  }, [subscribed, activeConversation]);

  useEffect(() => {
    if (!subscribed) return;

    const interval = setInterval(() => {
      loadConversations();
      if (activeConversation) {
        loadMessages(activeConversation.id);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [subscribed, activeConversation]);

  // Auto scroll to bottom when messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessageText.trim() || !activeConversation) return;

    const text = newMessageText.trim();
    setNewMessageText('');

    try {
      const response = await sendMessage({ conversation_id: activeConversation.id, message: text });
      setMessages((prev) => [...prev, response]);
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setActiveUser({
      id: conversation.other_user_id,
      name: conversation.other_user_name,
      role: conversation.other_user_role,
    });
  };

  if (!subscribed) {
    return (
      <div className="min-h-screen bg-surface pt-24 pb-16 font-body">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="rounded-4xl bg-linear-to-br from-primary to-primary-container text-white p-8 lg:p-12 shadow-[0_18px_48px_rgba(20,27,43,0.12)]">
            <p className="text-sm font-bold tracking-[0.28em] uppercase text-white/75 mb-3">Messages</p>
            <h1 className="font-headline text-4xl md:text-5xl font-black mb-4">الرسائل بين الطالب والمالك</h1>
            <p className="max-w-2xl text-white/90 leading-relaxed">
              تواصل مباشرة لتأكيد الإيجارات السكنية. نقتطع رسوم خدمة رمزية بقيمة 2.5% من الإيجار الشهري عند توثيق العقد الإلكتروني عبر المنصة.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div className="rounded-[1.75rem] bg-surface-container-lowest p-6 shadow-[0_12px_32px_rgba(20,27,43,0.06)] border">
              <h2 className="font-headline text-2xl font-bold mb-3 text-slate-800">تفعيل الرسائل</h2>
              <p className="text-on-surface-variant leading-relaxed mb-6">
                اضغط على الزر أدناه لتفعيل اشتراك الرسائل وبدء التواصل المباشر مع الطلاب والمالكين للوحدات السكنية.
              </p>
              <button 
                className="rounded-full bg-primary px-8 py-3.5 font-bold text-white shadow-md hover:bg-primary-hover transition-colors cursor-pointer" 
                type="button" 
                onClick={() => setSubscribed(true)}
              >
                تفعيل التواصل والرسائل الآن
              </button>
            </div>

            <aside className="rounded-[1.75rem] bg-surface-container-lowest p-6 shadow-[0_12px_32px_rgba(20,27,43,0.06)] space-y-4 border">
              <h3 className="font-headline text-xl font-bold text-slate-800">رسوم ومميزات المنصة</h3>
              <div className="rounded-2xl bg-primary/5 p-4 text-xs leading-relaxed text-slate-600">
                • ربط فوري ومباشر بين المالك والطالب.<br/>
                • نظام محادثات آمن ومشفر.<br/>
                • عقود سكن إلكترونية جاهزة للطباعة والتوثيق بعد الاتفاق.
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16 font-body">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <section className="rounded-4xl bg-linear-to-br from-indigo-600 to-indigo-700 text-white p-8 lg:p-12 shadow-[0_18px_48px_rgba(20,27,43,0.12)]">
          <p className="text-sm font-bold tracking-[0.28em] uppercase text-white/75 mb-3">Messages</p>
          <h1 className="font-headline text-4xl md:text-5xl font-black mb-4">الرسائل النشطة</h1>
          <p className="max-w-2xl text-white/90 leading-relaxed">تواصل مباشرة مع الطلاب أو ملاك الشقق لتأكيد الحجز والاستفسار عن كافة تفاصيل الإقامة السكنية.</p>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6 items-start">
          {/* Threads list */}
          <aside className="rounded-[1.75rem] bg-surface-container-lowest p-4 shadow-[0_12px_32px_rgba(20,27,43,0.06)] space-y-3 border">
            <h3 className="font-headline text-lg font-bold text-slate-800 px-2 pb-2 border-b">المحادثات</h3>
            {conversations.length === 0 && !activeUser && (
              <div className="text-center py-8 text-xs text-on-surface-variant">
                لا توجد محادثات نشطة حالياً.
              </div>
            )}
            {activeUser && !conversations.find((c) => c.other_user_id === activeUser.id) && (
              <button 
                type="button" 
                className="w-full rounded-2xl bg-primary/5 border border-primary/20 p-4 text-right"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-primary">{activeUser.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{activeUser.role === 'owner' ? 'مالك العقار' : 'طالب سكن'}</p>
                  </div>
                </div>
                <p className="text-xs text-indigo-600 mt-2 italic font-semibold">محادثه جديدة...</p>
              </button>
            )}
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversation?.id || null}
              onSelectConversation={handleSelectConversation}
            />
          </aside>

          {/* Active conversation */}
          <section className="rounded-[1.75rem] bg-surface-container-lowest p-6 lg:p-8 shadow-[0_12px_32px_rgba(20,27,43,0.06)] space-y-6 border min-h-[500px] flex flex-col justify-between">
            {activeUser ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="font-headline text-2xl font-bold text-slate-900">{activeUser.name}</h2>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {activeUser.role === 'owner' ? 'مالك العقار' : 'طالب سكن'}
                    </p>
                  </div>
                  <div className="rounded-full bg-secondary/10 px-4 py-2 text-xs font-bold text-secondary">
                    تواصل مباشر
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-1 py-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-20 text-xs text-on-surface-variant italic">
                      اكتب رسالة لبدء المحادثة السكنية.
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender_id === user?.id;
                      return (
                        <MessageBubble key={msg.id} message={msg} isSender={isMe} />
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <ChatInput
                  value={newMessageText}
                  onChange={setNewMessageText}
                  onSend={handleSendMessage}
                  disabled={!activeConversation}
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">forum</span>
                <h3 className="font-headline text-lg font-bold text-slate-700">اختر محادثة لبدء التواصل</h3>
                <p className="text-xs text-on-surface-variant mt-2 max-w-sm">
                  يمكنك اختيار أحد الطلاب أو ملاك العقارات من القائمة الجانبية لبدء الشات الفوري حول السكن.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
