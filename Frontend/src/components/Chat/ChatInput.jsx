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
            "relative flex items-end gap-2 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/60 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300",
            isThinking ? "opacity-70" : "focus-within:border-emerald-500/50 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          )}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isThinking}
            placeholder={isThinking ? "AI is analyzing..." : "Ask anything about the codebase..."}
            className="w-full max-h-[200px] bg-transparent text-slate-200 placeholder-slate-500 resize-none outline-none py-3 px-4 text-[15px] scrollbar-thin scrollbar-thumb-slate-700 leading-relaxed"
            rows={1}
          />
          <div className="flex items-center gap-2 pb-2 pr-2">
            <button
              type="button"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
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
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105" 
                  : "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50"
              )}
            >
              {isThinking ? (
                <Loader2 size={18} className="animate-spin text-emerald-500" />
              ) : (
                <Send size={18} className={cn(message.trim() && "translate-x-0.5")} />
              )}
            </button>
          </div>
        </form>
        <div className="flex justify-between items-center mt-3 px-2">
          <span className="text-[11px] text-slate-500 hidden sm:block">
            <strong>Tip:</strong> Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded-md text-slate-400 mx-1">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded-md text-slate-400 mx-1">Shift + Enter</kbd> for new line
          </span>
          <span className="text-[11px] text-slate-500 ml-auto">
            GitChatAI can make mistakes. Consider verifying important information.
          </span>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
