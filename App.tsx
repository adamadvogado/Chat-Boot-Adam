import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AdminDashboard } from './components/AdminDashboard';
import { ClientChat } from './components/ClientChat';
import { ConnectDevice } from './components/ConnectDevice';
import { BotConfig } from './types';
import { DEFAULT_BOT_CONFIG } from './constants';

export default function App() {
  const [currentView, setCurrentView] = useState<'admin' | 'chat' | 'connect'>('admin');
  const [botConfig, setBotConfig] = useState<BotConfig>(DEFAULT_BOT_CONFIG);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      setCurrentView('admin');
    }, 2000);
  };

  const renderView = () => {
    switch (currentView) {
      case 'admin':
        return (
          <AdminDashboard 
            config={botConfig} 
            setConfig={setBotConfig} 
            isConnected={isConnected}
            onDisconnect={() => setIsConnected(false)}
          />
        );
      case 'chat':
        return <ClientChat config={botConfig} />;
      case 'connect':
        return <ConnectDevice onConnect={handleConnect} isConnected={isConnected} />;
      default:
        return <AdminDashboard config={botConfig} setConfig={setBotConfig} isConnected={isConnected} onDisconnect={() => setIsConnected(false)} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView}
      isConnected={isConnected}
    >
      {renderView()}
    </Layout>
  );
}