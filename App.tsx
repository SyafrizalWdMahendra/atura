import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatWindow } from './components/ChatWindow';
import { Message } from './components/Message';
import { initializeChat, sendMessage } from './services/geminiService';
// Fix: Import MessageProps from types.ts where it is defined and exported.
import { MessageProps } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initBot = async () => {
      try {
        await initializeChat();
        setMessages([
          {
            text: `Selamat datang di CMLABS Agency! Saya adalah Senior HR Manager virtual Anda. Ada yang bisa saya bantu terkait SOP perusahaan?`,
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setMessages([
          {
            text: "Maaf, terjadi kesalahan saat memulai. Silakan coba lagi nanti.",
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    initBot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on component mount

  const handleSendMessage = useCallback(async () => {
    if (input.trim() === '' || isSending) return;

    const userMessage: MessageProps = {
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsSending(true);

    const botMessagePlaceholder: MessageProps = {
      text: '...',
      sender: 'bot',
      timestamp: new Date(),
    };
    let botResponseText = '';

    setMessages((prevMessages) => [...prevMessages, botMessagePlaceholder]);

    try {
      await sendMessage(input, (chunk) => {
        botResponseText += chunk;
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          // Update the last message (the placeholder) with the streaming content
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            text: botResponseText,
          };
          return newMessages;
        });
      });
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          text: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        };
        return newMessages;
      });
    } finally {
      setIsSending(false);
    }
  }, [input, isSending]);

  useEffect(() => {
    // Scroll to the bottom of the chat window on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 rounded-lg">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 text-center font-bold text-xl rounded-t-lg shadow-md">
        CMLABS HR Manager Bot
      </header>
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="ml-3 text-gray-600">Loading HR Manager...</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <Message key={index} text={msg.text} sender={msg.sender} timestamp={msg.timestamp} />
          ))
        )}
      </div>
      <ChatWindow
        input={input}
        setInput={setInput}
        onSendMessage={handleSendMessage}
        isSending={isSending}
      />
    </div>
  );
};

export default App;