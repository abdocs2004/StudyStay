import React from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, disabled }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled) onSend();
      }}
      className="rounded-3xl bg-surface-container-low p-3 flex items-center gap-3 border border-slate-150 mt-4"
    >
      <input
        className="flex-1 bg-transparent outline-none px-3 text-sm text-slate-800"
        placeholder="اكتب رسالتك السكنية هنا..."
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        className="rounded-full bg-primary px-6 py-3 font-bold text-white text-xs hover:opacity-95 disabled:opacity-50"
        disabled={disabled || value.trim().length === 0}
      >
        إرسال
      </button>
    </form>
  );
};

export default ChatInput;
