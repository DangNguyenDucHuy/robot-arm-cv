import cv2
import time
import threading

from app.services.predict_service import PredictService
from app.services.draw_service import draw_keypoints

class VideoService:
    def __init__(self):
        self.cap = None
        self.stream_url = None

        self.predictor = PredictService()

        self.frame = None
        self.annotated = None
        self.keypoints = None
        
        self.predict_interval = 10

        self.fps = 0
        self.camera_status = "disconnected"
        
        self.running = False
        
        self.thread = None

    
    def start(self, url):
        # Clean up
        self.stop()
        
        # Time for ESP32 connect
        time.sleep(0.5)
        
        # Hardcode for ESP32-CAM stream url (IP address only)
        self.stream_url = f"http://{url}:81/stream"

        self.cap = cv2.VideoCapture(self.stream_url, cv2.CAP_FFMPEG)

        self.running = True
        self.thread = threading.Thread(target=self.update, daemon=True)
        self.thread.start()

    
    def update(self):
        prev = time.perf_counter()
        
        frame_count = 0

        while self.running:
            if self.cap is None:
                time.sleep(0.1)
                continue
            
            ret, frame = self.cap.read()

            if not ret:
                # Debug
                print("Frame read:", ret)
                self.camera_status = "disconnected"
                time.sleep(0.1)
                continue
            
            frame_count += 1

            self.camera_status = "connected"
            self.frame = frame
            self.annotated = frame
            
            # Predict every N frames
            if frame_count % self.predict_interval == 0:
                # Debug
                start_time = time.time()
                
                keypoints = self.predictor.predict(frame)
                annotated = draw_keypoints(frame.copy(), keypoints)
                
                self.keypoints = keypoints
                self.annotated = annotated

                # Debug
                print("Predicted keypoints:", keypoints)
                print("Latency:", time.time() - start_time)

            now = time.perf_counter()
            self.fps = 1 / (now - prev)
            prev = now
    
    
    def stop(self):
        self.running = False
        
        if self.thread and self.thread.is_alive():
            self.thread.join()
        
        if self.cap:
            self.cap.release()
            self.cap = None

        self.camera_status = "disconnected"



video_service = VideoService()
