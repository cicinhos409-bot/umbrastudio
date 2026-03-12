'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, ExternalLink, X, Save, AlertCircle } from 'lucide-react';

interface ApiKeys {
  pollinations: string;
  apifree: string;
  deapi: string;
  groq: string;
  ollama: string;
  openrouter: string;
}

const defaultKeys: ApiKeys = {
  pollinations: '',
  apifree: '',
  deapi: '',
  groq: '',
  ollama: '',
  openrouter: '',
};

const providers = [
  { id: 'pollinations', name: 'Pollinations API', url: 'https://enter.pollinations.ai/' },
  { id: 'apifree', name: 'APIFree', url: 'https://www.apifree.ai/manage/api-keys' },
  { id: 'deapi', name: 'DeAPI', url: 'https://deapi.ai/settings/api-keys' },
  { id: 'groq', name: 'Groq', url: 'https://console.groq.com/keys' },
  { id: 'ollama', name: 'Ollama Cloud', url: 'https://ollama.com/settings/keys' },
  { id: 'openrouter', name: 'OpenRouter', url: 'https://openrouter.ai/settings/keys' },
];

export function ApiKeyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [keys, setKeys] = useState<ApiKeys>(defaultKeys);
  const [error, setError] = useState('');
  const [hasSavedKeys, setHasSavedKeys] = useState(false);

  useEffect(() => {
    const savedKeys = localStorage.getItem('umbra_api_keys');
    if (savedKeys) {
      setKeys(JSON.parse(savedKeys));
      setHasSavedKeys(true);
    }

    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('umbra_open_api_modal', handleOpenModal);
    return () => window.removeEventListener('umbra_open_api_modal', handleOpenModal);
  }, []);

  const handleSave = () => {
    // Check if at least one key is provided (or make specific ones mandatory if needed)
    const hasAnyKey = Object.values(keys).some(key => key.trim() !== '');
    
    if (!hasAnyKey) {
      setError('Por favor, preencha pelo menos uma chave de API para continuar.');
      return;
    }

    localStorage.setItem('umbra_api_keys', JSON.stringify(keys));
    setHasSavedKeys(true);
    setIsOpen(false);
    setError('');
    
    // Optional: Dispatch an event so other components know keys were updated
    window.dispatchEvent(new Event('umbra_keys_updated'));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Configuração de APIs</h2>
                  <p className="text-sm text-zinc-400">Configure suas chaves para usar as ferramentas</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-300">
                Para utilizar os geradores de texto, imagem, vídeo e áudio, você precisa configurar suas chaves de API. 
                Os links para obter cada chave estão disponíveis abaixo.
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-zinc-300">
                        {provider.name}
                      </label>
                      <a 
                        href={provider.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                      >
                        Obter chave <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <input
                      type="password"
                      value={keys[provider.id as keyof ApiKeys]}
                      onChange={(e) => setKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                      placeholder={`Cole sua chave da ${provider.name} aqui...`}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 bg-zinc-950 shrink-0 flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-colors"
              >
                Configurar depois
              </button>
              <button
                onClick={handleSave}
                className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
              >
                <Save className="w-5 h-5" />
                Salvar Chaves de API
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
