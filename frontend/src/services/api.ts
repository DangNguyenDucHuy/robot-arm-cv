import { API } from '@/config/env'
import type { KeypointsResponse, MetadataResponse, StreamStartResponse } from '@/types'

async function apiFetch<T>(url: string, label: string, option?: RequestInit): Promise<T> {
	console.log(`URL: ${url}, Option:`, option)
	const res = await fetch(url, { cache: 'no-store', ...option })
	if (!res.ok) throw new Error(`[${label}] HTTP ${res.status}`)
	return res.json() as Promise<T>
}

export const apiService = {
	fetchKeypoints: () => apiFetch<KeypointsResponse>(API.keypoints, 'keypoints'),
	fetchMetadata: () => apiFetch<MetadataResponse>(API.metadata, 'metadata'),
	startStream: (cameraUrl: string) => apiFetch<StreamStartResponse>(
		API.startStream(cameraUrl), 
		'start',
		{ method: 'POST' }
	),
	stopStream: () => apiFetch<StreamStartResponse>(
		API.stopStream(), 
		'stop',
		{ method: 'POST' }
	),
	stream: () => API.stream(),
}
