import { cn } from '@/lib/cn'

interface DividerProps {
  label?: string
  className?: string
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <div className={cn('h-px bg-ink-700', className)} />
  }
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="h-px flex-1 bg-ink-700" />
      <span className="font-mono text-[10px] text-ink-400 uppercase tracking-[0.2em]">{label}</span>
      <div className="h-px flex-1 bg-ink-700" />
    </div>
  )
}
