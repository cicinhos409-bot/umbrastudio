// ============================================================
//  lib/videoGenerator.ts
//  Controlador unificado — tenta deAPI e faz fallback para APIFree
// ============================================================

import { generateVideoDeapi, DeapiOptions } from "./deapi"
import { generateVideoApifree, ApifreeOptions } from "./apifree"

export type VideoProvider = "deapi" | "apifree" | "none"

export interface VideoResult {
  video_url: string | null
  provider: VideoProvider
  job_id?: string
  error?: string
  attempts: {
    deapi?: { success: boolean; error?: string }
    apifree?: { success: boolean; error?: string }
  }
}

export interface VideoGeneratorOptions {
  duration?: 3 | 5 | 10
  resolution?: "480p" | "720p" | "1080p"
  /** Força uso de um provider específico (ignora fallback) */
  forceProvider?: "deapi" | "apifree"
  /** Desativa o fallback automático para APIFree */
  noFallback?: boolean
}

/**
 * Gera vídeo com fallback automático:
 * 1. Tenta deAPI (modelo wan)
 * 2. Se falhar → tenta APIFree (modelo wan-video)
 *
 * @param prompt - Descrição do vídeo
 * @param options - Opções de geração e controle de provider
 * @returns VideoResult com url, provider usado e log de tentativas
 *
 * @example
 * const result = await generateVideo("cinematic sunset over mountains")
 * if (result.video_url) {
 *   console.log(`Gerado por ${result.provider}: ${result.video_url}`)
 * }
 */
export async function generateVideo(
  prompt: string,
  options: VideoGeneratorOptions = {}
): Promise<VideoResult> {
  const {
    duration = 5,
    resolution = "720p",
    forceProvider,
    noFallback = false,
  } = options

  const attempts: VideoResult["attempts"] = {}

  // ── Forçar provider específico ──────────────────────────────
  if (forceProvider === "deapi") {
    const r = await generateVideoDeapi(prompt, { duration, resolution })
    attempts.deapi = { success: !!r.video_url, error: r.error }
    return { video_url: r.video_url, provider: r.video_url ? "deapi" : "none", job_id: r.job_id, attempts }
  }

  if (forceProvider === "apifree") {
    const r = await generateVideoApifree(prompt, { duration, resolution })
    attempts.apifree = { success: !!r.video_url, error: r.error }
    return { video_url: r.video_url, provider: r.video_url ? "apifree" : "none", job_id: r.job_id, attempts }
  }

  // ── Tentativa 1: deAPI ──────────────────────────────────────
  console.log("[VideoGenerator] Tentando deAPI...")
  const deapiResult = await generateVideoDeapi(prompt, { duration, resolution })
  attempts.deapi = { success: !!deapiResult.video_url, error: deapiResult.error }

  if (deapiResult.video_url) {
    console.log("[VideoGenerator] ✅ Sucesso via deAPI")
    return {
      video_url: deapiResult.video_url,
      provider: "deapi",
      job_id: deapiResult.job_id,
      attempts,
    }
  }

  if (noFallback) {
    console.warn("[VideoGenerator] deAPI falhou e fallback desativado.")
    return { video_url: null, provider: "none", error: deapiResult.error, attempts }
  }

  // ── Tentativa 2: APIFree (fallback) ─────────────────────────
  console.log("[VideoGenerator] deAPI falhou. Tentando APIFree como fallback...")
  const apifreeResult = await generateVideoApifree(prompt, { duration, resolution })
  attempts.apifree = { success: !!apifreeResult.video_url, error: apifreeResult.error }

  if (apifreeResult.video_url) {
    console.log("[VideoGenerator] ✅ Sucesso via APIFree (fallback)")
    return {
      video_url: apifreeResult.video_url,
      provider: "apifree",
      job_id: apifreeResult.job_id,
      attempts,
    }
  }

  // ── Ambas falharam ──────────────────────────────────────────
  console.error("[VideoGenerator] ❌ Ambas as APIs falharam.", attempts)
  return {
    video_url: null,
    provider: "none",
    error: "Ambas as APIs falharam. Verifique suas chaves e tente novamente.",
    attempts,
  }
}
