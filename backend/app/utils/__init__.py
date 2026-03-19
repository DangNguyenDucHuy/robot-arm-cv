import numpy as np
from typing import List, Tuple

from app.core.config import SERVO_LIMIT

def normalize_angle(cur_angle: float, servo_limit: Tuple[int, int], prediction_limit: Tuple[int, int]) -> int:
    """
    Normalize current angle (with its limit) to servo's angle.
    Parameters:
        cur_angle (float): Current angle value.
        servo_limit (str): Limit of the servo.
        prediction_limit (str): Limit of prediction.
    Returns:
        normalized_angle (int): Normalized angle.
    """
    servo_lower, servo_upper = servo_limit
    cur_lower, cur_upper = prediction_limit
    
    # Return upperbound/lowerbound
    if cur_angle < cur_lower:
        return servo_lower
    elif cur_angle > cur_upper:
        return servo_upper

    # Handle mapping angle value
    normalized_ratio = (cur_angle - cur_lower) / (cur_upper - cur_lower)
    normalized_angle = normalized_ratio * (servo_upper - servo_lower) + servo_lower
    
    return int(normalized_angle)


def compute_arm_angles(keypoints: List[Tuple[float, float, float]]):
    """
    Compute 2 angles:  
    1. (bicep, y-axis): angle between shoulder-elbow and vertical line  
    2. (forearm, bicep): angle between shoulder-elbow and elbow-wrist
    
    Parameters:
        keypoints: List of position of shoulder, elbow and wrist
    """
    # Take position
    shoulder_pos = np.array(keypoints[0][:2])
    elbow_pos = np.array(keypoints[1][:2])
    wrist_pos = np.array(keypoints[2][:2])
    
    # Vectors
    y_vector = np.array([0, -1])
    bicep_vector = elbow_pos - shoulder_pos
    forearm_vector = wrist_pos - elbow_pos
    
    # Compute angle utility
    def angle_between(a, b):
        cos_theta = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
        cos_theta = np.clip(cos_theta, -1.0, 1.0)
        return np.degrees(np.arccos(cos_theta))

    angle_shoulder = angle_between(bicep_vector, y_vector)
    angle_elbow = angle_between(forearm_vector, bicep_vector)
    
    return angle_shoulder, angle_elbow


def compute_hand_grip(
    fingers_xyv: List[List[float]], 
    wrist_xyv: List[float], 
    elbow_xyv: List[float], 
    visibility_threshold: float = 0.5
) -> float:
    """
    Determine if the hand is open or closed.
    Parameters:
        fingers_xyv (list(list(float))): Positions (x,y,v) of 5 finger keypoints 
            (In order: thumb, index, middle, ring, pinky). Shape (5, 3).
        wrist_xyv (list(list(float))): Wrist (x, y, v). Shape (1, 3).
        elbow_xyv (list(list(float))): Elbow (x, y, v). Shape (1, 3).
        visibility_threshold (float): Visible threshold to recognize a finger.
    Returns:
        hand_distance: (Average of) Normalized distances from fingers to wrist.
    """
    # Remove thumber (may cause noise)
    fingers_xyv = fingers_xyv[1:]
    
    # Convert to numpy
    fingers_xyv = np.asarray(fingers_xyv)
    wrist_xyv = np.asarray(wrist_xyv)
    elbow_xyv = np.asarray(elbow_xyv)
    
    # Take visible fingers only
    is_visible = fingers_xyv[:,2] >= visibility_threshold
    visible_fingers = fingers_xyv[is_visible]

    # If less than 2 fingers detected -> Skip
    if len(visible_fingers) < 2:
        return None
    
    # Assume palm center = mean(fingers + wrist)
    points = np.vstack([visible_fingers[:, :2], wrist_xyv[:2]])
    palm_center = np.mean(points, axis=0)
    
    # Reference distance = distance(palm_center, wrist) 
    # for consider into z-axis (distance from hand to the camera) 
    ref_dist = np.linalg.norm(elbow_xyv[:2] - wrist_xyv[:2])
    
    if ref_dist == 0:
        return None
    
    # Check Euclidean distance from each finger to the palm center
    distances = np.linalg.norm(visible_fingers[:, :2] - palm_center, axis=1)
    
    # # Normalize distances
    # norm_dist = distances / ref_dist
    norm_dist = distances
    
    return np.mean(norm_dist)


def compute_base_direction(
    fingers_xyv: List[List[float]], 
    wrist_xyv: List[float], 
    current_angle: int,
    base_servo_limit: Tuple[int, int],
    visibility_threshold: float = 0.5,
    velocity: int = 5
) -> int:
    """
    Gradually move base servo left/right based on finger direction.
    """
    fingers_xyv = np.asarray(fingers_xyv)
    wrist_xyv = np.asarray(wrist_xyv)

    # Only visible fingers
    is_visible = fingers_xyv[:, 2] >= visibility_threshold
    visible_fingers = fingers_xyv[is_visible]

    # No fingers detected -> return to mid
    if len(visible_fingers) == 0:
        mid_angle = (base_servo_limit[0] + base_servo_limit[1]) // 2
        # Gradually move to mid
        if current_angle < mid_angle:
            return min(current_angle + velocity, mid_angle)
        else:
            return max(current_angle - velocity, mid_angle)

    # Compute left fingers
    finger_vectors = visible_fingers[:, :2] - wrist_xyv[:2]
    left_count = np.sum(finger_vectors[:, 0] < 0)

    # Move gradually
    if left_count >= 2:  # turn left
        return min(current_angle + velocity, base_servo_limit[1])
    else:  # turn right
        return max(current_angle - velocity, base_servo_limit[0])
