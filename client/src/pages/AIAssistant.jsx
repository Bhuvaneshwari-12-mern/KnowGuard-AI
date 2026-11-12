import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Send, Bot, User, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your KnowGuard AI assistant. Ask me anything about your organization\'s projects, processes, or documents.', sources: [] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text, sources: [] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/assistant/ask', { question: text });
      const aiMessage = { 
        role: 'assistant', 
        content: response.data.answer,
        sources: response.data.sources
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error searching the knowledge base.', sources: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  const suggestions = [
    "How does the database backup work?",
    "What is the AtomQuest 2026 project?",
    "Are there any critical processes?"
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Knowledge Assistant</h2>
          <p className="text-slate-500 mt-1 text-lg">Ask questions about your organization's documented knowledge.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-indigo-100 shadow-sm">
          <Sparkles size={16} /> Local Retriever Active
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Chat Header bar */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">KnowGuard AI</h3>
              <p className="text-slate-400 text-xs">Connected to Knowledge Base</p>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8 bg-slate-50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-4 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : ''}`}>
              
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot size={22} className="text-white" />
                </div>
              )}
              
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-3xl rounded-tr-sm px-6 py-4 shadow-md' : 'bg-white text-slate-700 rounded-3xl rounded-tl-sm px-6 py-5 border border-slate-200 shadow-sm'}`}>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.content}</p>
                
                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Sources Referenced</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-default">
                          <BookOpen size={14} className="text-indigo-500" />
                          {src.title}
                          {src.isCritical && <AlertCircle size={14} className="text-red-500 ml-1" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-2xl bg-slate-300 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <User size={22} className="text-slate-700" />
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-4 animate-fade-in-up">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot size={22} className="text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-sm px-6 py-5 shadow-sm flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white border-t border-slate-200">
          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {suggestions.map((sug, i) => (
                <button key={i} onClick={() => handleSend(sug)} 
                  className="whitespace-nowrap bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 text-sm font-medium px-4 py-2 rounded-full transition-all shadow-sm">
                  {sug}
                </button>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something like: How does the database backup work?"
              className="flex-1 px-5 py-3.5 bg-slate-100 border border-transparent focus:border-indigo-300 focus:bg-white rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-[15px]"
            />
            <button type="submit" disabled={loading || !input.trim()} 
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center group">
              <Send size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}