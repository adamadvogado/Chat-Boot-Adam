import React from 'react';
import { MessageSquare, Settings, Smartphone, Shield, AlertCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'admin' | 'chat' | 'connect';
  onChangeView: (view: 'admin' | 'chat' | 'connect') => void;
  isConnected: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, isConnected }) => {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-amber-600 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Adam Advocacia</h1>
            <p className="text-xs text-slate-400">Sistema Inteligente</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          <button
            onClick={() => onChangeView('admin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'admin' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações AI</span>
          </button>

          <button
            onClick={() => onChangeView('connect')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'connect' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Conexão WhatsApp</span>
              <span className={`text-[10px] uppercase font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </button>

          <div className="pt-6 mt-6 border-t border-slate-800">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase mb-2">Simulação Cliente</p>
            <button
              onClick={() => onChangeView('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'chat' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Testar Chatbot</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          v1.0.4 &bull; Adam System
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {!isConnected && currentView === 'chat' && (
           <div className="bg-red-500 text-white px-4 py-2 text-sm text-center flex items-center justify-center gap-2">
             <AlertCircle className="w-4 h-4" />
             Atenção: O sistema não está conectado ao WhatsApp. O chat abaixo é apenas uma simulação local.
           </div>
        )}
        <div className="flex-1 overflow-auto bg-slate-50 relative">
            {children}
        </div>
      </main>
    </div>
  );
};