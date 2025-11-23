import React, { useEffect, useState, useRef } from 'react';
import { Smartphone, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

interface ConnectDeviceProps {
  onConnect: () => void;
  isConnected: boolean;
}

export const ConnectDevice: React.FC<ConnectDeviceProps> = ({ onConnect, isConnected }) => {
  const [loading, setLoading] = useState(false);
  const [qrMatrix, setQrMatrix] = useState<boolean[][]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  
  // Função para gerar um padrão de QR Code aleatório
  const generateQR = () => {
    const size = 21; // Tamanho da matriz (21x21 é comum para QR simples)
    const newMatrix = Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => Math.random() > 0.5)
    );
    
    // Adicionar marcadores de posição (os quadrados nos cantos)
    const addMarker = (r: number, c: number) => {
      for(let i=0; i<7; i++) {
        for(let j=0; j<7; j++) {
          if((i===0||i===6||j===0||j===6) || (i>=2&&i<=4&&j>=2&&j<=4)) {
             if(r+i < size && c+j < size) newMatrix[r+i][c+j] = true;
          } else {
             if(r+i < size && c+j < size) newMatrix[r+i][c+j] = false;
          }
        }
      }
    };

    addMarker(0, 0);
    addMarker(0, size-7);
    addMarker(size-7, 0);
    
    setQrMatrix(newMatrix);
    setTimeLeft(15);
  };

  // Inicializar e configurar o temporizador de atualização do QR Code
  useEffect(() => {
    if (isConnected) return;

    generateQR();
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateQR();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected && !loading) {
      // Simulate checking status
    }
  }, [isConnected, loading]);

  const handleSimulateScan = () => {
    setLoading(true);
    onConnect();
  };

  if (isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-200 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">WhatsApp Conectado</h2>
          <p className="text-slate-500 mb-8">
            O sistema Adam Advocacia está sincronizado e pronto para responder seus clientes automaticamente.
          </p>
          <div className="bg-slate-100 rounded-lg p-4 text-sm text-slate-600">
            Sessão ativa: <strong>Adam Office Main</strong><br/>
            Latência: <strong>24ms</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-100 p-6">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Side: Instructions */}
        <div className="p-10 md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Conectar WhatsApp</h2>
          <ol className="space-y-6 text-slate-600">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center">1</span>
              <div>
                <p className="font-semibold text-slate-800">Abra o WhatsApp no seu celular</p>
                <p className="text-sm">Certifique-se que está na versão mais recente.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center">2</span>
              <div>
                <p className="font-semibold text-slate-800">Toque em Menu ou Configurações</p>
                <p className="text-sm">Selecione "Aparelhos Conectados".</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center">3</span>
              <div>
                <p className="font-semibold text-slate-800">Aponte para a tela</p>
                <p className="text-sm">Capture o código QR exibido ao lado.</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Right Side: QR Code Simulation */}
        <div className="md:w-1/2 bg-slate-900 flex flex-col items-center justify-center p-10 relative">
          <div className="relative group cursor-pointer" onClick={handleSimulateScan}>
            {/* QR Code Container */}
            <div className="w-64 h-64 bg-white p-4 rounded-xl shadow-2xl relative overflow-hidden flex items-center justify-center">
               {loading ? (
                 <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
                   <div className="text-center">
                     <Loader2 className="w-10 h-10 text-amber-600 animate-spin mx-auto mb-2" />
                     <p className="text-sm font-semibold text-slate-600">Autenticando...</p>
                   </div>
                 </div>
               ) : (
                 <div className="w-full h-full relative">
                    {/* Render Dynamic Matrix */}
                    <div 
                      className="w-full h-full grid gap-[1px]" 
                      style={{ 
                        gridTemplateColumns: `repeat(${qrMatrix.length}, 1fr)`,
                        gridTemplateRows: `repeat(${qrMatrix.length}, 1fr)`
                      }}
                    >
                      {qrMatrix.map((row, i) => 
                        row.map((cell, j) => (
                          <div 
                            key={`${i}-${j}`} 
                            className={`${cell ? 'bg-slate-900' : 'bg-transparent'}`} 
                          />
                        ))
                      )}
                    </div>

                    {/* Logo in middle */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 rounded-full shadow-lg z-10">
                       <Smartphone className="w-6 h-6 text-slate-900" />
                    </div>
                    
                    {/* Blur overlay when refreshing soon */}
                    {timeLeft <= 2 && (
                       <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center transition-all">
                          <RefreshCw className="w-8 h-8 text-slate-800 animate-spin" />
                       </div>
                    )}
                 </div>
               )}
            </div>
            
            {!loading && (
              <div className="absolute -bottom-10 left-0 right-0 text-center flex flex-col items-center gap-2">
                <div className="w-full max-w-[150px] h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                  ></div>
                </div>
                <p className="text-slate-400 text-xs">
                  Atualizando código em {timeLeft}s <br/>
                  <span className="opacity-50">(Clique no QR para simular scan)</span>
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};