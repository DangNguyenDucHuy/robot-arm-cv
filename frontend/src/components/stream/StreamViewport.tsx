'use client'

import type { Keypoint, StreamMode, ConnectionStatus } from '@/types'
import { StreamPlayer } from './StreamPlayer'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'

interface Props {
	src: string
	active: boolean
	mode: StreamMode
	status: ConnectionStatus
	keypoints: Keypoint[]
	fps: number
	streamUrl: string
	backendOnline: boolean
	onLoad: () => void
	onError: () => void
}

export function StreamViewport({
	src, active, mode, status, keypoints, fps, streamUrl, backendOnline, onLoad, onError,
}: Props) {
	return (
		<div className="relative w-full h-full max-w-[1280px] mx-auto">

			{/* ── Outer frame ── */}
			<div className={cn(
				'relative w-full h-full rounded-lg overflow-hidden',
				'border bg-ink-950',
				active && status === 'connected'
					? 'border-ink-600'
					: 'border-ink-800',
				'shadow-panel',
			)}>

				{/* Background grid (visible when idle) */}
				{!active && (
					<div className="absolute inset-0 bg-grid-ink bg-grid-sm opacity-100" />
				)}

				{/* Stream */}
				<StreamPlayer
					src={src}
					active={active}
					mode={mode}
					keypoints={keypoints}
					onLoad={onLoad}
					onError={onError}
				/>

				{/* ── Corner markers ── */}
				<CornerMarkers active={active} />

				{/* ── HUD: top-left ── */}
				{active && (
					<div className="absolute top-3 left-4 flex items-center gap-2 z-20 pointer-events-none">
						<Badge variant="jade" pulse>Live</Badge>
						{fps > 0 && (
							<span className="font-mono text-[11px] text-ink-300 bg-ink-950/70 backdrop-blur-sm px-2 py-0.5 rounded border border-ink-700">
								{fps} <span className="text-ink-600">fps</span>
							</span>
						)}
					</div>
				)}

				{/* ── HUD: top-right ── */}
				{active && (
					<div className="absolute top-3 right-4 z-20 pointer-events-none">
						{mode === 'ai' && (
							<Badge variant="jade">
								<svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
									<circle cx="6" cy="12" r="2" />
									<circle cx="12" cy="6" r="2" />
									<circle cx="18" cy="16" r="2" />
									<line x1="6" y1="12" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" />
									<line x1="12" y1="6" x2="18" y2="16" stroke="currentColor" strokeWidth="1.5" />
								</svg>
								AI Active
							</Badge>
						)}
					</div>
				)}

				{/* ── HUD: bottom URL label ── */}
				{active && streamUrl && (
					<div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
						<span className="font-mono text-[10px] text-ink-500 bg-ink-950/70 backdrop-blur-sm px-3 py-1 rounded border border-ink-800 truncate max-w-xs block text-center">
							{streamUrl}
						</span>
					</div>
				)}

				{/* ── Backend offline overlay ── */}
				{active && !backendOnline && (
					<div className="absolute inset-0 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm z-30">
						<div className="text-center space-y-3 border border-signal-red/30 bg-ink-900/90 rounded-lg px-10 py-8">
							<div className="w-10 h-10 mx-auto rounded-full border border-signal-red/30 flex items-center justify-center">
								<svg className="w-5 h-5 text-signal-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
										d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
								</svg>
							</div>
							<p className="font-mono text-sm text-signal-red uppercase tracking-widest">Server Unavailable</p>
							<p className="font-mono text-xs text-ink-500">Retrying every 5 seconds…</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

/** Animated corner bracket markers — technical / industrial feel */
function CornerMarkers({ active }: { active: boolean }) {
	const color = active ? 'border-ember-400/50' : 'border-ink-700'
	const len = 'w-4 h-4'

	return (
		<>
			<div className={cn('absolute top-0 left-0 border-t border-l rounded-tl-lg pointer-events-none z-10', len, color)} />
			<div className={cn('absolute top-0 right-0 border-t border-r rounded-tr-lg pointer-events-none z-10', len, color)} />
			<div className={cn('absolute bottom-0 left-0 border-b border-l rounded-bl-lg pointer-events-none z-10', len, color)} />
			<div className={cn('absolute bottom-0 right-0 border-b border-r rounded-br-lg pointer-events-none z-10', len, color)} />
		</>
	)
}
