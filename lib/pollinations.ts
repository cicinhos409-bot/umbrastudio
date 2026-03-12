const API_BASE = "https://gen.pollinations.ai"

type Message = {
  role: "system" | "user" | "assistant"
  content: string
}

// =============================
// GERAR TEXTO
// =============================
export const POLLINATIONS_MODELS = {
  text: [
    { id: 'qwen-safety', name: 'Qwen Guard' },
    { id: 'claude-airforce', name: 'Claude Sonnet API' },
    { id: 'step-3.5-flash', name: 'Step 3.5 Flash' },
    { id: 'nova-fast', name: 'Amazon Nova Micro' },
    { id: 'gemini-fast', name: 'Gemini 2.5 Flash Lite' },
    { id: 'mistral', name: 'Mistral Small' },
    { id: 'qwen-coder', name: 'Qwen Coder' },
    { id: 'gemini-search', name: 'Gemini Search' },
    { id: 'grok', name: 'Grok 4 Fast' },
    { id: 'openai-fast', name: 'GPT-5 Nano' },
    { id: 'openai', name: 'GPT-5 Mini' },
    { id: 'perplexity-fast', name: 'Perplexity Sonar' },
    { id: 'minimax', name: 'MiniMax' },
    { id: 'deepseek', name: 'DeepSeek V3.2' },
    { id: 'claude-fast', name: 'Claude Haiku' },
    { id: 'kimi', name: 'Kimi' },
    { id: 'perplexity-reasoning', name: 'Perplexity Reasoning' },
    { id: 'glm', name: 'GLM-5' },
  ],
  image: [
    { id: 'flux', name: 'Flux Schnell' },
    { id: 'flux-2-dev', name: 'FLUX.2 Dev' },
    { id: 'dirtberry', name: 'Dirtberry' },
    { id: 'zimage', name: 'Z-Image Turbo' },
    { id: 'imagen-4', name: 'Imagen 4' },
    { id: 'grok-imagine', name: 'Grok Imagine' },
    { id: 'klein', name: 'FLUX.2 Klein 4B' },
    { id: 'gptimage', name: 'GPT Image 1 Mini' },
    { id: 'klein-large', name: 'FLUX.2 Klein 9B' },
  ],
  video: [
    { id: 'grok-video', name: 'Grok Video' },
  ],
  audio: [
    { id: 'whisper', name: 'Whisper Large V3' },
    { id: 'elevenlabs', name: 'ElevenLabs TTS' },
  ],
  experimental: [
    { id: 'nomnom', name: 'NomNom' },
    { id: 'polly', name: 'Polly' },
    { id: 'qwen-character', name: 'Qwen Character' },
    { id: 'midijourney', name: 'MIDIjourney' },
  ],
  allText: [
    { id: 'qwen-safety', name: 'Qwen Guard' },
    { id: 'claude-airforce', name: 'Claude Sonnet API' },
    { id: 'step-3.5-flash', name: 'Step 3.5 Flash' },
    { id: 'nova-fast', name: 'Amazon Nova Micro' },
    { id: 'gemini-fast', name: 'Gemini 2.5 Flash Lite' },
    { id: 'mistral', name: 'Mistral Small' },
    { id: 'qwen-coder', name: 'Qwen Coder' },
    { id: 'gemini-search', name: 'Gemini Search' },
    { id: 'grok', name: 'Grok 4 Fast' },
    { id: 'openai-fast', name: 'GPT-5 Nano' },
    { id: 'openai', name: 'GPT-5 Mini' },
    { id: 'perplexity-fast', name: 'Perplexity Sonar' },
    { id: 'minimax', name: 'MiniMax' },
    { id: 'deepseek', name: 'DeepSeek V3.2' },
    { id: 'claude-fast', name: 'Claude Haiku' },
    { id: 'kimi', name: 'Kimi' },
    { id: 'perplexity-reasoning', name: 'Perplexity Reasoning' },
    { id: 'glm', name: 'GLM-5' },
    { id: 'nomnom', name: 'NomNom' },
    { id: 'polly', name: 'Polly' },
    { id: 'qwen-character', name: 'Qwen Character' },
  ]
};

export async function generateText(
  prompt: string,
  model: string = "claude-airforce",
  image?: string // base64 or URL
) {
  let apiKey = process.env.NEXT_PUBLIC_POLLINATIONS_KEY;
  if (typeof window !== 'undefined') {
    const savedKeys = localStorage.getItem('umbra_api_keys');
    if (savedKeys) {
      const parsed = JSON.parse(savedKeys);
      if (parsed.pollinations) apiKey = parsed.pollinations;
    }
  }

  try {
    const messages: any[] = [
      {
        role: "user",
        content: image ? [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: image } }
        ] : prompt
      }
    ]

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${API_BASE}/text`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: model,
        messages: messages
      })
    })

    if (!response.ok) {
      throw new Error("Erro ao gerar texto")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

// =============================
// GERAR IMAGEM
// =============================
export function generateImage(
  prompt: string,
  model: string = "flux"
) {
  const encodedPrompt = encodeURIComponent(prompt)

  return `${API_BASE}/image?prompt=${encodedPrompt}&model=${model}`
}

// =============================
// GERAR VÍDEO
// =============================
export async function generateVideo(
  prompt: string,
  model: string = "grok-video"
) {
  let apiKey = process.env.NEXT_PUBLIC_POLLINATIONS_KEY;
  if (typeof window !== 'undefined') {
    const savedKeys = localStorage.getItem('umbra_api_keys');
    if (savedKeys) {
      const parsed = JSON.parse(savedKeys);
      if (parsed.pollinations) apiKey = parsed.pollinations;
    }
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${API_BASE}/video`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: model,
        prompt: prompt
      })
    })

    const data = await response.json()
    return data.url || data.uri || data
  } catch (error) {
    console.error(error)
    return null
  }
}

// =============================
// GERAR VOZ (TTS)
// =============================
export async function generateVoice(
  text: string,
  model: string = "elevenlabs"
) {
  let apiKey = process.env.NEXT_PUBLIC_POLLINATIONS_KEY;
  if (typeof window !== 'undefined') {
    const savedKeys = localStorage.getItem('umbra_api_keys');
    if (savedKeys) {
      const parsed = JSON.parse(savedKeys);
      if (parsed.pollinations) apiKey = parsed.pollinations;
    }
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${API_BASE}/audio`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: model,
        text: text
      })
    })

    const data = await response.json()
    return data.url || data.uri || data
  } catch (error) {
    console.error(error)
    return null
  }
}
