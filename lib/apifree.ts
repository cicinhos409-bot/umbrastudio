// ============================================================
//  lib/apifree.ts
//  Integração com APIFree — geração de vídeo com modelos IA
// ============================================================

const APIFREE_URL = "https://api.apifree.ai/v1/video/generations"

export interface ApifreeOptions {
  model?: "wan-video" | "wan-video-pro" | "cogvideox" | "kling"
  duration?: 3 | 5 | 10
  resolution?: "480p" | "720p" | "1080p"
  fps?: 24 | 30
  style?: string
}

export interface ApifreеResponse {
  video_url: string | null
  job_id?: string
  status?: string
  error?: string
  provider: "apifree"
}

/**
 * Gera um vídeo usando a APIFree
 * @param prompt - Descrição do vídeo a ser gerado
 * @param options - Opções de configuração (model, duration, resolution, fps)
 * @returns ApifreеResponse com video_url ou null em caso de erro
 */
export async function generateVideoApifree(
  prompt: string,
  options: ApifreeOptions = {}
): Promise<ApifreеResponse> {
  const {
    model = "wan-video",
    duration = 5,
    resolution = "720p",
    fps = 24,
    style,
  } = options

  let apiKey = process.env.NEXT_PUBLIC_APIFREE_KEY;
  if (typeof window !== 'undefined') {
    const savedKeys = localStorage.getItem('umbra_api_keys');
    if (savedKeys) {
      const parsed = JSON.parse(savedKeys);
      if (parsed.apifree) apiKey = parsed.apifree;
    }
  }

  try {
    const response = await fetch(APIFREE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey ?? "SUA_API_KEY_APIFREE"}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        duration,
        resolution,
        fps,
        ...(style && { style }),
      }),
    })

    if (!response.ok) {
      const errBody = await response.text()
      console.error(`[APIFree] HTTP ${response.status}:`, errBody)
      return { video_url: null, error: `HTTP ${response.status}`, provider: "apifree" }
    }

    const data = await response.json()

    return {
      video_url: data.video_url ?? null,
      job_id: data.job_id,
      status: data.status,
      provider: "apifree",
    }
  } catch (error) {
    console.error("[APIFree] Erro na requisição:", error)
    return {
      video_url: null,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      provider: "apifree",
    }
  }
}
