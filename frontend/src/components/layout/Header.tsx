'use client'

import type { StreamMode, ConnectionStatus } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'

interface Props {
	mode: StreamMode
	status: ConnectionStatus
	fps: number
}

export function Header({ mode, status, fps }: Props) {
	const isLive = status === 'connected' || status === 'fallback'

	return (
		<header className="h-14 flex items-center justify-between px-5 border-b border-ink-700 bg-ink-900 shrink-0 z-20">

			{/* ── Left: Logo + Title ── */}
			<div className="flex items-center gap-3">
				{/* Logo mark — skeletal arm icon */}
				<div className="relative w-7 h-7 flex items-center justify-center">
					<svg viewBox="0 0 28 28" className="w-7 h-7" fill="none">
						{/* Bone segments */}
						<circle cx="6" cy="22" r="2.5" stroke="#ff6b1a" strokeWidth="1.2" />
						<circle cx="14" cy="14" r="2" stroke="#ff6b1a" strokeWidth="1.2" />
						<circle cx="22" cy="6" r="2.5" stroke="#ff6b1a" strokeWidth="1.2" />
						<circle cx="22" cy="22" r="1.5" stroke="#ff6b1a" strokeWidth="1.2" />
						<circle cx="6" cy="6" r="1.5" stroke="#ff6b1a" strokeWidth="1.2" />
						<line x1="6" y1="22" x2="14" y2="14" stroke="#ff6b1a" strokeWidth="1" strokeOpacity="0.6" />
						<line x1="14" y1="14" x2="22" y2="6" stroke="#ff6b1a" strokeWidth="1" strokeOpacity="0.6" />
						<line x1="14" y1="14" x2="22" y2="22" stroke="#ff6b1a" strokeWidth="1" strokeOpacity="0.35" />
						<line x1="14" y1="14" x2="6" y2="6" stroke="#ff6b1a" strokeWidth="1" strokeOpacity="0.35" />
					</svg>
					{/* Glow backdrop */}
					<div className="absolute inset-0 rounded-full bg-ember-400/5 blur-sm" />
				</div>

				<div className="leading-none">
					<h1 className="font-mono text-sm font-semibold text-ink-100 tracking-wider">
						Robot Arm CV
					</h1>
					<p className="font-mono text-[10px] text-ink-200 tracking-[0.2em] uppercase mt-0.5">
						Tracking arm and control robot realtime
					</p>
				</div>
			</div>

			{/* ── Right: status pills ── */}
			<div className="flex items-center gap-2">
				{isLive && fps > 0 && (
					<span className="font-mono text-xs text-ink-400 tabular-nums">
						<span className="text-ember-400">{fps}</span>
						<span className="text-ink-600 ml-0.5">fps</span>
					</span>
				)}

				{isLive && (
					<Badge variant="jade" pulse>Live</Badge>
				)}

				<Badge variant={mode === 'ai' ? 'jade' : 'muted'}>
					{mode === 'ai' ? 'AI Mode' : 'Raw'}
				</Badge>

				{/* Traffic-light dots */}
				<div className="flex items-center gap-1.5 ml-1 pl-3 border-l border-ink-700">
					<span className={cn('w-2 h-2 rounded-full', isLive ? 'bg-jade-400' : 'bg-ink-700')} />
					<span className={cn('w-2 h-2 rounded-full', status === 'connecting' ? 'bg-signal-amber animate-pulse' : 'bg-ink-700')} />
					<span className={cn('w-2 h-2 rounded-full', status === 'error' ? 'bg-signal-red animate-pulse' : 'bg-ink-700')} />
				</div>
			</div>
		</header>
	)
}
