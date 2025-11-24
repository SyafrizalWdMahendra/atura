import React from 'react';

interface ChatWindowProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => Promise<void>;
  isSending: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ input, setInput, onSendMessage, isSending }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSending) {
      onSendMessage();
    }
  };

  return (
    <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex items-center shadow-inner rounded-b-lg">
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-gray-800"
        placeholder="Ketik pertanyaan Anda di sini..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isSending}
      />
      <button
        className={`ml-3 px-6 py-2 rounded-full font-semibold transition duration-300
          ${isSending
            ? 'bg-blue-300 text-white cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
          }`}
        onClick={onSendMessage}
        disabled={isSending}
      >
        {isSending ? 'Mengirim...' : 'Kirim'}
      </button>
    </div>
  );
};