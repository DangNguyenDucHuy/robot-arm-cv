import time
import serial
import threading
from typing import TypedDict

from app.core.config import MCU, SERIAL_PORT, BAUD_RATE, SERVO_LIMIT, PREDICTION_LIMIT
from app.utils import normalize_angle, compute_arm_angles, compute_hand_grip, compute_base_direction

class MessageType(TypedDict):
    base: float 
    shoulder: float
    elbow: float
    grip: float


class McuServoController():
    def __init__(self):
        self.mcu_name = MCU
        self.serial_port = SERIAL_PORT
        self.baud_rate = BAUD_RATE
        self.servo_limit = SERVO_LIMIT
        self.prediction_limit = PREDICTION_LIMIT
        
        self.message: MessageType = {
            'base': 90.0, 
            'shoulder': 90.0,
            'elbow': 90.0,
            'grip': 90.0
        }
        
        self.mcu = None
        
        self.lock = threading.Lock()


    def open_serial_port(self):
        """
        Open Serial port to defined MCU
        """
        with self.lock:
            # Already open
            if self.mcu and self.mcu.is_open:
                return
            
            try:
                self.mcu = serial.Serial(self.serial_port, self.baud_rate, timeout=1)
                time.sleep(2)
                
                # Debug
                # print(f"[Info] Connected to {self.mcu_name} on {self.serial_port} at {self.baud_rate} baud.")
            except serial.SerialException as e:
                print(f"[Error] Failed to connect to {self.mcu_name} on {self.serial_port}: {e}")
    
    
    def close_serial_port(self):
        """
        Close serial port to current MCU
        """
        with self.lock:
            if self.mcu:
                self.mcu.close()
                print(f"[Info] Close connection to {self.mcu_name} on {self.serial_port}.")
            else:
                print(f"[Info] Connection to {self.mcu_name} on {self.serial_port} hasn't been opened yet.")
    
        
    def send_message(self):
        """
        Send message (4 angle values) to MCU.
        """
        # Check if serial port opened
        if self.mcu and self.mcu.is_open:
            normalized_base = normalize_angle(self.message['base'], self.servo_limit['base'], self.prediction_limit['base'])
            normalized_shoulder = normalize_angle(self.message['shoulder'], self.servo_limit['shoulder'], self.prediction_limit['shoulder'])
            normalized_elbow = normalize_angle(self.message['elbow'], self.servo_limit['elbow'], self.prediction_limit['elbow'])
            normalized_grip = normalize_angle(self.message['grip'], self.servo_limit['grip'], self.prediction_limit['grip'])
            
            command = f"{normalized_base};{normalized_shoulder};{normalized_elbow};{normalized_grip}\n"
            
            # Control thread
            with self.lock:
                try:
                    self.mcu.write(command.encode('utf-8'))
                    self.mcu.flush()
                    
                    # Debug
                    print(f"[Info] Sent message to {self.mcu_name}: {command.strip()}")
                except serial.SerialException as e:
                    print(f"[Error] Failed to send message to {self.mcu_name}: {e}")
        else:
            # Debug
            print(f"[Error] {self.mcu_name} isn't connected")
    
    
    def read_message(self):
        """
        Read sent message.
        """
        if self.mcu and self.mcu.is_open:
            response = self.mcu.readline().decode().strip()
            if response:
                print(f"[Info] {self.mcu_name} says:", response)
            else:
                print("[Error] No data received from Arduino.")
    
    
    def send_predictions(self, keypoints):
        """
        Send predicted keypoints.
        In order: shoulder, elbow, wrist, thumb, index, middle, ring, pinky

        Parameters:
            keypoints: Predicted keypoints, shape [8, 3].
        """
        # Gate
        if len(keypoints) < 8:
            # Debug
            print(f"Keypoints length: {len(keypoints)}")
            return
        
        # Arm angle
        shoulder_angle, elbow_angle = compute_arm_angles(keypoints[:3])
        
        # Grip angle
        grip_angle = compute_hand_grip(keypoints[3:8], keypoints[2], keypoints[1])

        # Base angle
        base_angle = compute_base_direction(
            keypoints[3:8], keypoints[2],
            current_angle=self.message['base'],
            base_servo_limit=SERVO_LIMIT['base']
        )
        
        # Update message
        self.message['shoulder'] = shoulder_angle
        self.message['elbow'] = elbow_angle
        self.message['grip'] = grip_angle
        self.message['base'] = base_angle
        
        # Send message
        self.send_message()
        
        

mcu_servo_controller = McuServoController()

