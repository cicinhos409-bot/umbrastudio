'use client';

import React, { useState } from 'react';
import { DashboardWrapper } from '@/components/DashboardWrapper';
import { Video, Loader2, Download, Play, AlertCircle } from 'lucide-react';
import { generateVideo } from '@/lib/videoGenerator';

export default function AIVideoGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const result = await generateVideo(prompt);
      if (result.video_url) {
        setVideoUrl(result.video_url);
      } else {
        setError(result.error || 'Não foi possível gerar o vídeo. Verifique suas chaves de API ou tente novamente.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao gerar o vídeo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardWrapper>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
              <Video className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Gerador de Vídeo AI</h1>
              <p className="text-zinc-400">Gere vídeos incríveis usando deAPI e APIFree</p>
            </div>
          </div>
        </header>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 lg:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Prompt do vídeo</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: cinematic youtube b-roll shot, dramatic lighting, camera moving forward, ultra realistic, 4k film look"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[120px] resize-none"
            />
            <p className="text-xs text-zinc-500">
              💡 Dica: Para vídeos virais use prompts detalhados em inglês (ex: cinematic, dramatic lighting, ultra realistic).
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando Vídeo...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Gerar Vídeo
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {videoUrl && (
            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <h3 className="text-lg font-bold text-white">Preview do Vídeo</h3>
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800">
                <video 
                  controls 
                  src={videoUrl} 
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                />
              </div>
              <div className="flex justify-end">
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="ai-video.mp4"
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Vídeo
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
}
