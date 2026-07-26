import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Mic } from 'lucide-react';
import { cn } from '../../utils/cn';

function ChatInput({ onSendMessage, isThinking }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message.trim() && !isThinking) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 bg-transparent border-t border-slate-700/50 backdrop-blur-md relative z-20">
      <div className="max-w-4xl mx-auto relative">
        <form 
          onSubmit={handleSubmit}
          className={cn(
            "relative flex items-end gap-2 bg-zinc-900 rounded-2xl border border-zinc-800 p-2 shadow-lg transition-all duration-300",
            isThinking ? "opacity-70" : "focus-within:border-white"
          )}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isThinking}
            placeholder={isThinking ? "AI is analyzing..." : "Ask anything about the codebase..."}
            className="w-full max-h-[200px] bg-transparent text-white placeholder-gray-500 resize-none outline-none py-3 px-4 text-[15px] scrollbar-thin scrollbar-thumb-zinc-700 leading-relaxed"
            rows={1}
          />
          <div className="flex items-center gap-2 pb-2 pr-2">
            <button
              type="button"
              className="p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-zinc-800 transition-colors hidden sm:block"
              title="Voice Input (Coming soon)"
            >
              <Mic size={18} />
            </button>
            <button
              type="submit"
              disabled={!message.trim() || isThinking}
              className={cn(
                "p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden",
                message.trim() && !isThinking 
                  ? "bg-white text-black hover:scale-105" 
                  : "bg-zinc-800 text-gray-500 cursor-not-allowed border border-zinc-700"
              )}
            >
              {isThinking ? (
                <Loader2 size={18} className="animate-spin text-black" />
              ) : (
                <Send size={18} className={cn(message.trim() && "translate-x-0.5")} />
              )}
            </button>
          </div>
        </form>
        <div className="flex justify-between items-center mt-3 px-2">
          <span className="text-[11px] text-gray-500 hidden sm:block">
            <strong>Tip:</strong> Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md text-gray-400 mx-1">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md text-gray-400 mx-1">Shift + Enter</kbd> for new line
          </span>
          <span className="text-[11px] text-gray-500 ml-auto">
            GitChatAI can make mistakes. Consider verifying important information.
          </span>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
