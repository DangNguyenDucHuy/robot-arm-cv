# 🤖 Robot Arm CV

## 🌟 Project Title & Description

**Project Name:** Robot Arm CV

This project provides a comprehensive solution for controlling a robotic arm using computer vision. It leverages real-time keypoint detection (pose estimation) on human's arm to guide the robotic arm's movements, enabling it to interact with its environment based on visual input. The system aims to automate tasks requiring precise manipulation and visual feedback.

## 🚀 Demo

_Demo video coming soon_

## ✨ Features

+ **Real-time Pose Estimation:** Utilizes state-of-the-art YOLO models (e.g., YOLOv26n) for accurate and fast detection of objects and keypoints.
+ **Robotic Arm Control:** Interface with a robotic arm via serial communication to execute movements based on computer vision analysis.
+ **Live Video Stream Processing:** Processes video streams in real-time for continuous visual feedback and control.
+ **Web-based Dashboard:** A user-friendly frontend built with Next.js and React for monitoring the stream, keypoints, and controlling the robotic arm.
+ **Scalable Backend:** A FastAPI backend handles vision processing, robotic arm commands, and serves the frontend data.

## 🛠️ Tech Stack

**Frontend:**
+ **Framework:** Next.js
+ **Library:** React
+ **Styling:** Tailwind CSS
+ **Language:** TypeScript
+ **Runtime:** Node.js (v20)

**Backend:**
+ **Framework:** FastAPI
+ **Computer Vision:** OpenCV, Ultralytics (YOLO)
+ **Serial Communication:** PySerial
+ **Web Server:** Uvicorn
+ **Language:** Python (v3.13)

**Containerization:**
+ Docker

## ⚙️ Installation & Setup

To run this project locally, follow these steps:

### Prerequisites

Make sure you have the following installed:

+ **Node.js**: v20 or higher
+ **Python**: v3.13 or higher
+ **Docker** (optional, for containerized deployment)
+ `uv` (Python package installer, used in Dockerfile)
+ And some hardware stuff I listed below

### Hardware Setup

1.  **ESP32-CAM** (AI Thinker, OV2640)
+ Update Wifi information (SSID & Password) in the ESP32 code (at `hardware/esp32_cam/esp32_cam.ino`).
+ Plug ESP32 to your laptop and upload the code.
+ Check the Serial Monitor, you'll find its IP address.
+ Optional, unplug the ESP32 and use external power.
2.  **Robot Arm** (4 servos) controlled by Arduino Uno
+ Plug the Arduino Uno, or MCU used to control your robot, to your laptop.
+ Edit the following fields in `.env` based on your setup:
    + `MCU_NAME`: Name of the Arduino (e.g., 'Arduino Uno' - optional).
    + `SERIAL_PORT`: The serial port your Arduino is connected to (e.g., 'COM7' on Windows, '/dev/ttyUSB0' on Linux).
    + `BAUD_RATE`: The baud rate, which must match the `Serial.begin()` setting in your Arduino code, as my code in `hardware/arduino_robot_arm/` using `BAUD_RATE=9600`
+ Ensure the Arduino IDE's Serial Monitor is closed to avoid port conflicts.

_Note: I use Arduino IDE to upload the `hardware/` code_

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/DangNguyenDucHuy/robot-arm-cv.git
    cd robot-arm-cv/backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv .venv
    # On Windows
    .venv\Scripts\activate
    # On macOS/Linux
    source .venv/bin/activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Environment Variables:**
    Copy the example environment file and update it with your settings:
    ```bash
    cp .env.example .env
    ```
    Review and modify `backend/app/core/config.py` for any additional configurations, such as serial port settings and model paths.

5.  **Run the backend server:**
    ```bash
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ```


### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application should now be accessible at `http://localhost:3000` (or similar).

### Docker Deployment (Optional)

For containerized deployment, navigate to the respective `backend` or `frontend` directories and use Docker:

1.  **Build and run backend:**
    ```bash
    cd backend
    docker build -t robot-arm-cv-backend .
    docker run -p 8000:8000 robot-arm-cv-backend
    ```
2.  **Build and run frontend (using docker-compose for Nginx setup):**
    ```bash
    cd frontend
    docker-compose up --build
    ```

## 🏃 Usage

This section details how to use the Robot Arm CV system after installation and setup, including the interaction between different modules.

### Overall Flow

1.  **Start the Backend Server:** Ensure the backend is running as described in the "Backend Setup" section.
2.  **Start the Frontend Application:** Ensure the frontend is running as described in the "Frontend Setup" section.
3.  **Access the Web Interface:** Open your web browser and navigate to the frontend URL (e.g., `http://localhost:3000`).
4.  **Control the Robotic Arm:** Use the controls provided in the web interface to interact with the robotic arm and view the live computer vision feed.

### Module-Specific Usage

