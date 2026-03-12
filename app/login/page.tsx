'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Zap, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-violet-500/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/20">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-3xl font-bold tracking-tight text-white">Umbra</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Acesse sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Ou{' '}
          <Link href="/register" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
            crie sua conta grátis de 7 dias
          </Link>
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-zinc-900/50 py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-zinc-800 backdrop-blur-xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Endereço de Email
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 bg-zinc-950 border border-zinc-800 rounded-xl py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all sm:text-sm"
                  placeholder="voce@exemplo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Senha
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 bg-zinc-950 border border-zinc-800 rounded-xl py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-violet-600 focus:ring-violet-500/50 focus:ring-offset-zinc-950"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-violet-600/20 text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-zinc-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Entrar <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            
            <div>
              <Link
                href="/register"
                className="w-full flex justify-center py-3 px-4 border border-zinc-700 rounded-xl text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 focus:ring-offset-zinc-950 transition-all"
              >
                Criar uma nova conta
              </Link>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900/50 text-zinc-500">Ou continue com</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-3 px-4 border border-zinc-800 rounded-xl shadow-sm bg-zinc-950 text-sm font-medium text-zinc-300 hover:bg-zinc-900 transition-colors">
                <span className="sr-only">Entrar com Google</span>
                <Chrome className="w-5 h-5" />
              </button>
              <button className="w-full inline-flex justify-center py-3 px-4 border border-zinc-800 rounded-xl shadow-sm bg-zinc-950 text-sm font-medium text-zinc-300 hover:bg-zinc-900 transition-colors">
                <span className="sr-only">Entrar com GitHub</span>
                <Github className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
