'use client'

import { useEffect, useRef } from 'react'
import type { Keypoint } from '@/types'
import { CANVAS, BONE_PAIRS } from '@/config/env'

interface Props {
	keypoints: Keypoint[]
	width: number
	height: number
}

export function KeypointCanvas({ keypoints, width, height }: Props) {
	const ref = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = ref.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		ctx.clearRect(0, 0, width, height)
		if (keypoints == null || !keypoints.length) return
		
		console.log("Keypoints: ", keypoints)

		// --- Draw bones --- 
		ctx.strokeStyle = CANVAS.boneColor
		ctx.lineWidth = CANVAS.boneWidth
		ctx.lineCap = 'round'

		for (const [a, b] of BONE_PAIRS) {
			const kA = keypoints[a]
			const kB = keypoints[b]
			if (!kA || !kB || kA.v === 0 || kB.v === 0) continue
			ctx.beginPath()
			ctx.moveTo(kA.x, kA.y)
			ctx.lineTo(kB.x, kB.y)
			ctx.stroke()
		}

		// --- Draw joints ---
		for (const kp of keypoints) {
			if (kp.v === 0) continue
			const { x, y } = kp

			// Outer glow
			const glow = ctx.createRadialGradient(x, y, 0, x, y, CANVAS.dotRadius * 3.5)
			glow.addColorStop(0, CANVAS.glowColor)
			glow.addColorStop(1, 'rgba(0,217,142,0)')
			ctx.beginPath()
			ctx.arc(x, y, CANVAS.dotRadius * 3.5, 0, Math.PI * 2)
			ctx.fillStyle = glow
			ctx.fill()

			// Solid dot
			ctx.beginPath()
			ctx.arc(x, y, CANVAS.dotRadius, 0, Math.PI * 2)
			ctx.fillStyle = CANVAS.dotColor
			ctx.fill()

			// Specular highlight
			ctx.beginPath()
			ctx.arc(x - 1.2, y - 1.2, CANVAS.dotRadius * 0.35, 0, Math.PI * 2)
			ctx.fillStyle = 'rgba(255,255,255,0.85)'
			ctx.fill()
		}
	}, [keypoints, width, height])

	return (
		<canvas
			ref={ref}
			width={width}
			height={height}
			className="absolute inset-0 pointer-events-none z-10"
		/>
	)
}
