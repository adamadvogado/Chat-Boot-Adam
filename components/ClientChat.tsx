import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, MoreVertical, Phone, ArrowLeft, Check, CheckCheck, Smile, Smartphone, ChevronDown } from 'lucide-react';
import { BotConfig, ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { MOCK_CHATS } from '../constants';

interface ClientChatProps {
  config: BotConfig;
}

export const ClientChat: React.FC<ClientChatProps> = ({ config }) => {
  // Mobile check to show list or chat
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: `Olá! Sou o ${config.assistantName} da ${config.companyName}. Como posso ajudar com seu caso de trânsito hoje?`, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Scroll functionality
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setUnreadCount(0);
  };

  // Handle scroll detection
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // If user is more than 150px from bottom, show button
    const isDistanceFromBottom = scrollHeight - scrollTop - clientHeight > 150;
    
    setShowScrollBottom(isDistanceFromBottom);
    
    // If user scrolled to bottom, clear unreads
    if (!isDistanceFromBottom) {
      setUnreadCount(0);
    }
  };

  // Auto-scroll logic only when sending or if already near bottom
  useEffect(() => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
    
    const lastMessage = messages[messages.length - 1];
    const isUserMessage = lastMessage?.role === 'user';

    if (isUserMessage || isNearBottom) {
      scrollToBottom();
    } else if (!isUserMessage && messages.length > 1) {
      // If it's a bot message and we are viewing history, increment unread but don't force scroll
      setUnreadCount(prev => prev + 1);
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Call Gemini
    const responseText = await sendMessageToGemini(messages, input, config);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMsg]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-full bg-[#f0f2f5] relative">
      <div className="absolute top-0 w-full h-32 bg-[#00a884] z-0"></div>
      
      <div className="z-10 w-full h-full p-4 md:p-6 lg:p-8 flex justify-center items-center">
        <div className="bg-white w-full max-w-[1400px] h-full rounded-lg shadow-xl flex overflow-hidden">
          
          {/* Sidebar (Chat List) */}
          <div className={`w-full md:w-[400px] flex flex-col border-r border-gray-200 bg-white ${activeChatId !== null ? 'hidden md:flex' : 'flex'}`}>
            
            {/* Header */}
            <div className="h-16 bg-gray-100 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
               <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                 <img src="https://picsum.photos/40/40" alt="Avatar" className="w-full h-full object-cover" />
               </div>
               <div className="flex gap-4 text-gray-500">
                 <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-500"></div>
                 <MoreVertical className="w-6 h-6" />
               </div>
            </div>

            {/* Search */}
            <div className="p-2 bg-white border-b border-gray-100">
              <div className="bg-gray-100 rounded-lg h-9 flex items-center px-4 text-sm text-gray-500">
                Pesquisar ou começar uma nova conversa
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              <div 
                onClick={() => setActiveChatId(999)}
                className={`flex items-center px-3 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${activeChatId === 999 ? 'bg-gray-100' : ''}`}
              >
                 <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mr-3 flex-shrink-0">
                   VC
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-baseline mb-0.5">
                     <span className="font-medium text-gray-900 truncate">Você (Simulação)</span>
                     <span className="text-xs text-gray-400">Agora</span>
                   </div>
                   <div className="text-sm text-gray-500 truncate flex items-center">
                     <CheckCheck className="w-4 h-4 text-blue-500 mr-1" />
                     {messages[messages.length-1]?.text.substring(0, 30)}...
                   </div>
                 </div>
              </div>

              {MOCK_CHATS.map(chat => (
                <div key={chat.id} className="flex items-center px-3 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 opacity-60">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm mr-3 flex-shrink-0">
                    {chat.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-medium text-gray-900 truncate">{chat.name}</span>
                      <span className="text-xs text-gray-400">{chat.time}</span>
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {chat.lastMsg}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-2 bg-yellow-50 text-xs text-yellow-800 text-center border-t border-yellow-100">
              Versão Demo - Apenas o chat "Você" é interativo.
            </div>
          </div>

          {/* Main Chat Area */}
          <div className={`flex-1 flex flex-col bg-[#efeae2] relative ${activeChatId === null ? 'hidden md:flex' : 'flex'}`}>
            {activeChatId === null ? (
              <div className="flex-1 flex flex-col items-center justify-center border-b-8 border-[#00a884]">
                <div className="w-64 h-64 mb-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                   <Smartphone className="w-32 h-32 text-gray-300" />
                </div>
                <h1 className="text-3xl font-light text-gray-600 mb-4">Adam Advocacia Web</h1>
                <p className="text-sm text-gray-500">Envie e receba mensagens sem precisar manter seu celular conectado.</p>
                <p className="text-sm text-gray-500 mt-1">Use o WhatsApp em até 4 aparelhos e 1 celular.</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="h-16 bg-gray-100 px-4 py-2 flex items-center justify-between border-b border-gray-200 z-10">
                  <div className="flex items-center">
                    <button onClick={() => setActiveChatId(null)} className="md:hidden mr-2">
                      <ArrowLeft className="w-6 h-6 text-gray-500" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mr-3">
                      VC
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">Você (Cliente)</span>
                      <span className="text-xs text-gray-500">online hoje às {formatTime(new Date())}</span>
                    </div>
                  </div>
                  <div className="flex gap-6 text-gray-500">
                    <Phone className="w-5 h-5 cursor-pointer" />
                    <MoreVertical className="w-5 h-5 cursor-pointer" />
                  </div>
                </div>

                {/* Messages Area */}
                <div className="relative flex-1 overflow-hidden">
                  <div 
                      ref={chatContainerRef}
                      onScroll={handleScroll}
                      className="h-full overflow-y-auto p-4 md:p-8 space-y-4 scrollbar-hide"
                      style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundRepeat: 'repeat' }}
                  >
                    <div className="flex justify-center mb-4">
                      <span className="bg-[#fff5c4] text-gray-800 text-xs px-3 py-1.5 rounded-lg shadow-sm uppercase font-medium">
                        Mensagens protegidas com criptografia de ponta-a-ponta
                      </span>
                    </div>

                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[85%] md:max-w-[65%] rounded-lg p-2 shadow-sm relative text-sm md:text-base ${
                            msg.role === 'user' 
                            ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none' 
                            : 'bg-white text-gray-900 rounded-tl-none'
                          }`}
                        >
                          <div className="whitespace-pre-wrap pr-4 pb-4">
                            {msg.text}
                          </div>
                          <div className="absolute right-2 bottom-1 text-[10px] text-gray-500 flex items-center gap-1">
                            {formatTime(msg.timestamp)}
                            {msg.role === 'user' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Scroll To Bottom Button */}
                  {showScrollBottom && (
                    <button 
                      onClick={() => scrollToBottom()}
                      className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg border border-gray-200 text-gray-600 transition-all z-20 flex items-center justify-center group"
                    >
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                          {unreadCount}
                        </span>
                      )}
                      <ChevronDown className="w-5 h-5 group-hover:text-green-600" />
                    </button>
                  )}
                </div>

                {/* Input Area */}
                <div className="min-h-[62px] bg-[#f0f2f5] px-4 py-2 flex items-center gap-4 z-10">
                  <Smile className="w-6 h-6 text-gray-500 cursor-pointer" />
                  <Paperclip className="w-6 h-6 text-gray-500 cursor-pointer" />
                  
                  <div className="flex-1 bg-white rounded-lg flex items-center px-4 py-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Mensagem"
                      className="flex-1 outline-none text-gray-700 bg-transparent"
                    />
                  </div>

                  <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={`p-2 rounded-full ${input.trim() ? 'text-[#00a884]' : 'text-gray-400'}`}
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};