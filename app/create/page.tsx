'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardWrapper } from '@/components/DashboardWrapper';
import { 
  Type, 
  Anchor, 
  FileText, 
  Zap, 
  Lightbulb, 
  Image as ImageIcon, 
  MessageSquare, 
  Calendar,
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateText, POLLINATIONS_MODELS } from '@/lib/pollinations';
import Markdown from 'react-markdown';
import { ModelSelector } from '@/components/ModelSelector';
import { Cpu } from 'lucide-react';

const toolConfigs: Record<string, any> = {
  titles: {
    title: 'Gerador de Títulos Virais',
    icon: Type,
    description: 'Insira o tema do seu vídeo para gerar 10 títulos com alto CTR.',
    placeholder: 'ex: Como ganhar dinheiro online em 2024',
    prompt: (input: string) => `Gere 10 títulos virais para o YouTube com alto CTR para um vídeo sobre: "${input}". Os títulos devem ser chamativos, usar gatilhos psicológicos (curiosidade, medo de ficar de fora, listas, etc.) e ser otimizados para busca. Retorne a lista em formato markdown.`,
  },
  hooks: {
    title: 'Gerador de Hooks',
    icon: Anchor,
    description: 'Insira o tema do seu vídeo para gerar 5 hooks magnéticos.',
    placeholder: 'ex: Crescendo no YouTube com 0 inscritos',
    prompt: (input: string) => `Gere 5 hooks virais para vídeos curtos (TikTok/Reels/Shorts) sobre: "${input}". Cada hook deve ter menos de 10 palavras e ser projetado para fazer alguém parar de rolar a tela. Retorne a lista em formato markdown.`,
  },
  scripts: {
    title: 'Gerador de Roteiros',
    icon: FileText,
    description: 'Insira o tema do vídeo para um roteiro completo de 1 a 5 minutos.',
    placeholder: 'ex: O futuro da IA em 2025',
    prompt: (input: string) => `Gere um roteiro completo para um vídeo do YouTube de 3 a 5 minutos sobre: "${input}". Estruture com: 
    1. Hook (Abertura viral)
    2. Introdução (Contextualização)
    3. Conteúdo (3-5 pontos principais)
    4. CTA (Chamada para ação)
    Torne-o envolvente e conversacional. Retorne em formato markdown.`,
  },
  shorts: {
    title: 'Roteiros para Shorts AI',
    icon: Zap,
    description: 'Insira o tema para um roteiro viral de 30-60 segundos.',
    placeholder: 'ex: 3 hacks de produtividade para estudantes',
    prompt: (input: string) => `Gere um roteiro dinâmico para um vídeo vertical de 30-60 segundos (TikTok/Shorts) sobre: "${input}". Use um hook forte, dicas rápidas e um CTA ágil. Retorne em formato markdown.`,
  },
  ideas: {
    title: 'Gerador de Ideias',
    icon: Lightbulb,
    description: 'Insira seu nicho para gerar 50 ideias de vídeos virais.',
    placeholder: 'ex: Finanças Pessoais',
    prompt: (input: string) => `Gere 50 ideias de vídeos virais para o nicho: "${input}". Categorize em: Tendências, Educativo, Controverso e Tutorial. Retorne em formato markdown.`,
  },
  captions: {
    title: 'Gerador de Legendas',
    icon: MessageSquare,
    description: 'Insira o tema do vídeo para legendas virais.',
    placeholder: 'ex: Minha rotina matinal como desenvolvedor',
    prompt: (input: string) => `Gere 3 legendas virais para Instagram/TikTok/Shorts para um vídeo sobre: "${input}". Inclua hashtags e emojis relevantes. Retorne em formato markdown.`,
  },
  calendar: {
    title: 'Calendário de Conteúdo',
    icon: Calendar,
    description: 'Insira seu nicho para uma estratégia de conteúdo de 30 dias.',
    placeholder: 'ex: Fitness e Nutrição',
    prompt: (input: string) => `Gere um calendário de conteúdo de 30 dias para um criador no nicho: "${input}". Para cada dia, forneça um título de vídeo e um breve conceito. Retorne em formato markdown.`,
  },
};

function CreateToolContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toolId = searchParams.get('tool') || 'titles';
  const config = toolConfigs[toolId] || toolConfigs.titles;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-airforce');
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Advanced options for titles
  const [niche, setNiche] = useState('');
  const [lang, setLang] = useState('pt-BR');
  const [tone, setTone] = useState('viral');
  const [quantity, setQuantity] = useState('10');
  const [charRange, setCharRange] = useState('50-80');
  const [customInstructions, setCustomInstructions] = useState('');
  const [existingTitles, setExistingTitles] = useState('');

  // Advanced options for scripts (Motor Supremo)
  const [script1, setScript1] = useState('');
  const [script2, setScript2] = useState('');
  const [script3, setScript3] = useState('');
  const [extractedModel, setExtractedModel] = useState('');
  const [channelName, setChannelName] = useState('');
  const [narratorName, setNarratorName] = useState('');
  const [minWords, setMinWords] = useState('600');
  const [maxWords, setMaxWords] = useState('1000');
  const [perspective, setPerspective] = useState('1ª Pessoa');
  const [scriptTone, setScriptTone] = useState('dramatico');
  const [scriptNiche, setScriptNiche] = useState('historia');
  const [genRequest, setGenRequest] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Advanced options for Shorts AI
  const [shortsTipo, setShortsTipo] = useState('História curta');
  const [shortsGancho, setShortsGancho] = useState('Pergunta intrigante');
  const [shortsTom, setShortsTom] = useState('Dramático');
  const [shortsPersonagem, setShortsPersonagem] = useState('Narrador neutro');
  const [shortsDuracao, setShortsDuracao] = useState('30 segundos');
  const [shortsPlataforma, setShortsPlataforma] = useState('TikTok');
  const [shortsFinal, setShortsFinal] = useState('Call to action forte');
  const [shortsToggles, setShortsToggles] = useState({
    gancho: true,
    story: true,
    algo: true,
    titulo: true,
    cta: true
  });
  const [shortsBaseMaterial, setShortsBaseMaterial] = useState('');
  const [guideTab, setGuideTab] = useState('estrutura');

  const shakeInput = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleAnalyzeScripts = async () => {
    if (!script1.trim()) return;
    setIsAnalyzing(true);
    setExtractedModel('');
    
    try {
      const scripts = [script1, script2 && `---ROTEIRO 02---\n${script2}`, script3 && `---ROTEIRO 03---\n${script3}`]
        .filter(Boolean).join('\n\n');

      const masterPrompt = `Você é um Motor de Engenharia Reversa de Roteiros Virais.
Você não cria roteiros ainda.
Primeiro, você absorve, desmonta, abstrai e generaliza estruturas narrativas.
Você receberá UM OU MAIS ROTEIROS COMPLETOS.
Trate todos como dados de treino estrutural.
Sua missão é construir um MODELO MENTAL UNIFICADO capaz de gerar roteiros superiores aos originais.

FASE 1 — ABSORÇÃO TOTAL
Para CADA roteiro recebido, extraia CIRURGICAMENTE:
- Estrutura macro (início → meio → fim)
- Gancho inicial (técnica psicológica + função de retenção)
- Promessa explícita E implícita
- Conflito central
- Escalada emocional e informacional
- Clímax e Desfecho
- Linguagem e Ritmo

FASE 2 — SÍNTESE UNIFICADORA
Identifique ISOMORFISMOS estruturais e extraia uma MATRIZ de retenção universal.

FASE 3 — MODELO GERADOR
Saída FINAL obrigatória:
MODELO UNIFICADO v1.0
├── GANCHO: [fórmula exata]
├── PROMESSA: [dupla função]
├── ESCALADA: [progressão matemática]
├── CLÍMAX: [estrutura reversão]
├── FECHAMENTO: [eco multiplicador]
└── PARÂMETROS: [nicho/tom/duração]`;

      const data = await generateText(`${masterPrompt}\n\nANALISE OS SEGUINTES ROTEIROS:\n\n${scripts}`, selectedModel);
      const text = typeof data === 'string' ? data : data?.text || data?.content || JSON.stringify(data);
      
      setExtractedModel(text || 'Erro ao extrair modelo.');
    } catch (error) {
      console.error('Erro na análise:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    const isScriptTool = toolId === 'scripts';
    const finalInput = isScriptTool ? genRequest : input;
    
    if (!finalInput.trim()) {
      shakeInput();
      return;
    }

    setLoading(true);
    setError(null);
    setResult('');
    setParsedResult(null);
    
    try {
      let finalPrompt = config.prompt(finalInput);
      
      if (toolId === 'titles') {
        const [min, max] = charRange.split('-').map(Number);
        finalPrompt = `Você é um especialista em SEO para YouTube. Gere ${quantity} títulos otimizados para YouTube sobre o seguinte tema.

TEMA: ${input}
NICHO: ${niche || 'geral'}
IDIOMA: ${lang}
TOM: ${tone}
COMPRIMENTO OBRIGATÓRIO: entre ${min} e ${max} caracteres por título.
${existingTitles ? `TÍTULOS EXISTENTES PARA REFERÊNCIA:\n${existingTitles}` : ''}
${customInstructions ? `INSTRUÇÕES PERSONALIZADAS:\n${customInstructions}` : ''}

REGRAS DOS TÍTULOS:
- OBRIGATÓRIO: cada título deve ter entre ${min} e ${max} caracteres.
- Incluir palavras de alto CTR para YouTube.
- Usar gatilhos mentais (curiosidade, urgência, listas).
- Otimizados para busca orgânica.

Retorne a resposta EXCLUSIVAMENTE em formato JSON com a seguinte estrutura:
{
  "titles": [
    { "title": "Título", "ctr": 85, "seo": 90, "length": 45, "trend": "Alta" }
  ],
  "metrics": { "avg_ctr": "8.5%", "seo_score": 88, "trend": "Alta" },
  "keywords": ["palavra1", "palavra2"]
}`;
      } else if (toolId === 'hooks') {
        finalPrompt = `Gere 5 hooks magnéticos para um vídeo sobre: "${input}". 
        Cada hook deve ser projetado para retenção máxima.
        Retorne a resposta EXCLUSIVAMENTE em formato JSON com a seguinte estrutura:
        {
          "hooks": [
            { "type": "Curiosidade", "text": "Texto do hook aqui" },
            { "type": "Choque", "text": "Texto do hook aqui" },
            { "type": "Lista", "text": "Texto do hook aqui" },
            { "type": "Medo", "text": "Texto do hook aqui" },
            { "type": "Autoridade", "text": "Texto do hook aqui" }
          ]
        }`;
      } else if (toolId === 'shorts') {
        const opts = [];
        if (shortsToggles.gancho) opts.push('Gancho Ultra Viral (maximizar impacto nos primeiros 3 segundos)');
        if (shortsToggles.story) opts.push('Storytelling envolvente com arco emocional');
        if (shortsToggles.algo) opts.push('Otimização para algoritmo da plataforma (palavras de alta retenção)');

        finalPrompt = `Você é um especialista em roteiros virais para vídeos curtos (TikTok, Reels, Shorts).

Crie um roteiro completo com as seguintes configurações:
- Tema: ${input}
- Tipo de vídeo: ${shortsTipo}
- Estilo do gancho: ${shortsGancho}
- Tom: ${shortsTom}
- Personagem/narrador: ${shortsPersonagem}
- Duração alvo: ${shortsDuracao}
- Plataforma: ${shortsPlataforma}
- Tipo de final: ${shortsFinal}
${shortsBaseMaterial ? `- MATERIAL DE APOIO / TEXTO BASE: ${shortsBaseMaterial}` : ''}
${opts.length ? '- Opções ativas: ' + opts.join(', ') : ''}

Regras:
- Use linguagem coloquial brasileira, direta e impactante
- Se houver MATERIAL DE APOIO, extraia as informações mais importantes dele para compor o roteiro.
- Cada seção deve ter o texto exato a ser dito na câmera
- Respeite os tempos de cada seção
- O roteiro deve ser magnético e prende atenção do início ao fim
- Não use emojis dentro dos textos do roteiro
${shortsToggles.titulo ? '- Inclua um título viral para o vídeo' : ''}

Responda APENAS em JSON válido, sem markdown, sem explicações:
{
  ${shortsToggles.titulo ? '"titulo": "título viral aqui",' : ''}
  "gancho": "texto do gancho (0-3s)",
  "contexto": "texto do contexto rápido (3-7s)",
  "desenvolvimento": "texto do desenvolvimento (7-25s)",
  "impacto": "texto do momento de impacto (25-35s)",
  "cta": "${shortsToggles.cta ? 'call to action personalizado para ' + shortsPlataforma : 'call to action simples'} (35-40s)",
  "duracao_estimada": "${shortsDuracao}",
  "plataforma": "${shortsPlataforma}"
}`;
      } else if (toolId === 'scripts' && extractedModel) {
        finalPrompt = `USANDO EXCLUSIVAMENTE A ARQUITETURA EXTRAÍDA ABAIXO, GERE UM ROTEIRO COMPLETO:

========== ARQUITETURA EXTRAÍDA ==========
${extractedModel}
==========================================

CONFIGURAÇÕES DO ROTEIRO:
- Canal: ${channelName || 'Não especificado'}
- Narrador: ${narratorName || 'Não especificado'}
- Perspectiva: ${perspective}
- Tom: ${scriptTone}
- Nicho: ${scriptNiche}
- Mínimo de palavras: ${minWords}
- Máximo de palavras: ${maxWords}

PEDIDO ESPECÍFICO:
${genRequest}

REGRAS DE LIMPEZA — OBRIGATÓRIO:
- ZERO marcações de produção (sem [PAUSA], [CORTE], etc.)
- ZERO timestamps
- ZERO cabeçalhos de seção
- APENAS texto corrido, limpo, pronto para narrar.`;
      }

      const data = await generateText(finalPrompt, selectedModel);
      const text = typeof data === 'string' ? data : data?.text || data?.content || JSON.stringify(data);
      
      if (toolId === 'titles' || toolId === 'hooks' || toolId === 'shorts') {
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            setParsedResult(parsed);
            if (toolId === 'titles') {
              setResult(parsed.titles.map((t: any) => `- ${t.title}`).join('\n'));
            } else if (toolId === 'hooks') {
              setResult(parsed.hooks.map((h: any) => `${h.type}: ${h.text}`).join('\n\n'));
            } else if (toolId === 'shorts') {
              setResult(`${parsed.titulo ? `TÍTULO: ${parsed.titulo}\n\n` : ''}GANCHO:\n${parsed.gancho}\n\nCONTEXTO:\n${parsed.contexto}\n\nDESENVOLVIMENTO:\n${parsed.desenvolvimento}\n\nIMPACTO:\n${parsed.impacto}\n\nCTA:\n${parsed.cta}`);
            }
          } else {
            setResult(text);
          }
        } catch (e) {
          setResult(text);
        }
      } else {
        setResult(text);
      }
    } catch (error) {
      console.error('Erro na geração:', error);
      setError('Erro ao gerar conteúdo. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (textToCopy?: string) => {
    navigator.clipboard.writeText(textToCopy || result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAllHooks = () => {
    if (!parsedResult?.hooks) return;
    const allText = parsedResult.hooks.map((h: any) => `[${h.type}]\n${h.text}`).join('\n\n---\n\n');
    copyToClipboard(allText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <DashboardWrapper>
      <button 
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 lg:mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar ao Início
      </button>

      <div className="max-w-4xl mx-auto">
        <header className="mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
              <config.icon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{config.title}</h1>
              <p className="text-zinc-400 text-sm lg:text-base">{config.description}</p>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 lg:p-6">
            <ModelSelector 
              label="Modelo de IA" 
              models={POLLINATIONS_MODELS.allText} 
              selectedModel={selectedModel} 
              onModelChange={setSelectedModel}
              icon={Cpu}
            />
          </div>

          {toolId === 'scripts' ? (
            <div className="space-y-8">
              {/* Fase 1: Absorção */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 lg:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Fase 01: Absorção de Roteiros Base</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Roteiro 01 (Obrigatório)</label>
                    <textarea
                      value={script1}
                      onChange={(e) => setScript1(e.target.value)}
                      placeholder="Cole aqui seu primeiro roteiro completo..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[200px] resize-none text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Roteiro 02 (Opcional)</label>
                    <textarea
                      value={script2}
                      onChange={(e) => setScript2(e.target.value)}
                      placeholder="Mais roteiros = modelo mais preciso."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[200px] resize-none text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Roteiro 03 (Opcional)</label>
                    <textarea
                      value={script3}
                      onChange={(e) => setScript3(e.target.value)}
                      placeholder="Sistema trata todos como dados estruturais."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[200px] resize-none text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleAnalyzeScripts}
                    disabled={isAnalyzing || !script1.trim()}
                    className="w-full px-8 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:scale-95"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analisando Estruturas...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Analisar e Extrair Modelo
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Resultado da Análise / Modelo Extraído */}
              <AnimatePresence>
                {extractedModel && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 lg:p-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider">Modelo Unificado Extraído</h3>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-400 font-mono text-xs whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                      {extractedModel}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fase 2: Geração */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 lg:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Fase 02: Gerador de Roteiro Superior</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nome do Canal</label>
                    <input 
                      type="text" 
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="Ex: Histórias do Passado"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Narrador</label>
                    <input 
                      type="text" 
                      value={narratorName}
                      onChange={(e) => setNarratorName(e.target.value)}
                      placeholder="Ex: João Silva"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Extensão (Palavras)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={minWords}
                        onChange={(e) => setMinWords(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                      <span className="text-zinc-600">→</span>
                      <input 
                        type="number" 
                        value={maxWords}
                        onChange={(e) => setMaxWords(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Perspectiva</label>
                    <select 
                      value={perspective}
                      onChange={(e) => setPerspective(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                    >
                      <option value="1ª Pessoa">1ª Pessoa</option>
                      <option value="3ª Pessoa">3ª Pessoa</option>
                      <option value="2ª Pessoa">2ª Pessoa</option>
                      <option value="Onisciente">Onisciente</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tom Narrativo</label>
                    <select 
                      value={scriptTone}
                      onChange={(e) => setScriptTone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                    >
                      <option value="dramatico">Dramático e Tenso</option>
                      <option value="educativo">Educativo e Revelador</option>
                      <option value="suspense">Suspense e Mistério</option>
                      <option value="impactante">Impactante e Direto</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nicho / Tema</label>
                    <select 
                      value={scriptNiche}
                      onChange={(e) => setScriptNiche(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                    >
                      <option value="historia">História e Civilizações</option>
                      <option value="ciencia">Ciência e Tecnologia</option>
                      <option value="crime">Crime e Mistério</option>
                      <option value="financas">Finanças e Economia</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pedido Específico / Tema do Novo Roteiro</label>
                  <textarea
                    value={genRequest}
                    onChange={(e) => setGenRequest(e.target.value)}
                    placeholder="Ex: Roteiro sobre a queda do Império Romano..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[120px] resize-none"
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !genRequest.trim() || !extractedModel}
                    className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Gerando Roteiro Superior...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Gerar Roteiro Superior
                      </>
                    )}
                  </button>
                </div>
                {!extractedModel && (
                  <p className="text-center text-xs text-zinc-500 mt-4">⚠️ Analise os roteiros base acima antes de gerar o novo roteiro.</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 lg:p-6">
                <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-3">Seu Tema ou Nicho</label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={config.placeholder}
                    className={`w-full bg-zinc-950 border rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[100px] resize-none transition-all ${
                      isShaking ? 'border-red-500 animate-shake' : 'border-zinc-800'
                    }`}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
                  )}
                </div>

                {toolId === 'titles' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Nicho / Categoria</label>
                      <select 
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                      >
                        <option value="">Selecionar nicho</option>
                        <option value="factory">Fábrica / Manufatura</option>
                        <option value="food">Alimentação / Culinária</option>
                        <option value="tech">Tecnologia</option>
                        <option value="science">Ciência / Educação</option>
                        <option value="history">História / Documentário</option>
                        <option value="health">Saúde / Fitness</option>
                        <option value="finance">Finanças / Negócios</option>
                        <option value="entertainment">Entretenimento</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Idioma</label>
                      <select 
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                      >
                        <option value="pt-BR">Português (BR)</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tom / Estilo</label>
                      <select 
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                      >
                        <option value="viral">Viral / Sensacionalista</option>
                        <option value="educational">Educativo / Informativo</option>
                        <option value="curiosity">Curiosidade / Mistério</option>
                        <option value="professional">Profissional / Sério</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Quantidade</label>
                      <select 
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                      >
                        <option value="5">5 títulos</option>
                        <option value="10">10 títulos</option>
                        <option value="15">15 títulos</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Comprimento (Caracteres)</label>
                      <select 
                        value={charRange}
                        onChange={(e) => setCharRange(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                      >
                        <option value="30-50">Curto (30-50)</option>
                        <option value="50-80">Médio (50-80)</option>
                        <option value="80-100">Longo (80-100)</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Instruções Personalizadas</label>
                      <textarea
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        placeholder="Ex: Usar o formato 'De X para Y', incluir palavras em maiúsculo..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                )}

                {toolId === 'shorts' && (
                  <div className="space-y-8 pt-4 border-t border-zinc-800">
                    {/* TEXTO BASE */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">1. Texto Base / Material de Apoio (Opcional)</label>
                      <textarea
                        value={shortsBaseMaterial}
                        onChange={(e) => setShortsBaseMaterial(e.target.value)}
                        placeholder="Cole aqui o texto, artigo ou informações que servirão de base para o roteiro..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[120px] resize-none transition-all"
                      />
                      <p className="text-[10px] text-zinc-500 italic">A IA usará este material para extrair os pontos principais do roteiro.</p>
                    </div>

                    {/* TIPO */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">2. Tipo de Vídeo</label>
                      <div className="flex flex-wrap gap-2">
                        {['História curta', 'Curiosidade', 'Dica rápida', 'Top 3', 'Explicação simples', 'Fato chocante', 'Notícia', 'Comparação', 'Erro comum', 'Tutorial rápido'].map(t => (
                          <button
                            key={t}
                            onClick={() => setShortsTipo(t)}
                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                              shortsTipo === t 
                                ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                                : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* GANCHO */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">3. Estilo do Gancho</label>
                      <div className="flex flex-wrap gap-2">
                        {['Pergunta intrigante', 'Frase chocante', 'Segredo revelado', 'Curiosidade', 'Estatística surpreendente', 'Erro que ninguém percebe', 'Mistério', 'Polêmica'].map(t => (
                          <button
                            key={t}
                            onClick={() => setShortsGancho(t)}
                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                              shortsGancho === t 
                                ? 'bg-pink-500/10 border-pink-500/50 text-pink-400' 
                                : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* TOM */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">4. Tom do Vídeo</label>
                      <div className="flex flex-wrap gap-2">
                        {['Dramático', 'Motivacional', 'Engraçado', 'Misterioso', 'Inspirador', 'Educativo', 'Urgente', 'Polêmico'].map(t => (
                          <button
                            key={t}
                            onClick={() => setShortsTom(t)}
                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                              shortsTom === t 
                                ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' 
                                : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* PERSONAGEM */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">5. Personagem</label>
                      <div className="flex flex-wrap gap-2">
                        {['Narrador neutro', 'Empreendedor', 'Jovem pobre', 'Estudante', 'Bilionário', 'Influenciador', 'Cientista', 'Pessoa comum'].map(t => (
                          <button
                            key={t}
                            onClick={() => setShortsPersonagem(t)}
                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                              shortsPersonagem === t 
                                ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                                : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* DURACAO + PLATAFORMA */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">6. Duração</label>
                        <div className="flex flex-col gap-2">
                          {['30 segundos', '15 segundos', '45 segundos', '60 segundos'].map(t => (
                            <button
                              key={t}
                              onClick={() => setShortsDuracao(t)}
                              className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left ${
                                shortsDuracao === t 
                                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' 
                                  : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">7. Plataforma</label>
                        <div className="flex flex-col gap-2">
                          {['TikTok', 'YouTube Shorts', 'Instagram Reels'].map(t => (
                            <button
                              key={t}
                              onClick={() => setShortsPlataforma(t)}
                              className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left ${
                                shortsPlataforma === t 
                                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                                  : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* FINAL */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">8. Tipo de Final</label>
                      <div className="flex flex-wrap gap-2">
                        {['Call to action forte', 'Plot twist', 'Dica final', 'Revelação chocante', 'Moral da história', 'Pergunta para audiência'].map(t => (
                          <button
                            key={t}
                            onClick={() => setShortsFinal(t)}
                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                              shortsFinal === t 
                                ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                                : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* AVANCADO */}
                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">⚡ Opções Avançadas</label>
                      <div className="space-y-2">
                        {[
                          { id: 'gancho', label: 'Gancho Ultra Viral', sub: 'Maximiza impacto nos primeiros 3s' },
                          { id: 'story', label: 'Storytelling Envolvente', sub: 'Narrativa com arco emocional' },
                          { id: 'algo', label: 'Otimização de Algoritmo', sub: 'Palavras-chave e retenção' },
                          { id: 'titulo', label: 'Gerar Título Viral', sub: 'Título otimizado para cliques' },
                          { id: 'cta', label: 'Gerar CTA Personalizado', sub: 'Call to action específico da plataforma' }
                        ].map(opt => (
                          <div key={opt.id} className="flex items-center justify-between py-3 border-b border-zinc-800/50 last:border-0">
                            <div>
                              <div className="text-sm font-medium text-zinc-300">{opt.label}</div>
                              <div className="text-[10px] text-zinc-500">{opt.sub}</div>
                            </div>
                            <button
                              onClick={() => setShortsToggles(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof prev] }))}
                              className={`relative w-10 h-6 rounded-full transition-colors ${
                                shortsToggles[opt.id as keyof typeof shortsToggles] ? 'bg-indigo-600' : 'bg-zinc-800'
                              }`}
                            >
                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                shortsToggles[opt.id as keyof typeof shortsToggles] ? 'left-5' : 'left-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !input.trim()}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Gerar Conteúdo Viral
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          <AnimatePresence>
            {(result || parsedResult) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {parsedResult && toolId === 'titles' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">CTR Médio Est.</p>
                      <p className="text-2xl font-bold text-indigo-500">{parsedResult.metrics.avg_ctr}</p>
                    </div>
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Score SEO</p>
                      <p className="text-2xl font-bold text-emerald-500">{parsedResult.metrics.seo_score}</p>
                    </div>
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Trend Match</p>
                      <p className="text-2xl font-bold text-amber-500">{parsedResult.metrics.trend}</p>
                    </div>
                  </div>
                )}

                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 lg:p-6 relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-white">Resultado</h3>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {toolId === 'hooks' && parsedResult?.hooks && (
                        <button
                          onClick={copyAllHooks}
                          className="flex-1 sm:flex-none p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2 text-sm border border-zinc-800 sm:border-none"
                        >
                          <Copy className="w-4 h-4" />
                          Copiar Todos
                        </button>
                      )}
                      <button
                        onClick={() => copyToClipboard()}
                        className="flex-1 sm:flex-none p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2 text-sm border border-zinc-800 sm:border-none"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copiado!' : 'Copiar Tudo'}
                      </button>
                    </div>
                  </div>

                  {parsedResult ? (
                    <div className="space-y-4">
                      {toolId === 'titles' && parsedResult.titles ? (
                        <>
                          {parsedResult.titles.map((t: any, i: number) => (
                            <div key={i} className="group bg-zinc-950 border border-zinc-800 rounded-xl p-4 hover:border-indigo-500/50 transition-all flex items-center justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{t.title}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-[10px] font-bold text-indigo-400 uppercase">CTR: {t.ctr}%</span>
                                  <span className="text-[10px] font-bold text-emerald-400 uppercase">SEO: {t.seo}</span>
                                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{t.length} chars</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => copyToClipboard(t.title)}
                                className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          
                          {parsedResult.keywords && (
                            <div className="pt-6 border-t border-zinc-800">
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Palavras-chave Recomendadas</p>
                              <div className="flex flex-wrap gap-2">
                                {parsedResult.keywords.map((kw: string, i: number) => (
                                  <span key={i} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full border border-zinc-700">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : toolId === 'hooks' && parsedResult.hooks ? (
                        <div className="grid grid-cols-1 gap-4">
                          {parsedResult.hooks.map((hook: any, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 group hover:border-indigo-500/50 transition-all"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                  <span className="inline-block px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded">
                                    {hook.type}
                                  </span>
                                  <p className="text-white text-sm lg:text-base leading-relaxed">
                                    {hook.text}
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(hook.text);
                                  }}
                                  className="p-2 bg-zinc-900 text-zinc-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                  title="Copiar este hook"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : toolId === 'shorts' && parsedResult.gancho ? (
                        <div className="space-y-6">
                          {parsedResult.titulo && (
                            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                              <span className="inline-block px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded mb-2">
                                Título Viral
                              </span>
                              <p className="text-amber-400 font-bold text-lg">{parsedResult.titulo}</p>
                            </div>
                          )}
                          
                          {[
                            { key: 'gancho', label: 'Gancho', time: '0-3s', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
                            { key: 'contexto', label: 'Contexto', time: '3-7s', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
                            { key: 'desenvolvimento', label: 'Desenvolvimento', time: '7-25s', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
                            { key: 'impacto', label: 'Impacto', time: '25-35s', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
                            { key: 'cta', label: 'Call to Action', time: '35-40s', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' }
                          ].map((sec) => (
                            parsedResult[sec.key] && (
                              <div key={sec.key} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 ${sec.bg} ${sec.color} ${sec.border} border text-[10px] font-bold uppercase tracking-widest rounded`}>
                                    {sec.label}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-medium bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                                    ⏱ {sec.time}
                                  </span>
                                </div>
                                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-300 italic font-serif leading-relaxed">
                                  {parsedResult[sec.key]}
                                </div>
                              </div>
                            )
                          ))}

                          <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
                            <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-lg border border-zinc-700">
                              🎬 {parsedResult.plataforma}
                            </span>
                            <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-lg border border-zinc-700">
                              ⏱ {parsedResult.duracao_estimada}
                            </span>
                            <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-lg border border-zinc-700">
                              🎭 {shortsTom}
                            </span>
                            <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-lg border border-zinc-700">
                              📌 {shortsTipo}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-strong:text-indigo-400 prose-ul:text-zinc-300 text-sm lg:text-base overflow-x-auto">
                      <Markdown>{result}</Markdown>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {toolId === 'shorts' && (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 mt-6">
              <div className="flex p-1 bg-zinc-950 rounded-xl mb-6">
                <button 
                  onClick={() => setGuideTab('estrutura')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    guideTab === 'estrutura' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Estrutura
                </button>
                <button 
                  onClick={() => setGuideTab('viral')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    guideTab === 'viral' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Viral Elements
                </button>
              </div>

              {guideTab === 'estrutura' ? (
                <div className="space-y-4">
                  {[
                    { num: 1, label: 'Gancho', time: '0 – 3 segundos', desc: 'A parte mais importante. Frase chocante, curiosidade ou pergunta intrigante.', color: 'text-pink-400', bg: 'bg-pink-500/10' },
                    { num: 2, label: 'Contexto Rápido', time: '3 – 7 segundos', desc: 'Situe o espectador e crie curiosidade para continuar assistindo.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { num: 3, label: 'Desenvolvimento', time: '7 – 25 segundos', desc: 'Conteúdo principal: dica, história, explicação ou lista rápida.', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { num: 4, label: 'Momento de Impacto', time: '25 – 35 segundos', desc: 'Clímax: revelação, plot twist ou conclusão forte que surpreende.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { num: 5, label: 'Call to Action', time: '35 – 40 segundos', desc: 'Peça seguir, salvar, comentar ou compartilhar com clareza.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
                  ].map(item => (
                    <div key={item.num} className="flex gap-4 items-start py-3 border-b border-zinc-800/50 last:border-0">
                      <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex-shrink-0 flex items-center justify-center font-bold text-sm`}>
                        {item.num}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-200">{item.label}</div>
                        <div className="text-[10px] text-zinc-500 mb-1">{item.time}</div>
                        <div className="text-xs text-zinc-400 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: '🎣', text: 'Gancho forte' },
                    { icon: '✂️', text: 'Frases curtas' },
                    { icon: '🤔', text: 'Curiosidade aberta' },
                    { icon: '⚡', text: 'Ritmo rápido' },
                    { icon: '💬', text: 'Linguagem simples' },
                    { icon: '😱', text: 'Emoção ou surpresa' },
                    { icon: '🔄', text: 'Loop implícito' },
                    { icon: '📌', text: 'Info com valor' },
                    { icon: '🎭', text: 'Personagem relatable' },
                    { icon: '🏆', text: 'Promessa clara' }
                  ].map((item, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-[11px] font-medium text-zinc-400">{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-zinc-950 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    }>
      <CreateToolContent />
    </Suspense>
  );
}
