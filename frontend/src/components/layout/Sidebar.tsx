'use client'

import { useState } from 'react'
import type { StreamMode, ConnectionStatus, MetadataResponse } from '@/types'
import { StreamControls } from '@/components/controls/StreamControls'
import { StatusPanel } from '@/components/controls/StatusPanel'
import { Divider } from '@/components/ui/Divider'
import { cn } from '@/lib/cn'

interface Props {
  url: string
  active: boolean
  mode: StreamMode
  status: ConnectionStatus
  metadata: MetadataResponse | null
  fps: number
  backendOnline: boolean
  onUrlChange: (v: string) => void
  onStart: () => void
  onStop: () => void
  onModeChange: (m: StreamMode) => void
}

export function Sidebar(props: Props) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-ink-700 bg-ink-900 transition-[width] duration-200 shrink-0 overflow-hidden',
        collapsed ? 'w-11' : 'w-[272px]',
      )}
    >
      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={cn(
          'absolute top-4 z-10 w-5 h-5 rounded border border-ink-700 bg-ink-900',
          'flex items-center justify-center text-ink-200',
          'hover:border-ember-400/50 hover:text-ember-400 transition-colors',
          collapsed ? 'right-3' : 'right-3',
        )}
      >
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
        </svg>
      </button>

      {/* ── Collapsed state ── */}
      {collapsed && (
        <div className="flex flex-col items-center pt-14 gap-3 animate-fade-up">
          {/* Active dot */}
          <div className={cn(
            'w-1.5 h-1.5 rounded-full',
            props.active ? 'bg-jade-400 animate-pulse-ember' : 'bg-ink-700',
          )} />
          {/* Mode dot */}
          <div className={cn(
            'w-1.5 h-1.5 rounded-full',
            props.mode === 'ai' ? 'bg-ember-400' : 'bg-ink-700',
          )} />
        </div>
      )}

      {/* ── Expanded state ── */}
      {!collapsed && (
        <div className="flex flex-col gap-5 px-4 py-5 overflow-y-auto flex-1 animate-fade-up">
          {/* Sidebar header row */}
          <div className="flex items-center gap-2 mt-5">
            <div className="h-px flex-1 bg-ink-700" />
            <span className="font-mono text-[9px] text-ink-200 uppercase tracking-[0.3em]">Panel</span>
            <div className="h-px flex-1 bg-ink-700" />
          </div>

          <StreamControls
            url={props.url}
            active={props.active}
            mode={props.mode}
            onUrlChange={props.onUrlChange}
            onStart={props.onStart}
            onStop={props.onStop}
            onModeChange={props.onModeChange}
          />

          <Divider />

          <StatusPanel
            status={props.status}
            metadata={props.metadata}
            fps={props.fps}
            backendOnline={props.backendOnline}
          />

          {/* ── Bottom version stamp ── */}
          <div className="mt-auto pt-4">
            <Divider />
            <p className="font-mono text-[9px] text-ink-200 text-center mt-3 tracking-widest uppercase">
              Developed by DND Huy - 2026
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}
