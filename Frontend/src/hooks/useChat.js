import { useState, useRef, useEffect } from 'react';
import { askCodebaseQuestion } from '../services/api';
import { toast } from 'sonner';

export function useChat(activeRepo) {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  // Load messages when activeRepo changes
  useEffect(() => {
    if (activeRepo) {
      const savedChats = localStorage.getItem(`chat_${activeRepo}`);
      if (savedChats) {
        try {
          setMessages(JSON.parse(savedChats));
        } catch (e) {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, [activeRepo]);

  // Save messages when they change
  useEffect(() => {
    if (activeRepo) {
      localStorage.setItem(`chat_${activeRepo}`, JSON.stringify(messages));
    }
  }, [messages, activeRepo]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const sendMessage = async (text) => {
    if (!text.trim() || !activeRepo) {
      if (!activeRepo) toast.error('Please select a repository first.');
      return;
    }

    // Add user message
    const newUserMessage = { id: Date.now(), role: 'user', content: text };
    setMessages((prev) => [...prev, newUserMessage]);
    
    setIsThinking(true);

    try {
      const response = await askCodebaseQuestion(activeRepo, text);
      const aiResponse = { 
        id: Date.now() + 1, 
        role: 'ai', 
        content: response.answer 
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      toast.error(error.message || 'Failed to get answer from AI.');
      // Add error message to chat
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: `**Error:** Failed to analyze codebase. Ensure the repository has been ingested and the backend is running.`
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const clearChat = () => {
    if (activeRepo) {
      localStorage.removeItem(`chat_${activeRepo}`);
    }
    setMessages([]);
  };

  return {
    messages,
    isThinking,
    sendMessage,
    clearChat,
    messagesEndRef,
  };
}
