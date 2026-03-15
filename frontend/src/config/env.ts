export const ENV = {
	backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000',
} as const

export const API = {
	startStream: (url: string) => `${ENV.backendUrl}/stream/start?url=${encodeURIComponent(url)}`,
	stopStream: () => `${ENV.backendUrl}/stream/stop`,
	stream: () => `${ENV.backendUrl}/stream`,
	keypoints: `${ENV.backendUrl}/keypoints`,
	metadata: `${ENV.backendUrl}/metadata`,
} as const

export const POLL = {
	keypoints: 200,    // ms 
	metadata: 1000,  // ms
	retry: 5000,  // ms — backend offline retry
} as const

export const CANVAS = {
	dotRadius: 5,
	dotColor: '#00d98e',
	glowColor: 'rgba(0,217,142,0.4)',
	boneColor: 'rgba(255,107,26,0.55)',
	boneWidth: 1.5,
} as const

/**
 * Hand skeleton bone pairs — indices into keypoints array.
 * Adjust to match your model's keypoint ordering.
 */
export const BONE_PAIRS: [number, number][] = [
	[0, 1], [1, 2], [2, 3], [3, 4],
	[0, 5], [5, 6], [6, 7], [7, 8],
	[0, 9], [9, 10], [10, 11], [11, 12],
	[0, 13], [13, 14], [14, 15], [15, 16],
	[0, 17], [17, 18], [18, 19], [19, 20],
]
