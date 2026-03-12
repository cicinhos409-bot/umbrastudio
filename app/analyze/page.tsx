'use client';

import React, { useState, useRef } from 'react';
import { DashboardWrapper } from '@/components/DashboardWrapper';
import { 
  Image as ImageIcon, 
  ArrowLeft, 
  Upload, 
  Loader2, 
  Zap, 
  AlertCircle,
  Eye,
  Type,
  Palette,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { generateText, POLLINATIONS_MODELS } from '@/lib/pollinations';
import Markdown from 'react-markdown';
import { ModelSelector } from '@/components/ModelSelector';
import { Cpu } from 'lucide-react';

import Image from 'next/image';

export default function AnalyzePage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-airforce');
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);

    try {
      const prompt = `Analise esta thumbnail de vídeo para virality. Forneça:
      1. Viral Score (0-100)
      2. Análise de Contraste (A imagem chama a atenção?)
      3. Análise de Emoção (Qual emoção ela transmite?)
      4. Legibilidade (O texto/assunto está claro?)
      5. Fator de Curiosidade (Faz as pessoas quererem clicar?)
      6. Sugestões de melhoria.
      Retorne em formato markdown com cabeçalhos claros e em português.`;

      const data = await generateText(prompt, selectedModel, image);
      const text = typeof data === 'string' ? data : data?.text || data?.content || JSON.stringify(data);
      
      setResult(text || 'No analysis generated.');
    } catch (error) {
      console.error('Analysis error:', error);
      setResult('Error analyzing thumbnail. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardWrapper>
      <button 
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 lg:mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar ao Início
      </button>

      <div className="max-w-5xl mx-auto">
        <header className="mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="p-3 bg-sky-500/10 rounded-xl text-sky-500">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Analisador de Thumbnail</h1>
              <p className="text-zinc-400 text-sm lg:text-base">Faça upload da sua thumbnail para obter um viral score e feedback por IA.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
              <ModelSelector 
                label="Modelo de IA" 
                models={POLLINATIONS_MODELS.allText} 
                selectedModel={selectedModel} 
                onModelChange={setSelectedModel}
                icon={Cpu}
              />
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-video bg-zinc-900/40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                image ? 'border-indigo-500/50' : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {image ? (
                <Image 
                  src={image} 
                  alt="Thumbnail preview" 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <>
                  <div className="p-4 bg-zinc-800 rounded-full mb-4">
                    <Upload className="w-8 h-8 text-zinc-400" />
                  </div>
                  <p className="text-zinc-400 font-medium">Clique para fazer upload</p>
                  <p className="text-zinc-600 text-sm mt-1">PNG, JPG até 5MB</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !image}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analisando Design...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Obter Viral Score
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 lg:p-8"
                >
                  <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-strong:text-indigo-400 prose-ul:text-zinc-300 text-sm lg:text-base">
                    <Markdown>{result}</Markdown>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[300px] bg-zinc-900/20 border border-zinc-800 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 lg:p-12 text-center"
                >
                  <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-8">
                    <div className="p-3 lg:p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                      <Eye className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-500 mb-2 mx-auto" />
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Contraste</span>
                    </div>
                    <div className="p-3 lg:p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                      <Type className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-500 mb-2 mx-auto" />
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Legibilidade</span>
                    </div>
                    <div className="p-3 lg:p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                      <Palette className="w-5 h-5 lg:w-6 lg:h-6 text-rose-500 mb-2 mx-auto" />
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Cor</span>
                    </div>
                    <div className="p-3 lg:p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                      <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500 mb-2 mx-auto" />
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Viral Score</span>
                    </div>
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-white mb-2">Pronto para Análise</h3>
                  <p className="text-zinc-500 text-sm max-w-xs">Faça upload do seu design e clique em analisar para ver como ele se sai em relação aos padrões virais.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}
