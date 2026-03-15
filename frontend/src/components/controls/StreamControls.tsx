'use client'

import type { StreamMode } from '@/types'
import { cn } from '@/lib/cn'

interface Props {
	url: string
	active: boolean
	mode: StreamMode
	onUrlChange: (v: string) => void
	onStart: () => void
	onStop: () => void
	onModeChange: (m: StreamMode) => void
}

export function StreamControls({ url, active, mode, onUrlChange, onStart, onStop, onModeChange }: Props) {
	return (
		<section className="space-y-5">
			{/* ── Camera Input ── */}
			<div className="space-y-2">
				<SectionLabel>Camera Input</SectionLabel>

				<div className="space-y-1">
					<label className="font-mono text-[10px] text-ink-200 uppercase tracking-widest">
						Stream URL
					</label>
					<input
						type="text"
						value={url}
						onChange={e => onUrlChange(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && !active && onStart()}
						placeholder="http://192.168.1.10:81/stream"
						disabled={active}
						className={cn(
							'w-full bg-ink-950 border rounded px-3 py-2',
							'font-mono text-xs text-ink-200 placeholder-ink-600',
							'focus:outline-none transition-colors',
							active
								? 'border-ink-700 opacity-50 cursor-not-allowed'
								: 'border-ink-700 focus:border-ember-400/70 focus:shadow-ember-sm',
						)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-2 pt-1">
					<button
						onClick={onStart}
						disabled={active || !url.trim()}
						className={cn(
							'py-2 px-3 rounded border font-mono text-xs uppercase tracking-widest transition-all duration-150',
							'flex items-center justify-center gap-2',
							active || !url.trim()
								? 'opacity-30 cursor-not-allowed border-ink-700 text-ink-200'
								: 'border-ember-400/50 text-ember-300 bg-ember-400/5 hover:bg-ember-400/15 hover:border-ember-400 hover:shadow-ember-sm',
						)}
					>
						<span className={cn(
							'w-1.5 h-1.5 rounded-full',
							active || !url.trim() ? 'bg-ink-600' : 'bg-ember-400',
						)} />
						Start
					</button>

					<button
						onClick={onStop}
						disabled={!active}
						className={cn(
							'py-2 px-3 rounded border font-mono text-xs uppercase tracking-widest transition-all duration-150',
							!active
								? 'opacity-30 cursor-not-allowed border-ink-700 text-ink-200'
								: 'border-ink-600 text-ink-200 hover:border-signal-red/50 hover:text-signal-red hover:bg-signal-red/5',
						)}
					>
						Stop
					</button>
				</div>
			</div>

			{/* ── Stream Mode ── */}
			<div className="space-y-2">
				<SectionLabel>Stream Mode</SectionLabel>

				<div className="grid grid-cols-2 gap-1 p-1 rounded bg-ink-950 border border-ink-700">
					{(['raw', 'ai'] as StreamMode[]).map(m => (
						<button
							key={m}
							onClick={() => onModeChange(m)}
							className={cn(
								'py-2 rounded font-mono text-xs uppercase tracking-widest transition-all duration-100',
								mode === m
									? m === 'ai'
										? 'bg-jade-400/15 text-jade-300 shadow-jade-sm'
										: 'bg-ember-400/15 text-ember-300'
									: 'text-ink-200 hover:text-ink-200',
							)}
						>
							{m === 'ai' ? 'AI Keypoints' : 'Raw'}
						</button>
					))}
				</div>
			</div>
		</section>
	)
}

function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-2">
			<span className="text-ember-400/60 font-mono text-[10px]">//</span>
			<span className="font-mono text-[10px] text-ink-200 uppercase tracking-[0.2em]">{children}</span>
		</div>
	)
}
