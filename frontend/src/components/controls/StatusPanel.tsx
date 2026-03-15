'use client'

import type { ConnectionStatus, MetadataResponse } from '@/types'
import { cn } from '@/lib/cn'

interface Props {
	status: ConnectionStatus
	metadata: MetadataResponse | null
	fps: number
	backendOnline: boolean
}

const STATUS_MAP: Record<ConnectionStatus, { label: string; color: string; dot: string }> = {
	idle: {
		label: 'Idle',
		color: 'text-ink-200',
		dot: 'bg-ink-600'
	},
	connecting: {
		label: 'Connecting',
		color: 'text-signal-amber',
		dot: 'bg-signal-amber animate-pulse'
	},
	connected: {
		label: 'Connected',
		color: 'text-jade-300',
		dot: 'bg-jade-400 animate-pulse-ember'
	},
	error: {
		label: 'Cam Offline',
		color: 'text-signal-red',
		dot: 'bg-signal-red animate-pulse'
	},
	fallback: {
		label: 'Fallback',
		color: 'text-signal-amber',
		dot: 'bg-signal-amber animate-pulse'
	},
}

const SOURCE_LABEL: Record<string, string> = {
	esp32: 'ESP32-CAM',
	webcam: 'Webcam',
	unknown: 'Unknown',
}

export function StatusPanel({ status, metadata, fps, backendOnline }: Props) {
	const sc = STATUS_MAP[status]
	const displayFps = fps > 0 ? fps : (metadata?.fps ?? null)

	return (
		<section className="space-y-4">
			<div className="flex items-center gap-2">
				<span className="text-ember-400/60 font-mono text-[10px]">//</span>
				<span className="font-mono text-[10px] text-ink-200 uppercase tracking-[0.2em]">System Status</span>
			</div>

			{/* Stats grid */}
			<div className="rounded border border-ink-700 bg-ink-950 divide-y divide-ink-800 overflow-hidden">
				<StatRow label="Stream">
					<div className="flex items-center gap-1.5">
						<span className={cn('w-1.5 h-1.5 rounded-full shrink-0', sc.dot)} />
						<span className={cn('font-mono text-xs', sc.color)}>{sc.label}</span>
					</div>
				</StatRow>

				<StatRow label="Backend">
					<div className="flex items-center gap-1.5">
						<span className={cn('w-1.5 h-1.5 rounded-full shrink-0',
							backendOnline ? 'bg-jade-400' : 'bg-signal-red animate-pulse'
						)} />
						<span className={cn('font-mono text-xs',
							backendOnline ? 'text-jade-300' : 'text-signal-red'
						)}>
							{backendOnline ? 'Online' : 'Offline'}
						</span>
					</div>
				</StatRow>

				<StatRow label="FPS">
					<span className={cn(
						'font-mono text-xs tabular-nums',
						displayFps ? 'text-ember-300' : 'text-ink-200',
					)}>
						{displayFps ?? '—'}
					</span>
				</StatRow>

				<StatRow label="Source">
					<span className="font-mono text-xs text-ink-200">
						{metadata?.source ? SOURCE_LABEL[metadata.source] ?? metadata.source : '—'}
					</span>
				</StatRow>
			</div>

			{/* Alert banners */}
			{status === 'error' && (
				<AlertBanner variant="red">
					<strong>Camera unavailable</strong>
					<span className="text-ink-200"> — backend may use webcam fallback</span>
				</AlertBanner>
			)}

			{status === 'fallback' && (
				<AlertBanner variant="amber">
					<strong>Webcam fallback active</strong>
					<span className="text-ink-200"> — original camera offline</span>
				</AlertBanner>
			)}

			{!backendOnline && (
				<AlertBanner variant="red">
					<strong>Server unreachable</strong>
					<span className="text-ink-200"> — retrying every 5 s</span>
				</AlertBanner>
			)}
		</section>
	)
}

function StatRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between px-3 py-2.5">
			<span className="font-mono text-[10px] text-ink-200 uppercase tracking-widest">{label}</span>
			{children}
		</div>
	)
}

function AlertBanner({ variant, children }: { variant: 'red' | 'amber'; children: React.ReactNode }) {
	const color = variant === 'red'
		? 'border-signal-red/25 bg-signal-red/5 text-signal-red'
		: 'border-signal-amber/25 bg-signal-amber/5 text-signal-amber'
	return (
		<div className={cn('rounded border px-3 py-2.5 font-mono text-[11px] leading-relaxed', color)}>
			{children}
		</div>
	)
}
