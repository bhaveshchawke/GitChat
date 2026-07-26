import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Bot } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "flex max-w-[85%] gap-4 rounded-2xl p-5 shadow-lg transition-all",
        isUser 
          ? "bg-white text-black rounded-br-sm" 
          : "bg-zinc-900 text-white border border-zinc-800 rounded-bl-sm"
      )}>
        {/* Avatar */}
        <div className="flex-shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shadow-inner">
              <User size={18} className="text-white" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md">
              <Bot size={18} className="text-black" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const [copied, setCopied] = useState(false);
                    const codeString = String(children).replace(/\n$/, '');

                    const handleCopy = () => {
                      navigator.clipboard.writeText(codeString);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    };

                    if (!inline && match) {
                      return (
                        <div className="relative mt-4 mb-4 rounded-lg overflow-hidden border border-slate-700 bg-[#1e1e1e]">
                          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                            <span className="text-xs font-mono text-gray-400">{match[1]}</span>
                            <button
                              onClick={handleCopy}
                              className="text-gray-400 hover:text-white transition-colors"
                              title="Copy code"
                            >
                              {copied ? <Check size={16} className="text-white" /> : <Copy size={16} />}
                            </button>
                          </div>
                          <SyntaxHighlighter
                            {...props}
                            children={codeString}
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              background: 'transparent',
                              padding: '1rem',
                            }}
                          />
                        </div>
                      );
                    }
                    return (
                      <code {...props} className={cn("bg-zinc-800 px-1.5 py-0.5 rounded text-white border border-zinc-700", className)}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
