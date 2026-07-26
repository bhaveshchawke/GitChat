import React from 'react';
import { Search, MessageSquare, Code, Zap, Trash2, Bell, Settings, Database, BrainCircuit, Sparkles, Menu } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useChat } from '../../hooks/useChat';
import { cn } from '../../utils/cn';

function ChatBox({ activeRepo, onMenuClick }) {
  const { messages, isThinking, sendMessage, clearChat, messagesEndRef } = useChat(activeRepo);

  const suggestionChips = [
    { title: "Where is the auth middleware?", icon: MessageSquare, color: "blue" },
    { title: "Explain the folder structure", icon: Code, color: "yellow" },
    { title: "Find performance bottlenecks", icon: Zap, color: "orange" }
  ];

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-1 -ml-2 text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="bg-white text-black px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-200 max-w-[150px] sm:max-w-xs truncate">
            {activeRepo || 'No repo selected'}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              className="flex items-center gap-2 text-white hover:text-black bg-black hover:bg-white border border-white px-3 py-1.5 rounded-lg text-sm transition-all"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth z-0 bg-black">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="relative mb-8 group">
                <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center border border-white relative z-10">
                  <BrainCircuit size={40} className="text-white" />
                </div>
                <Sparkles size={20} className="absolute -top-2 -right-2 text-white" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Interact with Your Codebase
              </h2>
              <p className="text-gray-400 max-w-lg mb-12 text-base leading-relaxed">
                Experience AI-powered code analysis. Ask complex architectural questions, find hidden bugs, or trace implementation details across your entire repository instantly.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
                {suggestionChips.map((chip, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(chip.title)}
                    className="flex flex-col items-start p-5 bg-zinc-900 rounded-2xl transition-all duration-300 text-left group border border-zinc-800 hover:border-white hover:bg-zinc-800 relative overflow-hidden"
                  >
                    <chip.icon size={22} className="mb-3 relative z-10 transition-transform group-hover:scale-110 duration-300 text-white" />
                    <span className="text-[15px] font-medium text-gray-300 group-hover:text-white relative z-10 leading-snug">
                      "{chip.title}"
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pb-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isThinking && (
                <div className="flex w-full mb-6 justify-start">
                  <div className="flex max-w-[85%] gap-4 rounded-2xl p-4 bg-zinc-900 text-white border border-zinc-800 items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center animate-pulse">
                        <Search size={16} className="text-black" />
                      </div>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Input Box */}
      <ChatInput onSendMessage={sendMessage} isThinking={isThinking} />
    </div>
  );
}

export default ChatBox;
