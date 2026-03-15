from typing import List
import cv2

def draw_keypoints(frame, keypoints: List[List[float]]):
    height, width, _ = frame.shape
    
    for kp in keypoints:
        if len(kp) < 2:
            continue
        
        # Denormalize
        cx = int(kp[0] * width)
        cy = int(kp[1] * height)
        
        cv2.circle(frame, (cx, cy), 3, (0,255,0), -1)
    
    return frame
