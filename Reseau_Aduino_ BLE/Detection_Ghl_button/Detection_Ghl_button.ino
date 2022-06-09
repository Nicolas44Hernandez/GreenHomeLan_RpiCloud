//com9
#include <ArduinoBLE.h>
BLEService detectionService("25a23d8d-d15d-4d14-b474-b101ef55afe6");
BLEByteCharacteristic detectionCharacteristic("25a23d8d-d15d-4d14-b474-b101ef55afe6", BLERead | BLEWrite);
const int buttonPin = 4;
boolean up = false;

void setup() {
  Serial.begin(9600);
  while (!Serial);
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");
    while (1);
  }
  pinMode(buttonPin, INPUT);
  BLE.setLocalName("Detection_Button");
  BLE.setAdvertisedService(detectionService);
  detectionService.addCharacteristic(detectionCharacteristic);
  BLE.addService(detectionService);
  detectionCharacteristic.writeValue(0);
  BLE.advertise();
  Serial.println("Detection Peripheral");
}

void loop() {
  BLE.poll();
  detectFront();
  /*   
  BLEDevice central = BLE.central();
  if (central) {
    Serial.print("Connected to central: ");
    Serial.println(central.address());
    while (central.connected()) {
      detectFront();
    }
    Serial.print(F("Disconnected from central: "));
    Serial.println(central.address());
  }*/
}

void detectFront(){
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
