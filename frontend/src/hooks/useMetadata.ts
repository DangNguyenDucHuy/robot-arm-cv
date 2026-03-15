'use client'

import { useState, useEffect, useRef } from 'react'
import type { MetadataResponse } from '@/types'
import { apiService } from '@/services/api'
import { POLL } from '@/config/env'

interface UseMetadataReturn {
  metadata: MetadataResponse | null
  online: boolean
}

export function useMetadata(active: boolean): UseMetadataReturn {
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null)
  const [online, setOnline]     = useState<boolean>(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (!active) return

    const poll = async () => {
      try {
        const data = await apiService.fetchMetadata()
        setMetadata(data)
        setOnline(true)
      } catch {
        setOnline(false)
      }
    }

    void poll()
    timerRef.current = setInterval(poll, POLL.metadata)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [active])

  return { metadata, online }
}
