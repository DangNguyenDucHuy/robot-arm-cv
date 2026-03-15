'use client'

import { useState, useCallback } from 'react'
import type { ConnectionStatus, StreamMode } from '@/types'
import { apiService } from '@/services/api'

export interface UseStreamReturn {
	url: string
	setUrl: (v: string) => void
	active: boolean
	mode: StreamMode
	setMode: (m: StreamMode) => void
	status: ConnectionStatus
	activeSrc: string
	start: () => void
	stop: () => void
	onLoad: () => void
	onError: () => void
}

export function useStream(): UseStreamReturn {
	const [url, setUrl] = useState<string>('')
	const [active, setActive] = useState<boolean>(false)
	const [mode, setMode] = useState<StreamMode>('raw')
	const [status, setStatus] = useState<ConnectionStatus>('idle')
	const [activeSrc, setSrc] = useState<string>('')

	const start = useCallback(async () => {
		if (!url.trim()) return
		setStatus('connecting')

		const streamUrl = await apiService.startStream(url.trim())
		console.log("Setting stream src:", streamUrl)

		setSrc(apiService.stream())
		setActive(true)
	}, [url])

	const stop = useCallback(async () => {
		await apiService.stopStream()

		setActive(false)
		setStatus('idle')
		setSrc('')
	}, [])

	const onLoad = useCallback(() => setStatus('connected'), [])
	const onError = useCallback(() => setStatus('error'), [])

	return { url, setUrl, active, mode, setMode, status, activeSrc, start, stop, onLoad, onError }
}
