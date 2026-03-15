'use client'

import { useRef, useEffect, useState } from 'react'
import type { Keypoint, StreamMode } from '@/types'
import { KeypointCanvas } from './KeypointCanvas'

interface Props {
	src: string
	active: boolean
	mode: StreamMode
	keypoints: Keypoint[]
	onLoad: () => void
	onError: () => void
}

export function StreamPlayer({ src, active, mode, keypoints, onLoad, onError }: Props) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [size, setSize] = useState({ w: 1280, h: 720 })

	useEffect(() => {
		console.log("StreamPlayer src: ", src)
		const el = containerRef.current
		if (!el) return
		const ro = new ResizeObserver(([entry]) => {
			if (entry) setSize({ w: entry.contentRect.width, h: entry.contentRect.height })
		})
		ro.observe(el)
		return () => ro.disconnect()
	}, [src])

	return (
		<div ref={containerRef} className="relative w-full h-full overflow-hidden">
			{(active && src) ? (
				<>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={src}
						alt="Camera stream"
						className="absolute inset-0 w-full h-full object-contain"
						onLoad={onLoad}
						onError={onError}
					/>
					{mode === 'ai' && (
						<KeypointCanvas
							keypoints={keypoints}
							width={size.w}
							height={size.h}
						/>
					)}
				</>
			) : (
				<NoSignal />
			)}
		</div>
	)
}

function NoSignal() {
	return (
		<div className="absolute inset-0 flex flex-col items-center justify-center select-none">
			{/* Animated grid noise placeholder */}
			<div className="relative w-40 h-28 mb-8">
				{/* Cross-hatch lines */}
				<svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 160 112">
					{Array.from({ length: 8 }, (_, i) => (
						<line key={`h${i}`} x1="0" y1={i * 16} x2="160" y2={i * 16} stroke="#ff6b1a" strokeWidth="0.5" />
					))}
					{Array.from({ length: 11 }, (_, i) => (
						<line key={`v${i}`} x1={i * 16} y1="0" x2={i * 16} y2="112" stroke="#ff6b1a" strokeWidth="0.5" />
					))}
				</svg>

				{/* Camera icon */}
				<div className="absolute inset-0 flex items-center justify-center">
					<svg className="w-14 h-14 text-ink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75}
							d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14
                 M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
					</svg>
				</div>

				{/* Scan line animation */}
				<div className="absolute inset-0 overflow-hidden opacity-30">
					<div className="w-full h-px bg-gradient-to-r from-transparent via-ember-400 to-transparent animate-scan-down" />
				</div>
			</div>

			<p className="font-mono text-xs text-ink-400 uppercase tracking-[0.3em] mb-1">No Signal</p>
			<p className="font-mono text-[10px] text-ink-600 tracking-widest">Input stream URL → Start</p>
		</div>
	)
}
