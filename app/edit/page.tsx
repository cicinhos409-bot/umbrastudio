'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DashboardWrapper } from '@/components/DashboardWrapper';
import { 
  Video, 
  FileText, 
  Clapperboard, 
  Palette, 
  Users, 
  UserCheck, 
  Map as MapIcon, 
  Image as ImageIcon, 
  Edit3, 
  Save, 
  Zap, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Check, 
  Sparkles, 
  Mic, 
  Music, 
  Type, 
  Wand2, 
  Download, 
  Play, 
  Pause,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Monitor,
  Smartphone,
  Square,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { generateText, generateImage, generateVoice, POLLINATIONS_MODELS } from '@/lib/pollinations';
import { generateVideo } from '@/lib/videoGenerator';
import { ModelSelector } from '@/components/ModelSelector';
import { Cpu, ImageIcon as ImageIconLucide, Mic as MicLucide, Video as VideoLucide } from 'lucide-react';

// --- Types ---
interface Scene {
  num: number;
  text: string;
  imgDesc: string;
  imgUrl: string;
}

interface Character {
  id: number;
  name: string;
  type: string;
  age: string;
  desc: string;
  imgUrl: string;
}

interface Ambient {
  desc: string;
  imgUrl: string;
  time: string;
  weather: string;
}

const STEP_NAMES = [
  'Roteiro',
  'Cenas',
  'Estilo',
  'Personagens',
  'Elenco',
  'Ambientes',
  'Imagens',
  'Edição'
];

const TEMPLATES = [
  { icon: '🎄', name: 'História de Natal' },
  { icon: '👨‍👩‍👧', name: 'Drama Familiar' },
  { icon: '💔', name: 'Romance Proibido' },
  { icon: '🏆', name: 'Superação Pessoal' },
  { icon: '🕵️', name: 'Mistério e Segredos' },
  { icon: '⚖️', name: 'Vingança e Justiça' },
  { icon: '🤝', name: 'Reencontro Emocional' },
  { icon: '🌹', name: 'Amor e Perda' },
  { icon: '⚡', name: 'Queda e Redenção' },
  { icon: '🌀', name: 'Virada de Destino' },
  { icon: '🔒', name: 'Segredo de Família' },
  { icon: '🗡️', name: 'Traição Inesperada' },
  { icon: '🙏', name: 'Culpa e Perdão' },
  { icon: '🪞', name: 'Descoberta de Identidade' },
];

const STYLES = [
  { emoji: '🎨', name: 'Realista' },
  { emoji: '🖌️', name: 'Pintura' },
  { emoji: '🌸', name: 'Anime' },
  { emoji: '🏰', name: 'Disney' },
  { emoji: '💥', name: 'Comic Book' },
  { emoji: '🔷', name: 'Geométrico' },
  { emoji: '🎠', name: 'Cartoon' },
  { emoji: '🪆', name: 'Minecraft' },
  { emoji: '📖', name: 'Picture Book' },
  { emoji: '✏️', name: 'Vetorial' },
  { emoji: '🌙', name: 'Dark Fantasy' },
  { emoji: '🤖', name: 'Cyberpunk' },
];

export default function EditPage() {
  // --- State ---
  const [currentStep, setCurrentStep] = useState(1);
  const [scriptMode, setScriptMode] = useState<'ai' | 'manual'>('ai');
  const [aiSource, setAiSource] = useState('pollinations');
  const [imgSource, setImgSource] = useState('pollinations');
  const [ratio, setRatio] = useState('9:16');
  const [style, setStyle] = useState('Realista');
  const [script, setScript] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [cast, setCast] = useState<Record<number, number[]>>({}); // { sceneIdx: [charIds] }
  const [ambients, setAmbients] = useState<Record<number, Ambient>>({});
  const [images, setImages] = useState<Record<number, string>>({});
  const [narration, setNarration] = useState<string | null>(null);
  const [voiceSource, setVoiceSource] = useState('pollinations');
  const [selectedTextModel, setSelectedTextModel] = useState('claude-airforce');
  const [selectedImageModel, setSelectedImageModel] = useState('flux');
  const [selectedVoiceModel, setSelectedVoiceModel] = useState('elevenlabs');
  const [selectedVideoModel, setSelectedVideoModel] = useState('auto');
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [audioUrls, setAudioUrls] = useState<Record<number, string>>({});
  const [videoUrls, setVideoUrls] = useState<Record<number, string>>({});

  const handleGenerateVoice = async () => {
    if (scenes.length === 0) return;
    setIsGeneratingVoice(true);
    try {
      const newAudioUrls: Record<number, string> = { ...audioUrls };
      for (let i = 0; i < scenes.length; i++) {
        const url = await generateVoice(scenes[i].text, selectedVoiceModel);
        if (url) newAudioUrls[i] = url;
      }
      setAudioUrls(newAudioUrls);
      notify('Narração gerada com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      notify('Erro ao gerar narração.', 'error');
    } finally {
      setIsGeneratingVoice(false);
    }
  };
  const [editingSceneIdx, setEditingSceneIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [idea, setIdea] = useState('');
  const [scenesCount, setScenesCount] = useState(15);
  const [scriptLang, setScriptLang] = useState('pt');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [deepseekApiKey, setDeepseekApiKey] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [googleTtsKey, setGoogleTtsKey] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentClip, setCurrentClip] = useState(0);
  const [editTab, setEditTab] = useState('narration');
  const [showExportSummary, setShowExportSummary] = useState(false);

  // --- Modals ---
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);
  const [isSceneModalOpen, setIsSceneModalOpen] = useState(false);
  const [isImgFXModalOpen, setIsImgFXModalOpen] = useState(false);

  // --- Refs ---
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Effects ---
  useEffect(() => {
    const saved = localStorage.getItem('ubra_project_v2');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setScript(data.script || '');
        setScenes(data.scenes || []);
        setCharacters(data.characters || []);
        setStyle(data.style || 'Realista');
        setRatio(data.ratio || '9:16');
        setCast(data.cast || {});
        setAmbients(data.ambients || {});
        setImages(data.images || {});
      } catch (e) {
        console.error('Error loading project', e);
      }
    }
  }, []);

  const handleGenerateVideo = async () => {
    if (scenes.length === 0) return;
    setIsGeneratingVideo(true);
    try {
      const newVideoUrls: Record<number, string> = { ...videoUrls };
      for (let i = 0; i < scenes.length; i++) {
        const sc = scenes[i];
        const amb = ambients[i] || { desc: '', time: 'dia', weather: 'ensolarado' };
        const charNames = (cast[i] || []).map(id => characters.find(c => c.id === id)?.name).filter(Boolean).join(', ');
        const prompt = `${sc.imgDesc || sc.text}, ${style} style, ${amb.time || 'daylight'}, ${amb.weather || ''}, ${charNames ? 'featuring ' + charNames : ''}, cinematic composition, high detail, 4k`;
        
        const result = await generateVideo(prompt, {
          forceProvider: selectedVideoModel === 'auto' ? undefined : selectedVideoModel as any
        });
        
        if (result.video_url) {
          newVideoUrls[i] = result.video_url;
        }
      }
      setVideoUrls(newVideoUrls);
      notify('Vídeos gerados com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      notify('Erro ao gerar vídeos.', 'error');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const loadProject = () => {
    const saved = localStorage.getItem('ubra_project_v2');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setScript(data.script || '');
        setScenes(data.scenes || []);
        setCharacters(data.characters || []);
        setStyle(data.style || 'Realista');
        setRatio(data.ratio || '9:16');
        setCast(data.cast || {});
        setAmbients(data.ambients || {});
        setImages(data.images || {});
        notify('Projeto carregado!', 'success');
      } catch (e) {
        notify('Erro ao carregar projeto.', 'error');
      }
    } else {
      notify('Nenhum projeto salvo encontrado.', 'info');
    }
  };

  const saveProject = () => {
    const data = {
      script,
      scenes,
      characters,
      style,
      ratio,
      cast,
      ambients,
      images,
      videoUrls,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('ubra_project_v2', JSON.stringify(data));
    notify('Projeto salvo!', 'success');
  };

  const notify = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    // Simple alert for now, could be a toast
    console.log(`[${type}] ${msg}`);
  };

  // --- Navigation ---
  const goToStep = (n: number) => {
    setCurrentStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStep = () => {
    if (currentStep < 8) goToStep(currentStep + 1);
    else handleExport();
  };

  const prevStep = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  // --- Step 1: Script Logic ---
  const handleAIScript = async () => {
    if (!idea.trim()) return notify('Digite uma ideia primeiro!', 'error');
    setLoading(true);
    setError(null);

    const langName = ({ pt: 'português', en: 'inglês', es: 'espanhol', de: 'alemão' } as Record<string, string>)[scriptLang] || 'português';
    const prompt = `Crie um roteiro completo em ${langName} com ${scenesCount} cenas para a seguinte história: "${idea}".
Formato: enumere cada cena como "CENA X:" seguido do texto da cena.
Cada cena deve ter 1-2 frases descritivas. Inclua diálogos e ações dos personagens.
Retorne somente o roteiro, sem introdução ou explicação.`;

    try {
      let result = '';
      if (aiSource === 'pollinations') {
        const data = await generateText(prompt, selectedTextModel);
        result = typeof data === 'string' ? data : data?.text || data?.content || JSON.stringify(data);
      } else if (aiSource === 'google' && googleApiKey) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${googleApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        result = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }

      if (result) {
        setScript(result);
        parseScenes(result);
        notify('Roteiro gerado com sucesso!', 'success');
      }
    } catch (e) {
      setError('Erro ao gerar roteiro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const generateAllAmbients = async () => {
    if (scenes.length === 0) return notify('Crie cenas primeiro!', 'error');
    setLoading(true);
    notify('Gerando descrições de ambientes...');
    
    const newAmbients = { ...ambients };
    for (let i = 0; i < scenes.length; i++) {
      const sc = scenes[i];
      const prompt = `Descreva em 1 frase curta (máximo 15 palavras) o ambiente/cenário da seguinte cena: "${sc.text}". Apenas o ambiente, sem personagens.`;
      const data = await generateText(prompt, selectedTextModel);
      const result = typeof data === 'string' ? data : data?.text || data?.content || '';
      
      if (result) {
        const desc = result.trim().slice(0, 150);
        newAmbients[i] = {
          desc,
          imgUrl: generateImage(`${desc}, ${style} style, cinematic`, selectedImageModel),
          time: 'dia',
          weather: 'ensolarado'
        };
      }
      setAmbients({ ...newAmbients });
    }
    setLoading(false);
    notify('Todos os ambientes gerados!', 'success');
  };

  const parseScenes = (text: string) => {
    const lines = text.split('\n');
    const newScenes: Scene[] = [];
    let current: Scene | null = null;

    lines.forEach(line => {
      const match = line.match(/^(?:CENA|Cena|Scene)\s*(\d+)[:\s.-]*(.*)/i);
      if (match) {
        if (current) newScenes.push(current);
        current = { num: parseInt(match[1]), text: match[2].trim(), imgDesc: '', imgUrl: '' };
      } else if (current && line.trim()) {
        current.text += ' ' + line.trim();
      }
    });
    if (current) newScenes.push(current);

    if (newScenes.length === 0 && text.length > 0) {
      const paras = text.split(/\n\n+/).filter(p => p.trim().length > 20);
      paras.slice(0, 30).forEach((p, i) => {
        newScenes.push({ num: i + 1, text: p.trim().slice(0, 200), imgDesc: '', imgUrl: '' });
      });
    }
    setScenes(newScenes);
  };

  // --- Step 4: Character Logic ---
  const generateCharacters = async () => {
    if (scenes.length === 0) return notify('Gere um roteiro primeiro!', 'error');
    setLoading(true);
    const src = script || scenes.map(s => s.text).join('. ');
    const prompt = `Com base nesta história: "${src.slice(0, 500)}", crie uma lista de 4 personagens principais.
Para cada personagem retorne: Nome, Tipo (Humano/Animal/Outro), Idade, Descrição visual breve.
Formato: PERSONAGEM X | Nome | Tipo | Idade | Descrição`;

    try {
      const data = await generateText(prompt, selectedTextModel);
      const result = typeof data === 'string' ? data : data?.text || data?.content || '';
      const lines = result.split('\n').filter((l: string) => l.includes('|'));
      const newChars: Character[] = [];
      lines.forEach((line: string) => {
        const parts = line.split('|').map((s: string) => s.trim());
        if (parts.length >= 4) {
          newChars.push({
            id: Date.now() + Math.random(),
            name: parts[1] || parts[0],
            type: (parts[2] || 'Humano').toLowerCase().includes('animal') ? 'animal' : 'human',
            age: parts[3] || '',
            desc: parts[4] || '',
            imgUrl: ''
          });
        }
      });
      setCharacters(prev => [...prev, ...newChars]);
      notify(`${newChars.length} personagens gerados!`, 'success');
    } catch (e) {
      setError('Erro ao gerar personagens.');
    } finally {
      setLoading(false);
    }
  };

  const generateCharImage = async (idx: number) => {
    const ch = characters[idx];
    notify(`Gerando imagem de ${ch.name}...`);
    const prompt = `Portrait of ${ch.name}, ${ch.desc || 'person'}, ${style} style, detailed, high quality, centered composition`;
    const url = generateImage(prompt, selectedImageModel);
    const newChars = [...characters];
    newChars[idx].imgUrl = url;
    setCharacters(newChars);
  };

  // --- Step 7: Image Logic ---
  const generateOneImage = async (idx: number) => {
    const sc = scenes[idx];
    const amb = ambients[idx] || { desc: '', imgUrl: '', time: 'dia', weather: 'ensolarado' };
    const charNames = (cast[idx] || []).map(id => characters.find(c => c.id === id)?.name).filter(Boolean).join(', ');
    
    notify(`Gerando imagem da cena ${sc.num}...`);
    const prompt = `${sc.imgDesc || sc.text}, ${style} style, ${amb.time || 'daylight'}, ${amb.weather || ''}, ${charNames ? 'featuring ' + charNames : ''}, cinematic composition, high detail, 4k`;
    const url = generateImage(prompt, selectedImageModel);
    
    setImages(prev => ({ ...prev, [idx]: url }));
  };

  const generateAllImages = async () => {
    if (scenes.length === 0) return notify('Crie cenas primeiro!', 'error');
    setLoading(true);
    notify('Gerando imagens das cenas...');
    
    for (let i = 0; i < scenes.length; i++) {
      await generateOneImage(i);
      await new Promise(r => setTimeout(r, 800));
    }
    setLoading(false);
    notify('Todas as imagens geradas!', 'success');
  };

  const generateSingleAmbient = async (index: number) => {
    const sc = scenes[index];
    setLoading(true);
    const prompt = `Descreva em 1 frase curta o ambiente da cena: "${sc.text}". Apenas o ambiente.`;
    const data = await generateText(prompt, selectedTextModel);
    const result = typeof data === 'string' ? data : data?.text || data?.content || '';
    if (result) {
      const desc = result.trim();
      setAmbients({
        ...ambients,
        [index]: {
          desc,
          imgUrl: generateImage(`${desc}, ${style} style`, selectedImageModel),
          time: ambients[index]?.time || 'dia',
          weather: ambients[index]?.weather || 'ensolarado'
        }
      });
      notify(`Ambiente da cena ${index + 1} gerado!`, 'success');
    }
    setLoading(false);
  };

  const generateSingleImage = async (index: number) => {
    await generateOneImage(index);
    notify(`Imagem da cena ${index + 1} gerada!`, 'success');
  };

  // --- Step 8: Editing Logic ---
  const togglePlay = () => {
    if (isPlaying) {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playIntervalRef.current = setInterval(() => {
        setCurrentClip(prev => {
          if (prev < scenes.length - 1) return prev + 1;
          if (playIntervalRef.current) clearInterval(playIntervalRef.current);
          setIsPlaying(false);
          return 0;
        });
      }, 2000);
    }
  };

  const handleExport = () => {
    if (Object.keys(images).length === 0) return notify('Gere imagens primeiro!', 'error');
    setShowExportSummary(true);
  };

  // --- Render Helpers ---
  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Templates de Ideia</h3>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t, i) => (
            <button
              key={i}
              onClick={() => setIdea(`Uma história sobre: ${t.name}. `)}
              className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-xs text-zinc-400 hover:border-amber-500/50 hover:text-amber-500 transition-all"
            >
              {t.icon} {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Configurações</h3>
          
          <ModelSelector 
            label="Modelo de Texto" 
            models={POLLINATIONS_MODELS.allText} 
            selectedModel={selectedTextModel} 
            onModelChange={setSelectedTextModel}
            icon={Cpu}
          />

          <div className="space-y-2">
            <label className="text-xs text-zinc-500">Idioma</label>
            <select 
              value={scriptLang}
              onChange={(e) => setScriptLang(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="pt">🇧🇷 Português</option>
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="de">🇩🇪 Deutsch</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-500">Quantidade de Cenas: <span className="text-amber-500 font-bold">{scenesCount}</span></label>
            <input 
              type="range" 
              min="1" max="30" 
              value={scenesCount}
              onChange={(e) => setScenesCount(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setScriptMode('ai')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${scriptMode === 'ai' ? 'bg-amber-600 text-white' : 'bg-zinc-950 border border-zinc-800 text-zinc-500'}`}
            >
              <Sparkles className="w-4 h-4" /> AI Mode
            </button>
            <button 
              onClick={() => setScriptMode('manual')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${scriptMode === 'manual' ? 'bg-amber-600 text-white' : 'bg-zinc-950 border border-zinc-800 text-zinc-500'}`}
            >
              <Edit3 className="w-4 h-4" /> Manual
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Sua Ideia</h3>
          <textarea 
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Descreva sua ideia aqui..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[150px] resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-zinc-500 uppercase">{idea.length}/1000</span>
            <button className="text-xs text-amber-500 font-bold hover:underline">✨ Aprimorar</button>
          </div>
        </div>
      </div>

      {scriptMode === 'ai' && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-6">Fonte de IA</h3>
          <div className="flex flex-wrap gap-4 mb-8">
            {['pollinations', 'google', 'deepseek', 'groq'].map(src => (
              <button
                key={src}
                onClick={() => setAiSource(src)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${aiSource === src ? 'bg-amber-500 text-black' : 'bg-zinc-950 border border-zinc-800 text-zinc-500'}`}
              >
                {src.charAt(0).toUpperCase() + src.slice(1)}
              </button>
            ))}
          </div>

          {aiSource === 'google' && (
            <div className="mb-6">
              <label className="block text-xs text-zinc-500 mb-2">Google AI Studio API Key</label>
              <input 
                type="password" 
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none"
              />
            </div>
          )}

          <button 
            onClick={handleAIScript}
            disabled={loading}
            className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Gerar Roteiro com {aiSource.charAt(0).toUpperCase() + aiSource.slice(1)}
          </button>
        </div>
      )}

      {script && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Roteiro Gerado</h3>
            <button onClick={() => setScript('')} className="text-zinc-500 hover:text-white"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
            {script}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Cenas Extraídas</h3>
          <p className="text-xs text-zinc-500">{scenes.length} cenas no total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setScenes([...scenes, { num: scenes.length + 1, text: 'Nova cena', imgDesc: '', imgUrl: '' }])} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Cena
          </button>
          <button onClick={() => parseScenes(script)} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-2">
            <Zap className="w-4 h-4" /> Refazer Divisão
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {scenes.map((sc, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 hover:border-amber-500/30 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <span className="w-8 h-8 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center font-bold text-sm">{sc.num}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-white"><ChevronUp className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-white"><ChevronDown className="w-4 h-4" /></button>
                <button onClick={() => setScenes(scenes.filter((_, idx) => idx !== i))} className="p-1.5 hover:bg-red-500/10 rounded-md text-zinc-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <textarea 
              value={sc.text}
              onChange={(e) => {
                const newScenes = [...scenes];
                newScenes[i].text = e.target.value;
                setScenes(newScenes);
              }}
              className="w-full bg-transparent border-none p-0 text-sm text-zinc-400 focus:ring-0 resize-none min-h-[80px]"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-12">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-8">Formato / Proporção</h3>
        <div className="flex flex-wrap gap-6">
          {[
            { id: '9:16', label: 'Vertical', sub: 'TikTok/Reels', icon: Smartphone, w: 40, h: 70 },
            { id: '1:1', label: 'Quadrado', sub: 'Instagram', icon: Square, w: 50, h: 50 },
            { id: '16:9', label: 'Horizontal', sub: 'YouTube', icon: Monitor, w: 70, h: 40 },
            { id: '4:5', label: 'Retrato', sub: 'Social Feed', icon: Layout, w: 45, h: 60 },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setRatio(r.id)}
              className={`flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all ${ratio === r.id ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
            >
              <div className="bg-zinc-900 rounded-md flex items-center justify-center" style={{ width: 80, height: 80 }}>
                <r.icon className="w-8 h-8" />
              </div>
              <div className="text-center">
                <div className="font-bold text-sm">{r.id}</div>
                <div className="text-[10px] uppercase tracking-tighter opacity-70">{r.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-8">Estilo Visual</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {STYLES.map(s => (
            <button
              key={s.name}
              onClick={() => setStyle(s.name)}
              className={`aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${style === s.name ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
            >
              <span className="text-3xl">{s.emoji}</span>
              <span className="text-[11px] font-bold uppercase">{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Personagens</h3>
          <p className="text-xs text-zinc-500">{characters.length} personagens configurados</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsCharModalOpen(true)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> Novo Personagem
          </button>
          <button onClick={generateCharacters} disabled={loading} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Gerar com IA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {characters.map((ch, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center space-y-4 group relative">
            <button onClick={() => setCharacters(characters.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 p-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3 h-3" /></button>
            <div className="w-24 h-24 mx-auto rounded-full bg-zinc-950 border-2 border-zinc-800 overflow-hidden flex items-center justify-center">
            <div className="w-full h-full relative">
              {ch.imgUrl ? (
                <Image 
                  src={ch.imgUrl} 
                  alt={ch.name} 
                  fill 
                  className="object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl">{ch.type === 'animal' ? '🐾' : '👤'}</span>
                </div>
              )}
            </div>
            </div>
            <div>
              <div className="font-bold text-white">{ch.name}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{ch.type} · {ch.age || '?'}</div>
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => generateCharImage(i)} className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-amber-500 transition-all"><ImageIcon className="w-4 h-4" /></button>
              <button className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-amber-500 transition-all"><Edit3 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Elenco por Cena</h3>
        <div className="flex gap-2">
          <button onClick={() => {
            const newCast: Record<number, number[]> = {};
            scenes.forEach((_, i) => newCast[i] = characters.map(c => c.id));
            setCast(newCast);
          }} className="text-xs text-amber-500 font-bold hover:underline">Marcar Todos</button>
          <button onClick={() => setCast({})} className="text-xs text-zinc-500 font-bold hover:underline">Limpar Todos</button>
        </div>
      </div>

      <div className="space-y-4">
        {scenes.map((sc, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center font-bold flex-shrink-0">{sc.num}</div>
            <div className="flex-1">
              <div className="text-sm text-zinc-400 line-clamp-2">{sc.text}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {characters.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => {
                    const sceneCast = cast[i] || [];
                    const newCast = sceneCast.includes(ch.id) ? sceneCast.filter(id => id !== ch.id) : [...sceneCast, ch.id];
                    setCast({ ...cast, [i]: newCast });
                  }}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                    (cast[i] || []).includes(ch.id) ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                  }`}
                >
                  {ch.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Ambientes</h3>
        <button 
          onClick={generateAllAmbients}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Gerar Todos com IA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenes.map((sc, i) => {
          const amb = ambients[i] || { desc: '', imgUrl: '', time: 'dia', weather: 'ensolarado' };
          return (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Cena {sc.num}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => generateSingleAmbient(i)}
                    className="p-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-500 hover:text-amber-500"
                  >
                    <Sparkles className="w-3 h-3" />
                  </button>
                  <button className="p-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-500 hover:text-amber-500"><ImageIcon className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="aspect-video bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden relative flex items-center justify-center">
                {amb.imgUrl ? (
                  <Image 
                    src={amb.imgUrl} 
                    alt={`Ambiente Cena ${sc.num}`} 
                    fill 
                    className="object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-zinc-800" />
                )}
              </div>
              <textarea 
                value={amb.desc || sc.text}
                onChange={(e) => setAmbients({ ...ambients, [i]: { ...amb, desc: e.target.value } })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none h-20"
              />
              <div className="flex flex-wrap gap-2">
                {['dia', 'noite', 'entardecer'].map(t => (
                  <button
                    key={t}
                    onClick={() => setAmbients({ ...ambients, [i]: { ...amb, time: t } })}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border transition-all ${amb.time === t ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-bold text-white">Imagens das Cenas</h3>
        <div className="w-full sm:w-64">
          <ModelSelector 
            label="Modelo de Imagem" 
            models={POLLINATIONS_MODELS.image} 
            selectedModel={selectedImageModel} 
            onModelChange={setSelectedImageModel}
            icon={ImageIconLucide}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={generateAllImages} disabled={loading} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />} Gerar Todas
          </button>
          <button onClick={() => setIsImgFXModalOpen(true)} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Image FX
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenes.map((sc, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden group relative">
            <div className="aspect-video bg-zinc-950 flex items-center justify-center relative">
              {images[i] ? (
                <Image 
                  src={images[i]} 
                  alt={`Cena ${sc.num}`} 
                  fill 
                  className="object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <ImageIcon className="w-12 h-12 text-zinc-900" />
              )}
            </div>
            <div className="p-4 bg-zinc-950/80 backdrop-blur-sm border-t border-zinc-800 flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-500 uppercase">Cena {sc.num}</span>
              <div className="flex gap-2">
                <button onClick={() => generateSingleImage(i)} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-amber-500 transition-all"><Zap className="w-4 h-4" /></button>
                <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-amber-500 transition-all"><Download className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Prévia do Vídeo</h3>
          <div className="aspect-video bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden relative group">
            {images[currentClip] ? (
              <Image 
                src={images[currentClip]} 
                alt={`Preview Cena ${currentClip + 1}`} 
                fill 
                className="object-cover" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-zinc-800">
                <Video className="w-16 h-16" />
                <span className="text-sm font-bold">Gere as imagens para ver a prévia</span>
              </div>
            )}
            
            {audioUrls[currentClip] && (
              <audio 
                src={audioUrls[currentClip]} 
                autoPlay={isPlaying} 
                onEnded={() => isPlaying && nextStep()} 
                className="hidden"
              />
            )}
            
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all">
              <button onClick={togglePlay} className="w-10 h-10 bg-amber-500 text-black rounded-lg flex items-center justify-center hover:scale-105 transition-all">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-300" 
                  style={{ width: `${(currentClip / (scenes.length - 1 || 1)) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-zinc-400">00:0{currentClip} / 00:0{scenes.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Timeline</h3>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {scenes.map((sc, i) => (
              <button
                key={i}
                onClick={() => setCurrentClip(i)}
                className={`flex-shrink-0 w-32 h-20 rounded-xl border-2 transition-all overflow-hidden relative ${currentClip === i ? 'border-amber-500 scale-105 z-10' : 'border-zinc-800 opacity-50 hover:opacity-100'}`}
              >
              <div className="w-full h-full relative">
                {videoUrls[i] ? (
                  <video 
                    src={videoUrls[i]} 
                    className="w-full h-full object-cover" 
                    muted 
                    loop 
                    autoPlay={currentClip === i}
                  />
                ) : images[i] ? (
                  <Image 
                    src={images[i]} 
                    alt={`Thumbnail Cena ${i + 1}`} 
                    fill 
                    className="object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-[10px] font-bold text-zinc-800">
                    CENA {sc.num}
                  </div>
                )}
              </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'video', icon: VideoLucide, label: 'Vídeo' },
              { id: 'narration', icon: Mic, label: 'Voz' },
              { id: 'subtitles', icon: Type, label: 'Legendas' },
              { id: 'music', icon: Music, label: 'Música' },
              { id: 'effects', icon: Wand2, label: 'Efeitos' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setEditTab(tab.id)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider flex flex-col items-center gap-2 transition-all ${editTab === tab.id ? 'bg-amber-500 text-black' : 'bg-zinc-950 border border-zinc-800 text-zinc-500'}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {editTab === 'video' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Modelo de Vídeo</label>
                  <select 
                    value={selectedVideoModel}
                    onChange={(e) => setSelectedVideoModel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="auto">Auto (Fallback Inteligente)</option>
                    <option value="deapi">deAPI (wan)</option>
                    <option value="apifree">APIFree (wan-video)</option>
                  </select>
                </div>
                
                <button 
                  onClick={handleGenerateVideo} 
                  disabled={isGeneratingVideo}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {isGeneratingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <VideoLucide className="w-4 h-4" />}
                  Gerar Vídeos das Cenas
                </button>
              </div>
            )}

            {editTab === 'narration' && (
              <div className="space-y-4">
                <ModelSelector 
                  label="Modelo de Voz" 
                  models={POLLINATIONS_MODELS.audio} 
                  selectedModel={selectedVoiceModel} 
                  onModelChange={setSelectedVoiceModel}
                  icon={MicLucide}
                />
                <div className="grid grid-cols-2 gap-2">
                  {['manual', 'pollinations', 'elevenlabs', 'google'].map(src => (
                    <button
                      key={src}
                      onClick={() => setVoiceSource(src)}
                      className={`py-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${voiceSource === src ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
                {voiceSource === 'pollinations' && (
                  <div className="space-y-4">
                    <button 
                      onClick={handleGenerateVoice} 
                      disabled={isGeneratingVoice}
                      className="w-full py-3 bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                    >
                      {isGeneratingVoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                      Gerar Narração (Pollinations)
                    </button>
                  </div>
                )}
                {voiceSource === 'elevenlabs' && (
                  <div className="space-y-4">
                    <input type="password" placeholder="ElevenLabs API Key" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs" />
                    <button className="w-full py-3 bg-amber-600 text-white text-xs font-bold rounded-xl">Gerar Narração</button>
                  </div>
                )}
                {voiceSource === 'manual' && (
                  <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-8 text-center space-y-2 cursor-pointer hover:border-amber-500/50 transition-all">
                    <Mic className="w-8 h-8 mx-auto text-zinc-700" />
                    <div className="text-xs text-zinc-500">Clique para upload de áudio</div>
                  </div>
                )}
              </div>
            )}
            {editTab === 'subtitles' && (
              <div className="space-y-4">
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white">
                  <option>Padrão · Branco</option>
                  <option>Bold Amarelo · YouTube</option>
                  <option>Karaokê · Animado</option>
                </select>
                <button className="w-full py-3 bg-amber-600 text-white text-xs font-bold rounded-xl">Gerar Legendas</button>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleExport}
          className="w-full py-5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-3xl shadow-xl shadow-amber-600/20 flex items-center justify-center gap-3 text-lg"
        >
          <Download className="w-6 h-6" /> EXPORTAR VÍDEO
        </button>
      </div>
    </div>
  );

  return (
    <DashboardWrapper>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
              <Video className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Editor de Vídeo AI</h1>
              <p className="text-zinc-500 text-sm">Crie histórias cinematográficas em minutos.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadProject} className="px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-bold rounded-2xl transition-all flex items-center gap-2 text-sm">
              <Copy className="w-4 h-4" /> Abrir Projeto
            </button>
            <button onClick={saveProject} className="px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-bold rounded-2xl transition-all flex items-center gap-2 text-sm">
              <Save className="w-4 h-4" /> Salvar Projeto
            </button>
            <button onClick={() => goToStep(8)} className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" /> Exportar
            </button>
          </div>
        </header>

        {/* Steps Nav */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-8 mb-8 scrollbar-hide">
          {STEP_NAMES.map((name, i) => {
            const stepNum = i + 1;
            const isActive = currentStep === stepNum;
            const isDone = currentStep > stepNum;
            return (
              <React.Fragment key={name}>
                <button
                  onClick={() => goToStep(stepNum)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-full border transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-amber-500 border-amber-500 text-black font-bold shadow-lg shadow-amber-500/20' 
                      : isDone
                        ? 'bg-zinc-900 border-amber-500/30 text-amber-500'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? 'bg-black/20' : 'bg-zinc-800'}`}>
                    {stepNum}
                  </span>
                  <span className="text-xs uppercase tracking-wider">{name}</span>
                </button>
                {i < STEP_NAMES.length - 1 && <div className="w-4 h-px bg-zinc-800 flex-shrink-0" />}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Main Content */}
        <main className="min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
              {currentStep === 7 && renderStep7()}
              {currentStep === 8 && renderStep8()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer Nav */}
        <footer className="mt-16 pt-8 border-t border-zinc-800 flex justify-between items-center">
          <div className="text-xs text-zinc-500 uppercase tracking-widest">
            Etapa <span className="text-amber-500 font-bold">{currentStep}</span> de 8 · {STEP_NAMES[currentStep - 1]}
          </div>
          <div className="flex gap-4">
            {currentStep > 1 && (
              <button onClick={prevStep} className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" /> Anterior
              </button>
            )}
            <button onClick={nextStep} className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2">
              {currentStep < 8 ? (
                <>Próximo <ArrowRight className="w-5 h-5" /></>
              ) : (
                <>Exportar Vídeo <Download className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isCharModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCharModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Novo Personagem</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Nome do Personagem" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white" />
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white">
                  <option value="human">Humano</option>
                  <option value="animal">Animal</option>
                  <option value="other">Outro</option>
                </select>
                <textarea placeholder="Descrição Visual" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white h-32 resize-none" />
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsCharModalOpen(false)} className="flex-1 py-4 bg-zinc-800 text-white font-bold rounded-xl">Cancelar</button>
                  <button className="flex-1 py-4 bg-amber-600 text-white font-bold rounded-xl">Criar</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showExportSummary && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExportSummary(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-zinc-900 border border-amber-500/30 rounded-[40px] p-10 text-center shadow-2xl">
              <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Video className="w-12 h-12 text-amber-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">PROJETO FINALIZADO!</h2>
              <p className="text-zinc-500 text-sm mb-8">Seu projeto Ubra Studio Bold está pronto para ser processado.</p>
              
              <div className="bg-zinc-950 rounded-3xl p-6 mb-8 text-left space-y-3 border border-zinc-800">
                <div className="flex justify-between text-xs"><span className="text-zinc-500 uppercase">Cenas</span><span className="text-amber-500 font-bold">{scenes.length}</span></div>
                <div className="flex justify-between text-xs"><span className="text-zinc-500 uppercase">Imagens</span><span className="text-amber-500 font-bold">{Object.keys(images).length}</span></div>
                <div className="flex justify-between text-xs"><span className="text-zinc-500 uppercase">Estilo</span><span className="text-amber-500 font-bold">{style}</span></div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-4 bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-600/20">Baixar Imagens</button>
                <button onClick={() => setShowExportSummary(false)} className="w-full py-4 bg-zinc-800 text-zinc-400 font-bold rounded-2xl">Fechar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardWrapper>
  );
}
