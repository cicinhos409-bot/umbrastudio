'use client';

import React, { useState } from 'react';
import { DashboardWrapper } from '@/components/DashboardWrapper';
import { Settings, User, Shield, CreditCard, Zap, Camera, MapPin, Briefcase, Globe, Phone, Calendar, Users, FileText, Link as LinkIcon, Download, Plus, Trash2, ExternalLink, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'billing', label: 'Faturamento', icon: CreditCard },
  ];

  const invoices = [
    { id: 'INV-001', date: '12 Mar, 2026', amount: 'R$ 19,00', status: 'pago' },
    { id: 'INV-002', date: '12 Fev, 2026', amount: 'R$ 19,00', status: 'pago' },
    { id: 'INV-003', date: '12 Jan, 2026', amount: 'R$ 19,00', status: 'pago' },
  ];

  return (
    <DashboardWrapper>
      <header className="mb-8 lg:mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="p-3 bg-zinc-800 rounded-xl text-zinc-400">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Configurações</h1>
            <p className="text-zinc-400 text-sm lg:text-base">Gerencie sua conta e preferências.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === section.id 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeSection === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Dados Pessoais */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                      <User className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Dados Pessoais</h3>
                  </div>

                  <div className="space-y-8">
                    {/* Foto de Perfil */}
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center overflow-hidden">
                          <User className="w-12 h-12 text-zinc-600" />
                        </div>
                        <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                          <Camera className="w-6 h-6 text-white" />
                        </button>
                      </div>
                      <div className="text-center sm:text-left">
                        <h4 className="text-white font-medium mb-1">Foto de Perfil</h4>
                        <p className="text-zinc-500 text-sm mb-3">JPG, GIF ou PNG. Tamanho máximo de 2MB.</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors">
                            Upload
                          </button>
                          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-bold rounded-lg transition-colors">
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nome Completo</label>
                        <input 
                          type="text" 
                          placeholder="Seu nome completo"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Endereço de E-mail</label>
                        <input 
                          type="email" 
                          placeholder="seu@email.com"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                          <Phone className="w-3 h-3" /> Telefone / WhatsApp
                        </label>
                        <input 
                          type="text" 
                          placeholder="(00) 00000-0000"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> Data de Nascimento
                        </label>
                        <input 
                          type="date" 
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                          <Users className="w-3 h-3" /> Gênero
                        </label>
                        <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none">
                          <option value="">Selecione</option>
                          <option value="male">Masculino</option>
                          <option value="female">Feminino</option>
                          <option value="other">Outro</option>
                          <option value="prefer_not_to_say">Prefiro não dizer</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                          <FileText className="w-3 h-3" /> CPF
                        </label>
                        <input 
                          type="text" 
                          placeholder="000.000.000-00"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dados de Localização */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Dados de Localização</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Endereço Completo</label>
                      <input 
                        type="text" 
                        placeholder="Rua, número, complemento, bairro"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cidade</label>
                        <input 
                          type="text" 
                          placeholder="Sua cidade"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Estado / País</label>
                        <input 
                          type="text" 
                          placeholder="Ex: SP, Brasil"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">CEP</label>
                        <input 
                          type="text" 
                          placeholder="00000-000"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dados Profissionais & Extras */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Dados Profissionais & Extras</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Cargo / Profissão</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Criador de Conteúdo"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Empresa</label>
                        <input 
                          type="text" 
                          placeholder="Nome da sua empresa ou canal"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Bio / Sobre mim</label>
                      <textarea 
                        placeholder="Conte um pouco sobre você e seu trabalho..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[120px] resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                          <Globe className="w-3 h-3" /> Site
                        </label>
                        <input 
                          type="url" 
                          placeholder="https://seusite.com"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                          <LinkIcon className="w-3 h-3" /> Redes Sociais
                        </label>
                        <input 
                          type="text" 
                          placeholder="@seuusuario"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button className="w-full sm:w-auto px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                    Salvar Todas as Alterações
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Segurança da Conta</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Senha Atual</label>
                      <input type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nova Senha</label>
                        <input type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Confirmar Nova Senha</label>
                        <input type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors">
                      Atualizar Senha
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Plano Atual */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Plano Atual</h3>
                    </div>
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-xs font-bold rounded-full border border-indigo-500/20">
                      Ativo
                    </span>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-1">Plano Pro</h4>
                      <p className="text-zinc-500 text-sm">Acesso ilimitado a todas as ferramentas de IA.</p>
                      <div className="flex items-center gap-2 mt-4 text-zinc-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>Próxima renovação: <strong>12 de Abril, 2026</strong></span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all">
                        Fazer Upgrade
                      </button>
                      <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold rounded-xl transition-all">
                        Cancelar Plano
                      </button>
                    </div>
                  </div>
                </div>

                {/* Método de Pagamento */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Método de Pagamento</h3>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                        VISA
                      </div>
                      <div>
                        <p className="text-white font-medium">Visa terminando em 4242</p>
                        <p className="text-zinc-500 text-xs">Expira em 12/28</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors">
                        <Plus className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <button className="mt-6 text-indigo-500 text-sm font-bold hover:underline flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Adicionar novo método de pagamento
                  </button>
                </div>

                {/* Histórico de Faturas */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Histórico de Faturas</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="pb-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Data</th>
                          <th className="pb-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Valor</th>
                          <th className="pb-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                          <th className="pb-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Recibo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="group">
                            <td className="py-4 text-sm text-zinc-300">{invoice.date}</td>
                            <td className="py-4 text-sm text-white font-medium">{invoice.amount}</td>
                            <td className="py-4">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" />
                                {invoice.status}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Endereço de Cobrança */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Endereço de Cobrança</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nome / Razão Social</label>
                        <input type="text" placeholder="Nome para nota fiscal" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">CPF / CNPJ</label>
                        <input type="text" placeholder="00.000.000/0000-00" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Endereço de Faturamento</label>
                      <input type="text" placeholder="Endereço completo para emissão" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                    <div className="flex justify-end">
                      <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors">
                        Salvar Endereço
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardWrapper>
  );
}
