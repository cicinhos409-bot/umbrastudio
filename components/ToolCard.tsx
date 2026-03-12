'use client';

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
}

export function ToolCard({ title, description, icon: Icon, onClick, color = "indigo" }: ToolCardProps) {
  const colorClasses: Record<string, string> = {
    indigo: "text-indigo-500 bg-indigo-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    rose: "text-rose-500 bg-rose-500/10",
    amber: "text-amber-500 bg-amber-500/10",
    violet: "text-violet-500 bg-violet-500/10",
    sky: "text-sky-500 bg-sky-500/10",
  };

  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="flex flex-col items-start p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-left hover:border-zinc-700 transition-all group"
    >
      <div className={`p-3 rounded-xl mb-4 ${colorClasses[color] || colorClasses.indigo}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </motion.button>
  );
}
