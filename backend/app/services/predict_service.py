import numpy as np
from typing import List

from ultralytics import YOLO

from app.core.config import POSE_MODEL_PATH, HAND_MODEL_PATH

DEVICE = 'cpu'
IMAGE_SIZE = 640
CONFIDENT_THRESHOLD = 0.3


class PredictService():
    def __init__(self):
        self.pose_model = YOLO(POSE_MODEL_PATH)
        self.hand_model = YOLO(HAND_MODEL_PATH)
    

    def detect_keypoints(self, model, image) -> List[List[float]]:
        """
        Detect keypoints on the image.
        """
        results = model(
            image, 
            device=DEVICE,
            imgsz=IMAGE_SIZE,
            conf=CONFIDENT_THRESHOLD,
            verbose=False,
            stream=True
        )
        
        keypoints = []
        
        for result in results:
            if result.keypoints is not None:
                keypoints_xyv = result.keypoints.data
                
                if keypoints_xyv.shape[0] > 0:
                    keypoints = keypoints_xyv[0].cpu().numpy().tolist()
                        
                    # Normalize
                    height, width, _ = image.shape
                    for idx in range(len(keypoints)):
                        keypoints[idx][0] /= width
                        keypoints[idx][1] /= height
        
        return keypoints


    def crop_region(self, image, keypoints: List[List[float]], padding: int = 100):
        """
        Crop specific region, based on the predicted keypoints.
        """
        # Fallback: Previous prediction failed
        if len(keypoints) == 0:
            return image

        # Take position (x, y) of each keypoints
        keypoints = np.array(keypoints)
        keypoints = keypoints[:, :2]
        
        # Load image
        height, width, _ = image.shape
        
        # Corners
        x_max = np.max(keypoints[:, 0])
        x_min = np.min(keypoints[:, 0])
        y_max = np.max(keypoints[:, 1])
        y_min = np.min(keypoints[:, 1])
        
        # Check bounds (can remove for predict points that out of frame)
        x_max = min(x_max, 1)
        x_min = max(x_min, 0)
        y_max = min(y_max, 1)
        y_min = max(y_min, 0)
        
        # Denormalize
        x_max *= width
        x_min *= width
        y_max *= height
        y_min *= height

        # Add padding
        x_max = int(min(x_max + padding, width))
        x_min = int(max(x_min - padding, 0))
        y_max = int(min(y_max + padding, height))
        y_min = int(max(y_min - padding, 0))
        
        # Crop
        cropped_img = image[y_min:y_max, x_min:x_max]
        
        # Fallback: If size (height/width) = 0 (crop failed)
        if cropped_img.shape[0] == 0 or cropped_img.shape[1] == 0:
            return image
        
        return cropped_img


    def predict(self, image):
        """
        Run inference on an image to detect keypoints.  
        Keypoints: Arm (shoulder, elbow, wrist) and Hand (5 fingertips).  
        Desired shape: [8, 3].  
        
        Params:
            image: Shape (height, width, 3)

        Returns:
            keypoints (list(list(float))): List of keypoints (x, y, visibility).
        """
        # Predict arm using pose model (shoulder, elbow, wrist)
        keypoints = self.detect_keypoints(self.pose_model, image)
        
        # Take the wrist position
        wrist_xy = []
        if len(keypoints) >= 3:
            if len(keypoints[2]) >= 2:
                wrist_xy = [keypoints[2][:2]]
        
        # Only predict hand if wrist detected
        hand_kps = []
        if len(wrist_xy) > 0:
            # Crop hand region
            cropped_image = self.crop_region(image, wrist_xy)
            
            # Predict hand using hand model (5 fingers)
            hand_kps = self.detect_keypoints(self.hand_model, cropped_image)
            keypoints.extend(hand_kps)
        
        return keypoints
