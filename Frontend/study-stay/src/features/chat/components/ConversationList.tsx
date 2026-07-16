import React from 'react';
import type { Conversation } from '../chat.service';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: number | null;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, activeConversationId, onSelectConversation }) => {
  return (
    <div className="space-y-3">
      {conversations.length === 0 ? (
        <div className="text-center py-8 text-xs text-on-surface-variant">لا توجد محادثات بعد.</div>
      ) : (
        conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            active={conversation.id === activeConversationId}
            onSelect={onSelectConversation}
          />
        ))
      )}
    </div>
  );
};

export default ConversationList;
