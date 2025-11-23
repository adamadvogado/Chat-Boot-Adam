import { BotConfig } from './types';

export const DEFAULT_BOT_CONFIG: BotConfig = {
  companyName: 'Adam Advocacia',
  assistantName: 'Dr. Virtual',
  tone: 'formal',
  contactPhone: '(11) 99999-9999',
  systemInstruction: `Você é um assistente virtual jurídico da Adam Advocacia, especializado em Direito de Trânsito e Defesa de Condutores.
Seu objetivo é realizar uma triagem inicial dos clientes, entender o problema (multa, suspensão de CNH, lei seca, etc.) e coletar informações básicas.
NÃO forneça pareceres jurídicos definitivos ou garantia de causa ganha.
Sempre que o usuário mencionar um caso complexo, oriente-o a agendar uma consulta com um advogado humano.
Mantenha um tom profissional, empático e seguro.
Use a legislação brasileira (CTB - Código de Trânsito Brasileiro) como base.`,
  knowledgeBase: `
- Recurso de Multas: Defesa prévia, JARI e CETRAN.
- Lei Seca: Recusa ao bafômetro gera multa gravíssima e suspensão de 12 meses.
- Suspensão da CNH: Ocorre por pontuação (20, 30 ou 40 pontos) ou infrações mandatórias.
- Cassação da CNH: Ocorre quando dirige suspenso ou reincidência em certas multas.
  `
};

export const MOCK_CHATS = [
  { id: 1, name: 'João Silva', lastMsg: 'Recebi uma multa da PRF...', time: '10:30' },
  { id: 2, name: 'Maria Oliveira', lastMsg: 'Minha CNH foi suspensa.', time: 'Ontem' },
  { id: 3, name: 'Transportadora XYZ', lastMsg: 'Precisamos rever os contratos.', time: 'Terça' },
];