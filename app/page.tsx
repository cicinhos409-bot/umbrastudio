'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Bebas_Neue, Syne, DM_Sans } from 'next/font/google';
import { ArrowRight, Play, CheckCircle2, Zap, Video, TrendingUp, Users, Target, Edit3, Smartphone, Image as ImageIcon, Calendar, MessageSquare, Lightbulb } from 'lucide-react';

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm' });

export default function LandingPage() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let requestRef: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = `${mx - 6}px`;
      cursor.style.top = `${my - 6}px`;
    };

    const animateRing = () => {
      rx += (mx - rx - 20) * 0.12;
      ry += (my - ry - 20) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestRef = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestRef = requestAnimationFrame(animateRing);

    const interactiveElements = document.querySelectorAll('a, button');
    const onEnter = () => { cursor.style.transform = 'scale(2.5)'; };
    const onLeave = () => { cursor.style.transform = 'scale(1)'; };

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(requestRef);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <div className={`min-h-screen bg-[#060608] text-[#F5F3EE] ${dmSans.className} ${bebasNeue.variable} ${syne.variable} overflow-x-hidden selection:bg-violet-500/30 cursor-none`}>
      {/* Custom Cursor */}
      <div ref={cursorRef} className="fixed top-0 left-0 w-3 h-3 bg-violet-500 rounded-full pointer-events-none z-[9999] transition-transform duration-150 mix-blend-difference" />
      <div ref={ringRef} className="fixed top-0 left-0 w-10 h-10 border border-violet-500/50 rounded-full pointer-events-none z-[9998] transition-all duration-300" />

      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1000] opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")' }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[500] px-6 md:px-12 py-5 flex items-center justify-between bg-gradient-to-b from-[#060608]/95 to-transparent backdrop-blur-md border-b border-[#F5F3EE]/10">
        <Link href="/" className="font-bebas text-3xl tracking-[4px] text-[#F5F3EE] hover:opacity-80 transition-opacity">
          UMBR<span className="text-violet-500">A</span>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <a href="#ferramentas" className="text-[#6B6B74] hover:text-[#F5F3EE] text-sm tracking-wide transition-colors">Ferramentas</a>
          <a href="#precos" className="text-[#6B6B74] hover:text-[#F5F3EE] text-sm tracking-wide transition-colors">Preços</a>
          <a href="#" className="text-[#6B6B74] hover:text-[#F5F3EE] text-sm tracking-wide transition-colors">Blog</a>
          <a href="#" className="text-[#6B6B74] hover:text-[#F5F3EE] text-sm tracking-wide transition-colors">Suporte</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-[#F5F3EE] text-sm font-medium px-5 py-2.5 border border-[#F5F3EE]/10 rounded hover:border-[#F5F3EE] transition-all">
            Entrar
          </Link>
          <Link href="/login" className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-6 py-2.5 rounded tracking-wide transition-all hover:-translate-y-0.5">
            Começar Grátis →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-start px-6 md:px-12 pt-[140px] pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(139,92,246,0.12)_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(167,139,250,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,243,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,243,238,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_50%_50%,black_20%,transparent_80%)]" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 px-4 py-1.5 rounded-full text-xs font-medium text-violet-400 tracking-widest uppercase mb-8 relative z-10"
        >
          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
          IA de última geração para criadores
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="font-bebas text-[clamp(72px,10vw,140px)] leading-[0.92] tracking-[2px] max-w-[900px] mb-8 relative z-10"
        >
          CRIE<br />
          <span className="text-violet-500">VÍDEOS</span><br />
          <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(245,243,238,0.4)' }}>VIRAIS</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-[clamp(16px,1.8vw,20px)] text-[#F5F3EE]/60 max-w-[560px] leading-[1.7] font-light mb-12 relative z-10"
        >
          Gere roteiros, títulos, thumbnails e estratégias completas com IA. 
          Acelere seu crescimento no YouTube, TikTok e Instagram.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-wrap items-center gap-5 mb-16 relative z-10"
        >
          <Link href="/login" className="inline-flex items-center gap-2.5 bg-violet-600 hover:bg-violet-500 text-white text-base font-semibold px-9 py-4 rounded transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(139,92,246,0.3)] tracking-wide group">
            Criar Conta Grátis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="inline-flex items-center gap-2.5 border border-[#F5F3EE]/10 hover:border-[#F5F3EE]/40 hover:bg-[#F5F3EE]/5 text-[#F5F3EE] text-base font-medium px-8 py-4 rounded transition-all">
            <Play className="w-4 h-4 fill-current" /> Ver Demo
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="flex gap-12 relative z-10"
        >
          <div>
            <div className="font-bebas text-[42px] tracking-[2px] leading-none text-[#F5F3EE]">12<span className="text-violet-500">K+</span></div>
            <div className="text-[13px] text-[#6B6B74] mt-1">Criadores ativos</div>
          </div>
          <div>
            <div className="font-bebas text-[42px] tracking-[2px] leading-none text-[#F5F3EE]">4<span className="text-violet-500">M+</span></div>
            <div className="text-[13px] text-[#6B6B74] mt-1">Conteúdos gerados</div>
          </div>
          <div>
            <div className="font-bebas text-[42px] tracking-[2px] leading-none text-[#F5F3EE]">3<span className="text-violet-500">X</span></div>
            <div className="text-[13px] text-[#6B6B74] mt-1">Mais engajamento</div>
          </div>
        </motion.div>

        {/* Floating Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30, y: '-50%' }}
          animate={{ opacity: 1, x: 0, y: '-50%' }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="hidden lg:block absolute right-[8%] top-1/2 w-[340px] bg-[#1A1A1F]/80 border border-[#F5F3EE]/10 rounded-2xl p-7 backdrop-blur-xl z-20"
        >
          <div className="flex items-center justify-between mb-5">
            <span className="text-[13px] text-[#6B6B74]">Gerador de Títulos</span>
            <span className="bg-green-500/15 border border-green-500/30 text-green-500 text-[11px] px-2.5 py-1 rounded-full font-medium">● Ao vivo</span>
          </div>
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4 mb-3">
            <p className="text-sm leading-[1.6] text-[#F5F3EE]">"Por que 97% dos criadores <strong>NUNCA chegam a 10K</strong> seguidores (e como evitar)"</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-[#6B6B74]">CTR Score</span>
              <div className="flex-1 h-1 bg-[#F5F3EE]/10 rounded-full mx-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '87%' }}
                  transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" 
                />
              </div>
              <span className="text-[13px] font-bold text-fuchsia-400">87%</span>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2.5 border-t border-[#F5F3EE]/10">
            <div className="w-8 h-8 bg-violet-500/15 rounded-lg flex items-center justify-center text-violet-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[13px] font-medium text-[#F5F3EE]">Análise de Viral Score</div>
              <div className="text-[11px] text-[#6B6B74]">Analisando potencial...</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Logos Strip */}
      <div className="py-12 border-y border-[#F5F3EE]/10 relative overflow-hidden flex flex-col items-center">
        <div className="absolute left-0 top-0 bottom-0 w-[120px] bg-gradient-to-r from-[#060608] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-[120px] bg-gradient-to-l from-[#060608] to-transparent z-10" />
        <p className="text-center text-xs text-[#6B6B74] uppercase tracking-[2px] mb-7">Criadores de conteúdo de todo o Brasil usam o Umbra</p>
        <div className="flex gap-16 items-center animate-[scroll_20s_linear_infinite] w-max">
          {['YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'KWAI', 'PINTEREST', 'LINKEDIN', 'YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'KWAI', 'PINTEREST', 'LINKEDIN'].map((logo, i) => (
            <span key={i} className="font-syne text-lg font-bold text-[#F5F3EE]/20 tracking-[1px] hover:text-[#F5F3EE]/50 transition-colors cursor-default">
              {logo}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="ferramentas" className="py-[120px] px-6 md:px-12 bg-[#060608]">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 text-[12px] text-violet-500 uppercase tracking-[2px] font-semibold mb-5 before:content-[''] before:w-6 before:h-px before:bg-violet-500">
            O que você ganha
          </div>
          <h2 className="font-bebas text-[clamp(48px,6vw,80px)] leading-[0.95] tracking-[1px] mb-5">TUDO QUE<br/>VOCÊ PRECISA</h2>
          <p className="text-lg text-[#F5F3EE]/55 max-w-[520px] mx-auto leading-[1.7] font-light">Ferramentas criadas especificamente para os desafios dos criadores modernos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#F5F3EE]/10 border border-[#F5F3EE]/10 rounded-2xl overflow-hidden">
          {[
            { num: '01', icon: Target, title: 'Títulos com Alto CTR', desc: 'Gere títulos irresistíveis com pontuação de cliques analisada por IA antes mesmo de publicar.' },
            { num: '02', icon: Zap, title: 'Hooks Magnéticos', desc: 'Aberturas que prendem o espectador nos primeiros 3 segundos cruciais do seu vídeo.' },
            { num: '03', icon: Edit3, title: 'Roteiros Completos', desc: 'Roteiros estruturados de 1 a 5 minutos, prontos para gravar com fluxo narrativo natural.' },
            { num: '04', icon: Smartphone, title: 'Shorts & Reels', desc: 'Roteiros dinâmicos e verticais otimizados para TikTok, Instagram Reels e YouTube Shorts.' },
            { num: '05', icon: ImageIcon, title: 'Análise de Thumbnail', desc: 'Descubra o potencial viral da sua miniatura com um Viral Score detalhado antes de publicar.' },
            { num: '06', icon: Calendar, title: 'Calendário 30 Dias', desc: 'Uma estratégia completa de conteúdo gerada por IA para o seu nicho, com datas e temas.' },
          ].map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#060608] p-10 relative group hover:bg-[#1A1A1F]/90 transition-colors overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(139,92,246,0.08)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="font-bebas text-[13px] tracking-[2px] text-violet-500 mb-5 relative z-10">{feat.num}</div>
              <div className="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center mb-6 relative z-10">
                <feat.icon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-syne text-xl font-bold mb-3 relative z-10">{feat.title}</h3>
              <p className="text-sm text-[#6B6B74] leading-[1.7] relative z-10">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tools Preview Section */}
      <section className="py-[120px] px-6 md:px-12 bg-[#1A1A1F]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[12px] text-violet-500 uppercase tracking-[2px] font-semibold mb-5 before:content-[''] before:w-6 before:h-px before:bg-violet-500">
              Ferramentas
            </div>
            <h2 className="font-bebas text-[clamp(48px,6vw,80px)] leading-[0.95] tracking-[1px] mb-5">8 ARMAS<br/>DE CONTEÚDO</h2>
            <p className="text-lg text-[#F5F3EE]/55 leading-[1.7] font-light mb-10">Cada ferramenta foi projetada para um momento específico da sua criação.</p>

            <div className="flex flex-col gap-1">
              {[
                { icon: Target, name: 'Gerador de Títulos Virais', desc: 'Alto CTR para YouTube e TikTok', active: true },
                { icon: Zap, name: 'Gerador de Hooks', desc: 'Aberturas magnéticas para vídeos curtos' },
                { icon: Edit3, name: 'Gerador de Roteiros', desc: '1 a 5 minutos, estruturado' },
                { icon: MessageSquare, name: 'Gerador de Legendas', desc: 'Legendas virais para Instagram e TikTok' },
                { icon: Lightbulb, name: 'Gerador de Ideias', desc: 'Nunca fique sem conteúdo' },
              ].map((tool, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all border ${tool.active ? 'bg-violet-500/10 border-violet-500/20' : 'border-transparent hover:bg-violet-500/5 hover:border-violet-500/10'} group`}>
                  <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <tool.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold mb-0.5">{tool.name}</div>
                    <div className="text-[13px] text-[#6B6B74]">{tool.desc}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#6B6B74] ml-auto group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#060608]/60 border border-[#F5F3EE]/10 rounded-2xl p-10 min-h-[500px] flex flex-col relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)]" />
            
            <div className="flex items-center gap-2.5 mb-7 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <span className="text-[13px] text-[#6B6B74] ml-2">Gerador de Títulos</span>
            </div>

            <div className="bg-[#F5F3EE]/5 border border-[#F5F3EE]/10 rounded-xl p-4 text-sm text-[#F5F3EE]/60 mb-5 relative z-10">
              Seu nicho ou assunto principal...
            </div>

            <button className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white py-3 px-6 rounded-lg text-sm font-semibold mb-7 transition-colors w-max relative z-10">
              <Zap className="w-4 h-4 fill-current" /> Gerar Títulos Virais
            </button>

            <div className="flex flex-col gap-2.5 relative z-10">
              {[
                '"Como ganhar seus primeiros 1000 inscritos em 30 dias"',
                '"O segredo que os grandes criadores escondem de você"',
                '"Eu errei isso por 2 anos (não cometa esse erro)"'
              ].map((res, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="bg-[#F5F3EE]/[0.04] border border-[#F5F3EE]/10 rounded-lg p-3.5 text-[13px] text-[#F5F3EE]/80 flex items-center gap-3"
                >
                  <span className="font-bebas text-xl text-violet-500 min-w-[28px]">0{i+1}</span>
                  <span>{res}</span>
                  <button className="ml-auto border border-[#F5F3EE]/10 text-[#6B6B74] hover:border-violet-500 hover:text-violet-500 px-2.5 py-1 rounded text-[11px] transition-colors">
                    Copiar
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-[120px] px-6 md:px-12 bg-[#060608]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 text-[12px] text-violet-500 uppercase tracking-[2px] font-semibold mb-5 before:content-[''] before:w-6 before:h-px before:bg-violet-500">
              Depoimentos
            </div>
            <h2 className="font-bebas text-[clamp(48px,6vw,80px)] leading-[0.95] tracking-[1px]">CRIADORES<br/>QUE VIRALIZARAM</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { text: '"Em 3 semanas usando o Umbra, meu canal saiu de 800 para 12.000 inscritos. Os títulos gerados têm um CTR absurdo."', author: 'Rafael Mendes', handle: '@rafamendes · 54K inscritos', initial: 'R' },
              { text: '"Economizo 4 horas por semana no roteiro. A qualidade do conteúdo melhorou tanto que meu tempo médio de visualização dobrou."', author: 'Camila Borges', handle: '@camilaborges · 128K seguidores', initial: 'C' },
              { text: '"A análise de thumbnail foi um divisor de águas. Agora eu testo antes de publicar e meu CTR passou de 3% para 9,7%."', author: 'Lucas Andrade', handle: '@lucas.cria · 87K inscritos', initial: 'L' },
            ].map((test, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1A1A1F] border border-[#F5F3EE]/10 rounded-2xl p-8 hover:border-violet-500/30 transition-colors"
              >
                <div className="text-fuchsia-400 text-sm tracking-[2px] mb-5">★★★★★</div>
                <p className="text-[15px] leading-[1.8] text-[#F5F3EE]/75 font-light italic mb-6">{test.text}</p>
                <div className="flex items-center gap-3 pt-5 border-t border-[#F5F3EE]/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-base font-bold shrink-0">
                    {test.initial}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{test.author}</div>
                    <div className="text-xs text-[#6B6B74]">{test.handle}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-[120px] px-6 md:px-12 bg-[#1A1A1F]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-[12px] text-violet-500 uppercase tracking-[2px] font-semibold mb-5 before:content-[''] before:w-6 before:h-px before:bg-violet-500">
              Planos
            </div>
            <h2 className="font-bebas text-[clamp(48px,6vw,80px)] leading-[0.95] tracking-[1px] mb-5">PREÇO JUSTO,<br/>RESULTADO REAL</h2>
            <p className="text-lg text-[#F5F3EE]/55 max-w-[520px] mx-auto leading-[1.7] font-light">Comece grátis. Escale quando estiver pronto.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#060608] border border-[#F5F3EE]/10 rounded-[20px] p-10 hover:border-violet-500/30 transition-colors"
            >
              <div className="font-syne text-base font-bold text-[#6B6B74] uppercase tracking-[1px] mb-2">Iniciante</div>
              <div className="font-bebas text-[72px] leading-none tracking-[2px] mb-1">
                <sup className="text-[28px]">R$</sup>0<sub className="font-dm text-lg font-normal text-[#6B6B74] align-baseline mr-1">/mês</sub>
              </div>
              <div className="text-[13px] text-[#6B6B74] mb-7">Sempre grátis</div>
              <p className="text-sm text-[#6B6B74] mb-7 leading-[1.6]">Para quem está começando a criar conteúdo e quer testar o poder da IA.</p>
              
              <ul className="flex flex-col gap-3 mb-9">
                {['5 gerações por dia', 'Roteiros básicos', 'Acesso aos modelos padrão', 'Suporte da comunidade'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#F5F3EE]/75">
                    <span className="text-violet-500 font-bold mt-px">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-3.5 border border-[#F5F3EE]/10 text-[#F5F3EE] rounded-lg text-[15px] font-semibold hover:border-[#F5F3EE] hover:bg-[#F5F3EE]/5 transition-all">
                Começar Grátis
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-violet-500/10 to-[#060608] border border-violet-500 rounded-[20px] p-10 relative"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[11px] font-bold tracking-[1.5px] uppercase px-5 py-1.5 rounded-full whitespace-nowrap">
                MAIS POPULAR
              </div>
              <div className="font-syne text-base font-bold text-[#6B6B74] uppercase tracking-[1px] mb-2">Pro Creator</div>
              <div className="font-bebas text-[72px] leading-none tracking-[2px] mb-1">
                <sup className="text-[28px]">R$</sup>49<sub className="font-dm text-lg font-normal text-[#6B6B74] align-baseline mr-1">/mês</sub>
              </div>
              <div className="text-[13px] text-[#6B6B74] mb-7">Cobrado mensalmente · cancele quando quiser</div>
              <p className="text-sm text-[#6B6B74] mb-7 leading-[1.6]">Para criadores sérios que querem escalar e nunca mais ter bloqueio criativo.</p>
              
              <ul className="flex flex-col gap-3 mb-9">
                {['Gerações ilimitadas', 'Roteiros avançados e virais', 'Modelos de IA premium', 'Análise de thumbnail ilimitada', 'Calendário de conteúdo 30 dias', 'Suporte prioritário'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#F5F3EE]/75">
                    <span className="text-violet-500 font-bold mt-px">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-[15px] font-semibold transition-all hover:-translate-y-px hover:shadow-[0_12px_32px_rgba(139,92,246,0.3)]">
                Assinar Agora →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-[100px] px-6 md:px-12 bg-[#060608] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(139,92,246,0.1)_0%,transparent_70%)]" />
        <h2 className="font-bebas text-[clamp(56px,8vw,100px)] leading-[0.95] tracking-[2px] mb-6 relative z-10">
          COMECE A<br/>
          <span className="text-violet-500">VIRALIZAR</span><br/>
          HOJE
        </h2>
        <p className="text-lg text-[#F5F3EE]/55 max-w-[480px] mx-auto leading-[1.7] font-light mb-12 relative z-10">
          Junte-se a mais de 12.000 criadores que já estão crescendo mais rápido com Umbra.
        </p>
        <div className="flex flex-wrap justify-center gap-4 relative z-10">
          <Link href="/login" className="inline-flex items-center gap-2.5 bg-violet-600 hover:bg-violet-500 text-white text-base font-semibold px-9 py-4 rounded transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(139,92,246,0.3)] tracking-wide">
            Criar Conta Grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#precos" className="inline-flex items-center gap-2.5 border border-[#F5F3EE]/10 hover:border-[#F5F3EE]/40 hover:bg-[#F5F3EE]/5 text-[#F5F3EE] text-base font-medium px-8 py-4 rounded transition-all">
            Ver todos os planos
          </a>
        </div>
        <p className="text-[13px] text-[#6B6B74] mt-5 relative z-10">
          ✓ Não requer cartão de crédito &nbsp;•&nbsp; ✓ Cancele quando quiser
        </p>
      </section>

      {/* Footer */}
      <footer className="pt-[60px] pb-10 px-6 md:px-12 border-t border-[#F5F3EE]/10 bg-[#060608]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="font-bebas text-[28px] tracking-[4px]">UMBR<span className="text-violet-500">A</span></div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="text-[13px] text-[#6B6B74] hover:text-[#F5F3EE] transition-colors">Termos</a>
            <a href="#" className="text-[13px] text-[#6B6B74] hover:text-[#F5F3EE] transition-colors">Privacidade</a>
            <a href="#" className="text-[13px] text-[#6B6B74] hover:text-[#F5F3EE] transition-colors">Suporte</a>
            <a href="#" className="text-[13px] text-[#6B6B74] hover:text-[#F5F3EE] transition-colors">Blog</a>
          </div>
          <p className="text-[13px] text-[#6B6B74]">© 2026 Umbra AI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
