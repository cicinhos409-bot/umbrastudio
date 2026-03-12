'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Video, 
  TrendingUp, 
  BarChart3, 
  Wrench, 
  Settings,
  Zap,
  X,
  LogOut,
  FileText,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/lib/auth-context';

const menuItems = [
  { name: 'Início', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Criar', icon: PlusCircle, href: '/create' },
  { name: 'Editar', icon: Video, href: '/edit' },
  { name: 'Crescer', icon: TrendingUp, href: '/grow' },
  { name: 'Analisar', icon: BarChart3, href: '/analyze' },
  { name: 'Ferramentas', icon: Wrench, href: '/tools' },
  { name: 'Notas', icon: FileText, href: '/notes' },
  { name: 'Eventos', icon: Calendar, href: '/events' },
  { name: 'Checklists', icon: CheckSquare, href: '/checklists' },
  { name: 'Configurações', icon: Settings, href: '/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "flex flex-col h-screen w-64 bg-zinc-950 border-r border-zinc-800 fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Umbra</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive 
                    ? "bg-violet-600/10 text-violet-400 border border-violet-500/20" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-violet-400" : "text-zinc-500")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto space-y-4">
          <button
            onClick={() => window.dispatchEvent(new Event('umbra_open_api_modal'))}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-500 hover:bg-amber-500/10 border border-amber-500/20 transition-all"
          >
            <Zap className="w-4 h-4" />
            Configurar APIs
          </button>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Seu Plano</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">Plano Grátis</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">5/5 diários</span>
            </div>
            <button className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-violet-600/20 mb-3">
              Upgrade para Pro
            </button>
            <button 
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors text-xs font-medium"
            >
              <LogOut className="w-3 h-3" />
              Sair da conta
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
