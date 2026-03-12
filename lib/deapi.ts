// ============================================================
//  lib/deapi.ts
//  Integração com deAPI — geração de vídeo com IA
// ============================================================

const DEAPI_URL = "https://api.deapi.ai/v1/video/generate"

export interface DeapiOptions {
  model?: "wan" | "wan-pro" | "wan-ultra"
  duration?: 3 | 5 | 10
  resolution?: "480p" | "720p" | "1080p"
  negative_prompt?: string
  seed?: number
}

export interface DeapiResponse {
  video_url: string | null
  job_id?: string
  status?: string
  error?: string
  provider: "deapi"
}

/**
 * Gera um vídeo usando a deAPI
 * @param prompt - Descrição do vídeo a ser gerado
 * @param options - Opções de configuração (model, duration, resolution)
 * @returns DeapiResponse com video_url ou null em caso de erro
 */
export async function generateVideoDeapi(
  prompt: string,
  options: DeapiOptions = {}
): Promise<DeapiResponse> {
  const {
    model = "wan",
    duration = 5,
    resolution = "720p",
    negative_prompt,
    seed,
  } = options

  let apiKey = process.env.NEXT_PUBLIC_DEAPI_KEY;
  if (typeof window !== 'undefined') {
    const savedKeys = localStorage.getItem('umbra_api_keys');
    if (savedKeys) {
      const parsed = JSON.parse(savedKeys);
      if (parsed.deapi) apiKey = parsed.deapi;
    }
  }

  try {
    const response = await fetch(DEAPI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey ?? "SUA_API_KEY_DEAPI"}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        duration,
        resolution,
        ...(negative_prompt && { negative_prompt }),
        ...(seed !== undefined && { seed }),
      }),
    })

    if (!response.ok) {
      const errBody = await response.text()
      console.error(`[deAPI] HTTP ${response.status}:`, errBody)
      return { video_url: null, error: `HTTP ${response.status}`, provider: "deapi" }
    }

    const data = await response.json()

    return {
      video_url: data.video_url ?? null,
      job_id: data.job_id,
      status: data.status,
      provider: "deapi",
    }
  } catch (error) {
    console.error("[deAPI] Erro na requisição:", error)
    return {
      video_url: null,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      provider: "deapi",
    }
  }
}
