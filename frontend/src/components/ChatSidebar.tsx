import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connectChat, sendMessage, disconnectChat } from '../services/chatService';

interface ChatMessage {
  username: string;
  message: string;
}

const ChatSidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');
  const room = location.pathname.startsWith('/stock/')
    ? location.pathname.split('/')[2]
    : 'Global';
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let shouldDisconnect = true;
  
    if (token) {
      connectChat(
        token,
        room,
        (msg: ChatMessage) => setMessages((prev) => [...prev, msg]),
        (err) => setError(err),
        () => setIsConnected(true),
        () => setMessages([])
      );
    }
  
    return () => {
      if (shouldDisconnect) {
        disconnectChat();
      }
    };
  }, [room, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && isConnected) {
      sendMessage(input);
      setInput('');
    } else if (!isConnected) {
      console.error('Socket is not connected yet');
    }
  };  

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 btn btn-outline bg-base-200"
      >
        💬 Chat
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-base-200 shadow-lg z-50 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-base-content/10">
          <h3 className="text-lg font-bold text-center">Room: {room}</h3>
          <button onClick={() => setOpen(false)} className="btn btn-sm btn-error text-white">✕</button>
        </div>

        <div className="p-4 h-[70%] overflow-y-auto space-y-1">
          {messages.map((m, idx) => (
            <div key={idx} className="break-words">
              <strong>{m.username}: </strong>{m.message}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="text-red-500 p-2 bg-red-50">{error}</div>
        )}

        <div className="p-4 border-t border-base-content/10">
          <input
            className="input input-bordered w-full mb-2"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={!!error || !token}
          />
          <button
            className="btn btn-primary w-full mt-4"
            onClick={handleSend}
            disabled={!!error || !token}
          >
            Send
          </button>
          {!token && (
            <p className="text-red-500 text-sm mt-2">
              Please login to participate in chat
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
