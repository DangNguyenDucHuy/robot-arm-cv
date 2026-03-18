import time
import cv2
from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse

from app.services.video_service import video_service

router = APIRouter()


def mjpeg_generator():
    try:
        while True:
            with video_service.lock:
                frame = (
                    video_service.annotated.copy()
                    if video_service.annotated is not None
                    else video_service.frame.copy() if video_service.frame is not None else None
                )
            
            if frame is None:
                # Debug
                print("Frame failed")
                time.sleep(0.01)
                continue


            success, buffer = cv2.imencode(".jpg", frame)

            if not success:
                # Debug
                print("Encoding failed")
                continue

            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" +
                buffer.tobytes() +
                b"\r\n"
            )
            
            # Limit FPS to save CPUs...
            time.sleep(0.03)
            
    except GeneratorExit:
        print("Client disconnected")


@router.get("/stream")
def stream():
    return StreamingResponse(
        mjpeg_generator(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


@router.post("/stream/start")
def start_stream(url: str = Query(...)):
    if not video_service.running:
        # Start video
        video_service.start(url)

    return {
        "status": "connected",
        "source": video_service.stream_url
    }


@router.post("/stream/stop")
def stop_stream():
    # Stop capturing
    video_service.stop()
    
    return {
        "status": "idle",
        "source": ""
    }


@router.get("/keypoints")
def keypoints():
    with video_service.lock:
        frame = video_service.frame.copy() if video_service.frame is not None else None
        keypoints = video_service.keypoints
    
    # Post-process keypoints
    ret_kps = []
    
    if frame is not None and keypoints is not None:
        # Denormalize
        height, width, _ = frame.shape

        # Format
        ret_kps = [
            { "x": x * width, "y": y * height, "v": v } 
            for x, y, v in keypoints
        ]
    
    return {
        "timestamp": time.time(),
        "fps": video_service.fps,
        "keypoints": ret_kps
    }


@router.get("/metadata")
def metadata():
    return {
        "fps": video_service.fps,
        "camera_status": video_service.camera_status,
        "source": "esp32"
    }
