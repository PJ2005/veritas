"use client"

import { useEffect, useRef } from "react"

interface SimilarityGaugeProps {
  score: number
  threshold: number
}

export function SimilarityGauge({ score, threshold }: SimilarityGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height
    const radius = Math.min(width, height) * 0.8

    // Draw gauge background
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false)
    ctx.lineWidth = 20
    ctx.strokeStyle = "#e5e7eb"
    ctx.stroke()

    // Draw threshold marker
    const thresholdAngle = Math.PI - threshold * Math.PI
    const thresholdX1 = centerX + (radius - 30) * Math.cos(thresholdAngle)
    const thresholdY1 = centerY + (radius - 30) * Math.sin(thresholdAngle)
    const thresholdX2 = centerX + (radius + 10) * Math.cos(thresholdAngle)
    const thresholdY2 = centerY + (radius + 10) * Math.sin(thresholdAngle)

    ctx.beginPath()
    ctx.moveTo(thresholdX1, thresholdY1)
    ctx.lineTo(thresholdX2, thresholdY2)
    ctx.lineWidth = 2
    ctx.strokeStyle = "#6b7280"
    ctx.stroke()

    // Draw score gauge
    const scoreAngle = Math.PI - score * Math.PI
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, scoreAngle, true)
    ctx.lineWidth = 20

    // Color based on score relative to threshold
    let color
    if (score < threshold - 0.1) {
      color = "#10b981" // Green
    } else if (score < threshold) {
      color = "#f59e0b" // Amber
    } else {
      color = "#ef4444" // Red
    }

    ctx.strokeStyle = color
    ctx.stroke()

    // Draw score text
    ctx.font = "bold 24px sans-serif"
    ctx.fillStyle = color
    ctx.textAlign = "center"
    ctx.fillText(`${(score * 100).toFixed(1)}%`, centerX, centerY - radius / 2)

    // Draw threshold text
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#6b7280"
    ctx.textAlign = "center"
    ctx.fillText(`Threshold: ${(threshold * 100).toFixed(0)}%`, centerX, centerY - 20)
  }, [score, threshold])

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} width={300} height={150} className="max-w-full" />
    </div>
  )
}

