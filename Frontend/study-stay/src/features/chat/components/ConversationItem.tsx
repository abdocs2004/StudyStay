import React from 'react';
import type { Conversation } from '../chat.service';

interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
  onSelect: (conversation: Conversation) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, active, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={`w-full rounded-2xl p-4 text-right transition-colors border ${
        active ? 'bg-primary/5 border-primary/20' : 'bg-surface-container hover:bg-surface-container-low border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-900">{conversation.other_user_name}</p>
          <p className="text-[10px] text-on-surface-variant">
            {conversation.other_user_role === 'owner' ? 'مالك العقار' : 'طالب سكن'}
          </p>
        </div>
        {conversation.unread_count > 0 ? (
          <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white">
            {conversation.unread_count}
          </span>
        ) : null}
      </div>
      <p className="text-xs text-on-surface-variant mt-2 line-clamp-1">{conversation.last_message || 'ابدأ المحادثة'}</p>
      <p className="text-[10px] text-on-surface-variant mt-1">{conversation.last_message_time ? new Date(conversation.last_message_time).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }) : ''}</p>
    </button>
  );
};

export default ConversationItem;
