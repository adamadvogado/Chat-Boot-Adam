import React, { useState } from 'react';
import { BotConfig } from '../types';
import { Save, RefreshCw, Power } from 'lucide-react';

interface AdminDashboardProps {
  config: BotConfig;
  setConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
  isConnected: boolean;
  onDisconnect: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ config, setConfig, isConnected, onDisconnect }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof BotConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API save
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Painel de Controle</h2>
          <p className="text-slate-500 mt-1">Configure o comportamento do assistente virtual da Adam Advocacia.</p>
        </div>
        <div className="flex gap-3">
          {isConnected && (
            <button 
              onClick={onDisconnect}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium flex items-center gap-2 transition-colors"
            >
              <Power className="w-4 h-4" />
              Desconectar
            </button>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Identity */}
        <div className="space-y-6 lg:col-span-1">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-600 rounded-full"></span>
              Identidade
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Empresa</label>
                <input
                  type="text"
                  value={config.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Assistente</label>
                <input
                  type="text"
                  value={config.assistantName}
                  onChange={(e) => handleChange('assistantName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone de Contato</label>
                <input
                  type="text"
                  value={config.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tom de Voz</label>
                <select
                  value={config.tone}
                  onChange={(e) => handleChange('tone', e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white"
                >
                  <option value="formal">Formal & Jurídico</option>
                  <option value="amigavel">Amigável & Acessível</option>
                  <option value="assertivo">Assertivo & Direto</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
             <h4 className="font-bold text-indigo-900 mb-2">Dica Pro</h4>
             <p className="text-sm text-indigo-700">
               Mantenha o tom de voz "Formal" para passar mais credibilidade em casos de Direito de Trânsito, mas use o Prompt do Sistema para instruir empatia.
             </p>
          </section>
        </div>

        {/* Right Column - Intelligence */}
        <div className="space-y-6 lg:col-span-2">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-600 rounded-full"></span>
              Inteligência Artificial (Prompt do Sistema)
            </h3>
            
            <div className="flex-1 space-y-4 flex flex-col">
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Instrução Principal
                  <span className="text-xs font-normal text-slate-500 ml-2">(Define como o bot deve se comportar)</span>
                </label>
                <textarea
                  value={config.systemInstruction}
                  onChange={(e) => handleChange('systemInstruction', e.target.value)}
                  className="flex-1 w-full min-h-[200px] px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none text-slate-700 leading-relaxed font-mono text-sm"
                  placeholder="Descreva aqui como o bot deve agir..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Base de Conhecimento Rápido
                  <span className="text-xs font-normal text-slate-500 ml-2">(Fatos e dados específicos da advocacia)</span>
                </label>
                <textarea
                  value={config.knowledgeBase}
                  onChange={(e) => handleChange('knowledgeBase', e.target.value)}
                  className="w-full min-h-[120px] px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none text-slate-700 font-mono text-sm"
                  placeholder="- O escritório funciona das 9h às 18h..."
                />
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};