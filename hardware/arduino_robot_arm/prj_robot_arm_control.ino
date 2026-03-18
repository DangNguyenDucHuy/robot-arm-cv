#include <ServoEasing.hpp>
// Grip
ServoEasing servo_1; 
int servoPin1 = 3; 
int gripAngle = 130;

// Elbow
ServoEasing servo_2; 
int servoPin2 = 6;
int elbowAngle = 20;

// Shoulder
ServoEasing servo_3; 
int servoPin3 = 5; 
int shoulderAngle = 140;

// Base
ServoEasing servo_4; 
int servoPin4 = 9; 
int baseAngle = 110;

String inputString = ""; 

int threshold = 10;
int degreePerSec = 45;

void setup() {
  Serial.begin(9600);

  servo_1.attach(servoPin1, gripAngle); 
  servo_2.attach(servoPin2, elbowAngle); 
  servo_3.attach(servoPin3, shoulderAngle); 
  servo_4.attach(servoPin4, baseAngle); 

  servo_1.setSpeed(degreePerSec); 
  servo_2.setSpeed(degreePerSec); 
  servo_3.setSpeed(degreePerSec); 
  servo_4.setSpeed(degreePerSec); 
}

void loop() {
  if (Serial.available()) {
    inputString = Serial.readStringUntil('\n');
    inputString.trim();

    // Debug
    Serial.print("Received: ");
    Serial.println(inputString);

    // Expect format: "<base>;<shoulder>;<elbow>;<grip>"
    int firstSep = inputString.indexOf(';');
    int secondSep = inputString.indexOf(';', firstSep + 1);
    int thirdSep = inputString.indexOf(';', secondSep + 1);

    if (firstSep > 0 && secondSep > firstSep && thirdSep > secondSep) {
      int newBaseAngle  = inputString.substring(0, firstSep).toInt();
      int newShoulderAngle = inputString.substring(firstSep + 1, secondSep).toInt();
      int newElbowAngle  = inputString.substring(secondSep + 1, thirdSep).toInt();
      int newGripAngle  = inputString.substring(thirdSep + 1).toInt();

      if (isOverThreshold(baseAngle, newBaseAngle)) {
        baseAngle = constrain(newBaseAngle, 15, 165);
        servo_4.startEaseTo(baseAngle);
      }
      if (isOverThreshold(shoulderAngle, newShoulderAngle)) {
        shoulderAngle = constrain(newShoulderAngle, 0, 180);
        servo_3.startEaseTo(shoulderAngle);
      }
      if (isOverThreshold(elbowAngle, newElbowAngle)) {
        elbowAngle = constrain(newElbowAngle, 0, 180);
        servo_2.startEaseTo(elbowAngle);
      }
      if (isOverThreshold(gripAngle, newGripAngle)) {
        gripAngle = constrain(newGripAngle, 110, 150);
        servo_1.startEaseTo(gripAngle);
      }
    }
  }
}

bool isOverThreshold(int a, int b) {
  return (abs(a - b) > threshold);
}
