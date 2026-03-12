'use client';

import React from 'react';
import { Cpu } from 'lucide-react';

interface Model {
  id: string;
  name: string;
}

interface ModelSelectorProps {
  label: string;
  models: Model[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  icon?: React.ElementType;
}

export function ModelSelector({ 
  label, 
  models, 
  selectedModel, 
  onModelChange,
  icon: Icon = Cpu
}: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
        <Icon className="w-3 h-3" /> {label}
      </label>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}
