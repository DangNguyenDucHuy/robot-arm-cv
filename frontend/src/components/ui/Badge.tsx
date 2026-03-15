import { cn } from '@/lib/cn'

type Variant = 'ember' | 'jade' | 'muted' | 'signal-red' | 'signal-amber'

interface BadgeProps {
  variant?: Variant
  pulse?: boolean
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<Variant, string> = {
  ember:        'border-ember-400/40 bg-ember-400/10 text-ember-300',
  jade:         'border-jade-400/40 bg-jade-400/10 text-jade-300',
  muted:        'border-ink-600 bg-ink-800 text-ink-300',
  'signal-red': 'border-signal-red/40 bg-signal-red/10 text-signal-red',
  'signal-amber':'border-signal-amber/40 bg-signal-amber/10 text-signal-amber',
}

export function Badge({ variant = 'muted', pulse = false, children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-[11px] uppercase tracking-widest',
      variantClasses[variant],
      className,
    )}>
      {pulse && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full shrink-0',
          variant === 'jade' ? 'bg-jade-400 animate-pulse-ember' :
          variant === 'ember' ? 'bg-ember-400 animate-pulse-ember' :
          variant === 'signal-red' ? 'bg-signal-red animate-pulse' :
          'bg-ink-400',
        )} />
      )}
      {children}
    </span>
  )
}
