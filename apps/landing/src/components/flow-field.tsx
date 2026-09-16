import { useEffect, useRef } from "react"

import { simplex3 } from "@/lib/simplex-noise"

/** Grid do campo: ~20px por célula. O noise é amostrado em coordenadas / 20. */
const FIELD_SCALE = 1 / 20
/** Terceira dimensão do noise = tempo. Lento de propósito. */
const TIME_STEP = 0.0005
const CONNECT_DISTANCE = 120
const CONNECT_DISTANCE_SQ = CONNECT_DISTANCE * CONNECT_DISTANCE
/** ~30fps: o movimento é lento demais para justificar 60. */
const FRAME_MS = 1000 / 30
/* Calibrado para o campo sobreviver ao backdrop-blur das islands, que cobrem
   quase toda a página. Nos valores originais (raio 1.5, alphas 0.15 / 0.08 /
   0.02) ele sumia atrás delas. O raio e a espessura importam tanto quanto o
   alpha: feição fina demais o blur apaga, por mais opaca que seja. */
const PARTICLE_RADIUS = 2.5
const LINE_WIDTH = 0.8
const PARTICLE_ALPHA = 0.42
const LINE_ALPHA_NEAR = 0.22
const LINE_ALPHA_FAR = 0.06
const MIN_SPEED = 0.3
const MAX_SPEED = 0.8

type Particle = { x: number; y: number; speed: number; z: number }

/**
 * Lê --color-primary do tema em vez de fixar o verde aqui — o canvas não
 * aceita `var()`, mas ainda assim a cor tem uma fonte só (theme.css).
 */
function readPrimaryRgb(): string {
  const fallback = "179, 222, 0"
  if (typeof window === "undefined") return fallback

  const raw = getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()
  const match = /^#?([0-9a-f]{6})$/i.exec(raw)
  if (!match) return fallback

  const value = Number.parseInt(match[1], 16)
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`
}

/**
 * Background animado: partículas seguindo um campo de fluxo, ligadas por
 * linhas quando próximas. Fica atrás de tudo, não captura ponteiro e é
 * puramente decorativo (aria-hidden).
 */
export function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const rgb = readPrimaryRgb()

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let time = 0
    let frame = 0
    let lastFrameAt = 0
    let resizeTimer: ReturnType<typeof setTimeout> | undefined

    const randomSpeed = () => MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)

    // Tudo abaixo é arrow const, não `function`: declarações de função são
    // içadas e o TS descarta o narrowing de `canvas`/`ctx` dentro delas.
    const syncParticles = () => {
      const target = width < 768 ? 50 : 100

      // Reposiciona quem ficou fora da nova área e completa/corta a lista, em
      // vez de recriar tudo — um resize não deve reembaralhar o campo inteiro.
      for (const particle of particles) {
        if (particle.x > width) particle.x = Math.random() * width
        if (particle.y > height) particle.y = Math.random() * height
      }

      while (particles.length < target) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: randomSpeed(),
          z: 0.3 + Math.random() * 0.7,
        })
      }
      if (particles.length > target) particles = particles.slice(0, target)
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight

      // Metade do devicePixelRatio: o efeito é difuso, não precisa de nitidez.
      const scale = Math.max(1, (window.devicePixelRatio || 1) / 2)
      canvas.width = Math.round(width * scale)
      canvas.height = Math.round(height * scale)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      // Atribuir width/height reseta a transform — reaplicar depois, sempre.
      ctx.setTransform(scale, 0, 0, scale, 0, 0)

      syncParticles()
    }

    const update = () => {
      const MARGIN = CONNECT_DISTANCE;

      for (const particle of particles) {
        const angle =
          simplex3(particle.x * FIELD_SCALE, particle.y * FIELD_SCALE, time) * Math.PI * 2
        particle.x += Math.cos(angle) * (particle.speed * particle.z)
        particle.y += Math.sin(angle) * (particle.speed * particle.z)

        // Wrap-around nas quatro bordas: o campo não tem margem.
        if (particle.x < -MARGIN) {
            particle.x += width + (MARGIN * 2)
        } else if (particle.x > width + MARGIN) {
            particle.x -= width + (MARGIN * 2)
        }
        
        if (particle.y < -MARGIN) {
            particle.y += height + (MARGIN * 2)
        } else if (particle.y > height + MARGIN) {
            particle.y -= height + (MARGIN * 2)
        }
      }

      time += TIME_STEP
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      ctx.lineWidth = LINE_WIDTH
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distanceSq = dx * dx + dy * dy
          if (distanceSq >= CONNECT_DISTANCE_SQ) continue

          // Mais perto, mais visível — e ainda assim quase nada.
          const closeness = 1 - Math.sqrt(distanceSq) / CONNECT_DISTANCE

          const averageZ = (a.z + b.z) / 2;

          const alpha = (LINE_ALPHA_FAR + (LINE_ALPHA_NEAR - LINE_ALPHA_FAR) * closeness) * averageZ;
          ctx.strokeStyle = `rgba(${rgb}, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      for (const particle of particles) {
        // --- EFEITO DE PROFUNDIDADE (Z) NA OPACIDADE ---
        ctx.fillStyle = `rgba(${rgb}, ${PARTICLE_ALPHA * particle.z})`
        
        // Movemos a configuração da sombra para DENTRO do loop!
        // Assim, multiplicamos a opacidade do brilho e o raio do blur pelo "z",
        // garantindo que as partículas do fundo não tenham um neon forte demais.
        ctx.shadowColor = `rgba(${rgb}, ${0.8 * particle.z})` 
        ctx.shadowBlur = 10 * particle.z; 
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.beginPath()
        // --- EFEITO DE PROFUNDIDADE (Z) NO TAMANHO ---
        ctx.arc(particle.x, particle.y, PARTICLE_RADIUS * particle.z, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }

    const step = (now: number) => {
      frame = requestAnimationFrame(step)
      if (now - lastFrameAt < FRAME_MS) return
      lastFrameAt = now
      update()
      draw()
    }

    const start = () => {
      if (frame || motionQuery.matches) return
      lastFrameAt = performance.now()
      frame = requestAnimationFrame(step)
    }

    const stop = () => {
      if (!frame) return
      cancelAnimationFrame(frame)
      frame = 0
    }

    const handleVisibility = () => {
      // Aba escondida não anima. `time` não pula ao voltar: ele só avança por
      // frame desenhado, nunca por relógio de parede.
      if (document.hidden) stop()
      else start()
    }

    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resize()
        if (motionQuery.matches) draw()
      }, 150)
    }

    const handleMotionChange = () => {
      if (motionQuery.matches) {
        // Constelação estática: um frame e nada mais.
        stop()
        draw()
      } else if (!document.hidden) {
        start()
      }
    }

    resize()
    draw()
    if (!motionQuery.matches && !document.hidden) start()

    window.addEventListener("resize", handleResize)
    document.addEventListener("visibilitychange", handleVisibility)
    motionQuery.addEventListener("change", handleMotionChange)

    return () => {
      stop()
      clearTimeout(resizeTimer)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibility)
      motionQuery.removeEventListener("change", handleMotionChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
