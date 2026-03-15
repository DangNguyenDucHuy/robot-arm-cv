'use client'

import { useState, useEffect, useRef } from 'react'
import type { Keypoint } from '@/types'
import { apiService } from '@/services/api'
import { POLL } from '@/config/env'

interface UseKeypointsReturn {
	keypoints: Keypoint[]
	fps: number
	online: boolean
}

export function useKeypoints(active: boolean, aiMode: boolean): UseKeypointsReturn {
	const [keypoints, setKeypoints] = useState<Keypoint[]>([])
	const [fps, setFps] = useState<number>(0)
	const [online, setOnline] = useState<boolean>(true)
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

	useEffect(() => {
		if (timerRef.current) clearInterval(timerRef.current)

		if (!active || !aiMode) {
			setKeypoints([])
			return
		}

		const poll = async () => {
			try {
				const data = await apiService.fetchKeypoints()
				
				setKeypoints(data.keypoints)
				setFps(data.fps)
				setOnline(true)
			} catch {
				setKeypoints([])
				setOnline(false)
			}
		}

		void poll()
		timerRef.current = setInterval(poll, POLL.keypoints)
		return () => { if (timerRef.current) clearInterval(timerRef.current) }
	}, [active, aiMode])

	return { keypoints, fps, online }
}
