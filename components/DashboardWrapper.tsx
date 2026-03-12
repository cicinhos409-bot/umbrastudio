'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Menu, Zap } from 'lucide-react';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-zinc-950">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ApiKeyModal />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-800 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Umbra</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-zinc-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </header>

          <main className="flex-1 lg:ml-64 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
