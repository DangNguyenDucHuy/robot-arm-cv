import cv2
import time
import threading
import queue

from app.services.predict_service import PredictService
from app.services.draw_service import draw_keypoints
from app.api.serial_api import mcu_servo_controller

class VideoService:
    def __init__(self):
        self.cap = None
        self.stream_url = None

        self.predictor = PredictService()

        self.frame = None
        self.annotated = None
        self.keypoints = None
        
        self.predict_interval = 5

        self.fps = 0
        self.camera_status = "disconnected"
        
        self.running = False
        
        # Run 3 threads: Capture video, Predict and Send data to control the robot
        self.capture_thread = None
        self.predict_thread = None
        self.control_thread = None
        
        self.lock = threading.Lock()

        # Queues
        self.frame_queue = queue.Queue(maxsize=1)
        self.result_queue = queue.Queue(maxsize=1)
        
    
    # --- Signal ---
    
    def start(self, url):
        # Clean up
        self.stop()
        
        # Time for ESP32 connect
        time.sleep(0.5)
        
        # Hardcode for ESP32-CAM stream url (IP address only)
        self.stream_url = f"http://{url}:81/stream"

        self.cap = cv2.VideoCapture(self.stream_url, cv2.CAP_FFMPEG)

        self.running = True
        
        # Open serial to the Robot arm
        mcu_servo_controller.open_serial_port()
        
        # Threads
        self.capture_thread = threading.Thread(target=self.capture_loop, daemon=True)
        self.predict_thread = threading.Thread(target=self.predict_loop, daemon=True)
        self.control_thread = threading.Thread(target=self.control_loop, daemon=True)

        self.capture_thread.start()
        self.predict_thread.start()
        self.control_thread.start()

    
    def stop(self):
        self.running = False
        time.sleep(0.1)
        
        for t in [self.capture_thread, self.predict_thread, self.control_thread]:
            if t and t.is_alive():
                t.join(timeout=1)

        if self.cap:
            self.cap.release()
            self.cap = None
        
        mcu_servo_controller.close_serial_port()

        self.camera_status = "disconnected"
    
    
    # --- Threads ---

    def capture_loop(self):
        prev = time.perf_counter()

        while self.running:
            if not self.cap or not self.cap.isOpened():
                time.sleep(0.1)
                continue

            ret, frame = self.cap.read()

            if not ret:
                print("Frame read failed")
                self.camera_status = "disconnected"

                self.cap.release()
                time.sleep(1)
                self.cap = cv2.VideoCapture(self.stream_url, cv2.CAP_FFMPEG)
                continue

            self.camera_status = "connected"

            # Keep latest frame only
            if not self.frame_queue.empty():
                try:
                    self.frame_queue.get_nowait()
                except queue.Empty:
                    pass

            self.frame_queue.put(frame)

            with self.lock:
                self.frame = frame

            # FPS calc
            now = time.perf_counter()
            dt = now - prev
            self.fps = 0.9 * self.fps + 0.1 * (1 / dt) if self.fps else (1 / dt)
            prev = now

    def predict_loop(self):
        while self.running:
            try:
                frame = self.frame_queue.get(timeout=1)
            except queue.Empty:
                continue

            keypoints = self.predictor.predict_both(frame)
            annotated = draw_keypoints(frame.copy(), keypoints)
            
            if keypoints is None or len(keypoints) == 0:
                continue

            if not self.result_queue.empty():
                try:
                    self.result_queue.get_nowait()
                except queue.Empty:
                    pass

            self.result_queue.put(keypoints)

            with self.lock:
                self.keypoints = keypoints
                self.annotated = annotated
            
    
    def control_loop(self):
        last_send = 0
        interval = 0.1  # limit rate (10 Hz)
        
        # Wait Arduino reset
        time.sleep(2)

        while self.running:
            try:
                keypoints = self.result_queue.get(timeout=1)
            except queue.Empty:
                continue

            now = time.time()
            if now - last_send < interval:
                continue

            mcu_servo_controller.send_predictions(keypoints)
            last_send = now 



video_service = VideoService()
