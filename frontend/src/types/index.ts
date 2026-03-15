// --- Keypoints ---

export interface Keypoint {
	/** X coordinate in pixels (relative to stream frame) */
	x: number
	/** Y coordinate in pixels (relative to stream frame) */
	y: number
	/** Visibility: 0 = not detected, 1 = detected */
	v: number
}

export interface KeypointsResponse {
	timestamp: number
	fps: number
	keypoints: Keypoint[]
}

// --- Metadata ---

export type CameraStatus = 'connected' | 'disconnected' | 'fallback'
export type CameraSource = 'esp32' | 'webcam' | 'unknown'

export interface MetadataResponse {
	fps: number
	camera_status: CameraStatus
	source: CameraSource
}

// --- Stream ---

export type StreamMode = 'raw' | 'ai'

export type ConnectionStatus =
	| 'idle'
	| 'connecting'
	| 'connected'
	| 'error'
	| 'fallback'

export interface StreamStartResponse {
	status: ConnectionStatus
	source: string
}

// --- UI ---

export interface StreamState {
	url: string
	active: boolean
	mode: StreamMode
	status: ConnectionStatus
	activeSrc: string
}
