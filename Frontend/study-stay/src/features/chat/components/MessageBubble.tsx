import React from 'react';
import type { Message } from '../chat.service';

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSender }) => {
  return (
    <div className={`max-w-[75%] rounded-3xl p-4 flex flex-col ${isSender ? 'bg-primary text-white ml-auto rounded-tl-md' : 'bg-surface-container-low text-slate-800 mr-auto rounded-tr-md'}`}>
      <p className="text-sm leading-relaxed whitespace-pre-line">{message.message}</p>
      <span className={`text-[9px] mt-2 ${isSender ? 'text-white/70' : 'text-slate-400'}`}>
        {new Date(message.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export default MessageBubble;
