'use client';

import React from 'react';
import { DashboardWrapper } from '@/components/DashboardWrapper';
import { TrendingUp, ArrowUpRight, Users, Eye, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function GrowPage() {
  const stats = [
    { label: 'Visualizações Totais', value: '1.2M', change: '+12%', icon: Eye },
    { label: 'Inscritos', value: '45.2K', change: '+5.4%', icon: Users },
    { label: 'Engajamento', value: '8.9%', change: '+2.1%', icon: Zap },
  ];

  return (
    <DashboardWrapper>
      <header className="mb-8 lg:mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Cresça seu Canal</h1>
            <p className="text-zinc-400 text-sm lg:text-base">Acompanhe seu progresso e otimize sua estratégia de crescimento.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <stat.icon className="w-5 h-5 text-zinc-400" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-zinc-500 font-medium mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl lg:rounded-3xl p-8 lg:p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-8 h-8 text-indigo-500" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-4">Análise Avançada em Breve</h2>
          <p className="text-zinc-400 text-sm lg:text-base mb-8">Estamos construindo integrações profundas com as APIs do YouTube e Instagram para fornecer insights de crescimento em tempo real.</p>
          <button className="w-full sm:w-auto px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors">
            Me Notifique
          </button>
        </div>
      </div>
    </DashboardWrapper>
  );
}
