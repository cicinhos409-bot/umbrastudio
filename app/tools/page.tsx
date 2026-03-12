'use client';

import React from 'react';
import { DashboardWrapper } from '@/components/DashboardWrapper';
import { Wrench, Hammer, Box, Cpu, Video } from 'lucide-react';
import { motion } from 'motion/react';

export default function ToolsPage() {
  return (
    <DashboardWrapper>
      <header className="mb-8 lg:mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Ferramentas do Criador</h1>
            <p className="text-zinc-400 text-sm lg:text-base">Uma coleção de ferramentas úteis para todo criador.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center hover:border-indigo-500/50 transition-colors cursor-pointer"
          onClick={() => window.location.href = '/tools/ai-video-generator'}
        >
          <div className="p-4 bg-indigo-500/10 rounded-2xl mb-6">
            <Video className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-lg lg:text-xl font-bold text-white mb-2">Gerador de Vídeo AI</h3>
          <p className="text-zinc-500 text-xs lg:text-sm mb-6">Gere vídeos incríveis usando deAPI e APIFree.</p>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
            Novo
          </span>
        </motion.div>

        {[
          { title: 'Otimizador de Metadados', icon: Cpu, desc: 'Otimize suas tags e descrições de vídeo.' },
          { title: 'Simulador de Teste A/B', icon: Hammer, desc: 'Preveja qual thumbnail terá melhor desempenho.' },
          { title: 'Biblioteca de Ativos', icon: Box, desc: 'Armazene seus ativos de marca, logos e fontes.' },
        ].map((tool, index) => (
          <motion.div
            key={tool.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center"
          >
            <div className="p-4 bg-zinc-800 rounded-2xl mb-6">
              <tool.icon className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-white mb-2">{tool.title}</h3>
            <p className="text-zinc-500 text-xs lg:text-sm mb-6">{tool.desc}</p>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full">
              Em Desenvolvimento
            </span>
          </motion.div>
        ))}
      </div>
    </DashboardWrapper>
  );
}
