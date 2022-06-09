//com 11
#include <ArduinoBLE.h>
BLEService detectionService("25a23d8d-d15d-4d14-b474-b101ef55afe6");
BLEByteCharacteristic detectionCharacteristic("25a23d8d-d15d-4d14-b474-b101ef55afe6", BLERead | BLEWrite);
const int ledPin = 5;
const int buttonPin = 4;
boolean up = false;
const int latence = 900;

void setup() {
  Serial.begin(9600);
  while (!Serial);
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");
    while (1);
  }
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT);
  BLE.setLocalName("Detection_Web");
  BLE.setAdvertisedService(detectionService);
  detectionService.addCharacteristic(detectionCharacteristic);
  BLE.addService(detectionService);
  detectionCharacteristic.writeValue(0);
  BLE.advertise();
  Serial.println("Detection Peripheral");
}

void loop() {
  BLE.poll();
  //Serial.println("out_central");
  detectPress();
  detectChangeValue();
  /*
  BLEDevice central = BLE.central();
  if (central) {
    Serial.print("Connected to central: ");
    Serial.println(central.address());
    while (central.connected()) {
      detectPress();
      detectChangeValue();
    }
    Serial.print(F("Disconnected from central: "));
    Serial.println(central.address());
  }*/
}

void detectChangeValue(){
  if (detectionCharacteristic.written()) {
    if (detectionCharacteristic.value()) {   // any value other than 0
      detectionCharacteristic.writeValue((byte)0x00);
      Serial.println("LED on");
      digitalWrite(ledPin, HIGH);         // will turn the LED on
      delay(latence);
      Serial.println(F("LED off"));
      digitalWrite(ledPin, LOW);          // will turn the LED off
    }
  }
}

void detectPress(){
  char buttonValue = digitalRead(buttonPin);
  if(buttonValue == 1 && !up){
    byte value = 0;
    detectionCharacteristic.writeValue((byte)0x01);
    Serial.println("changeValue");
    detectionCharacteristic.readValue(value);
    Serial.println(value);
    up = true;
  }
  if(buttonValue == 0 && up){
    up = false;
  }
}