#### 1. MCU (Microcontroller Unit)
+ **Flow:** `backend/app/services/video_service.py` (ESP32-CAM stream) --> `backend/app/services/predict_service.py` (predict servos' values) --> `backend/app/api/serial_api.py` (send values to Arduino Uno).
+ **Camera:** The system retrieves a live video stream from the ESP32-CAM.
+ **Servo Controller:** Commands are sent to the Arduino Uno via serial communication to control the four servos of the robot arm. The serial port connection is managed by `pyserial`.

#### 2. Model (Computer Vision Processing)
+ **Purpose:** Provides classes and utilities for all computer vision models used in the project, including pose estimation and hand gesture classification.
+ **Main Features:**
    + `predict()`: Returns prediction results (e.g., keypoints, classifications).
    + `draw()`: Returns both prediction data and an annotated image with predictions drawn on it.
+ **Implemented Models:**
    + **MediaPipe:** Pose Keypoints (pretrained MediaPipe Pose), Hand Keypoints (pretrained MediaPipe Hand).
    + **MobileNet:** Hand Classification (finetuned MobileNetV3).
    + **MoveNet:** Pose Keypoints (pretrained MoveNet).
    + **ResNet:** Hand Classification (finetuned ResNet18).
    + **YOLO:** Pose Keypoints (finetuned YOLOv26n pose)

_Note: ALl models listed were experimented in another repository of mine [1], then I chose YOLO for final production_

#### 3. Data Collector
+ **Video Recorder:**
    + Define classes for gesture classification.
    + Record videos for each class using the ESP32 stream.
    + Save videos, and individual frames as images, within class-named folders (e.g., `{class_name}/raw/`).
+ **Autolabeling:**
    + Utilizes a combination of Pose and Hand models.
    + **Layer 1 (Arm Keypoints):** Images are processed by a Pose model to predict arm keypoints (shoulder, elbow, wrist, etc.), including their x, y, and visibility features.
    + **Layer 2 (Hand Region Cropping):** Hand-related keypoints (e.g., wrist) are used to crop the hand region from the image, often with padding, to prepare for hand keypoint detection.
    + **Layer 3 (Finger Tip Keypoints):** The cropped hand images are processed by a Hand model to predict finger tip keypoints (thumb, index, middle, ring, pinky).
    + **Output:** At least 8 keypoints (shoulder, elbow, wrist, thumb, index, middle, ring, pinky) with normalized x, y, and visibility features are saved as `.csv` files in `{class_name}/autolabeled/`.

_Note: This was also implemented in [1]_

## 📂 Project Structure

```
robot-arm-cv/
├── backend/
│   ├── Dockerfile
│   ├── main.py
│   ├── pyproject.toml
│   ├── README.md
│   ├── app/
│   │   ├── api/             # API endpoints (e.g., serial communication)
│   │   ├── core/            # Core configurations
│   │   ├── routers/         # API routers (health checks, stream)
│   │   └── services/        # Business logic for drawing, prediction, video
│   └── models/              # Pre-trained and fine-tuned YOLO models
├── frontend/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── package.json
│   ├── README.md
│   └── src/
│       ├── app/            # Next.js pages and root layout
│       ├── components/     # Reusable UI components (controls, layout, stream)
│       ├── config/         # Frontend configurations
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utility functions
│       ├── services/       # API communication services
│       └── types/          # TypeScript type definitions
├── hardware/
│   ├── esp32_cam           # ESP32-CAM code
│   ├── arduino_robot_arm   # Arduino Robot Arm code 
├── LICENSE.md
└── README.md
```

## 📝 API Documentation

The backend API is built with FastAPI. Key endpoints include:

+ `/health`: Health check endpoint.
+ `/stream`: WebSocket endpoint for video stream and keypoint data.
+ `/api/serial`: Endpoints for serial communication with the robotic arm.

## 🗺️ Roadmap / Future Improvements

+ Model
    + Implement tracking algorithms for better keypoint tracking.
    + Collect more diverse data of 8 keypoints on arm (shoulder, elbow, wrist and 5 fingertips).
    + Experiment specific architecture for this task.
    + Optimize model for CPU on Laptop, then for edge device in the future.
+ UI
    + Save the videos (or paths), so that robot can repeat the action later.
    + Add user authentication and personalization features.
+ Hardware
    + Support more hardware. 
    + Separate Robot Arm from laptop (by leveraging WiFi, Bluetooth, MQTT, ...)
+ Others
  + Improve error handling and logging.

## 🤝 Contributing

I appreciate ideas and contributions to the Robot Arm CV project! To contribute, just create a pull request and I'll check it.

## 📄 License

This project is licensed under the [MIT License](LICENSE.md). 

## 📧 Contact / Author

+ **Name:** Dang Nguyen Duc Huy (D. Huy)
+ **GitHub:** [DangNguyenDucHuy](https://github.com/DangNguyenDucHuy)
+ **Email:** dangnguyenduchuy@gmail.com

## Reference 
[1] [Github Repo - Robot Arm control](https://github.com/HyuOniichan/robot-arm-control)
[2] 
