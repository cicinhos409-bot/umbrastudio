'use client';

import React, { useState } from 'react';
import { DashboardWrapper } from '@/components/DashboardWrapper';
import { ToolCard } from '@/components/ToolCard';
import { 
  Type, 
  Anchor, 
  FileText, 
  Zap, 
  Lightbulb, 
  Image as ImageIcon, 
  MessageSquare, 
  Calendar 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const tools = [
    { id: 'titles', title: 'Gerador de Títulos Virais', description: 'Gere títulos com alto CTR para seus vídeos.', icon: Type, color: 'indigo' },
    { id: 'hooks', title: 'Gerador de Hooks', description: 'Crie aberturas magnéticas para vídeos curtos.', icon: Anchor, color: 'emerald' },
    { id: 'scripts', title: 'Gerador de Roteiros', description: 'Roteiros estruturados para vídeos de 1 a 5 minutos.', icon: FileText, color: 'rose' },
    { id: 'shorts', title: 'Roteiros para Shorts AI', description: 'Roteiros dinâmicos para TikTok, Reels e Shorts.', icon: Zap, color: 'amber' },
    { id: 'ideas', title: 'Gerador de Ideias', description: 'Nunca fique sem ideias de conteúdo para seu nicho.', icon: Lightbulb, color: 'violet' },
    { id: 'thumbnail', title: 'Analisador de Thumbnail', description: 'Obtenha um Viral Score para suas miniaturas.', icon: ImageIcon, color: 'sky', route: '/analyze' },
    { id: 'captions', title: 'Gerador de Legendas', description: 'Legendas virais para Instagram e TikTok.', icon: MessageSquare, color: 'indigo' },
    { id: 'calendar', title: 'Calendário de Conteúdo', description: 'Estratégia de conteúdo de 30 dias gerada por IA.', icon: Calendar, color: 'emerald' },
    { id: 'video-gen', title: 'Gerador de Vídeo AI', description: 'Gere vídeos incríveis usando deAPI e APIFree.', icon: Zap, color: 'purple', route: '/tools/ai-video-generator' },
  ];

  return (
    <DashboardWrapper>
      <header className="mb-8 lg:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Bem-vindo, Criador</h1>
          <p className="text-zinc-400">O que vamos construir hoje?</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ToolCard 
              {...tool} 
              onClick={() => router.push(tool.route || `/create?tool=${tool.id}`)} 
            />
          </motion.div>
        ))}
      </div>

      <section className="mt-12 lg:mt-16">
        <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 rounded-2xl lg:rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-xl lg:text-2xl font-bold text-white mb-4">Viralize com o Umbra Pro</h2>
            <p className="text-zinc-300 mb-6 text-sm lg:text-base">Desbloqueie gerações ilimitadas, modelos de roteiro premium e análise profunda de thumbnails. Junte-se a 5.000+ criadores crescendo mais rápido.</p>
            <button className="w-full md:w-auto px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">
              Iniciar Teste Grátis de 7 Dias
            </button>
          </div>
          <div className="relative w-full max-w-[200px] lg:max-w-[300px] aspect-square bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl" />
            <Zap className="w-16 h-16 lg:w-24 lg:h-24 text-indigo-500 fill-indigo-500/20 relative z-10" />
          </div>
        </div>
      </section>
    </DashboardWrapper>
  );
}
