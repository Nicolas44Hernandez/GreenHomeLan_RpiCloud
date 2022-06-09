//com 10
#include <ArduinoBLE.h>

//Defining time interval and number of devices
#define BLE_MAX_PERIPHERALS 2
#define BLE_SCAN_INTERVALL 1000
#define BLE_SCAN_new_devices 1000


// BLE variables
BLEDevice peripherals[BLE_MAX_PERIPHERALS];
BLECharacteristic positionCharacteristics[BLE_MAX_PERIPHERALS];

// variables 
uint16_t position[BLE_MAX_PERIPHERALS];
bool peripheralsConnected[BLE_MAX_PERIPHERALS] = { 0 };
bool peripheralsToConnect[BLE_MAX_PERIPHERALS] = { 0 };
bool ok = true; 
int peripheralCounter = 0;
bool vOut = false;
const int ledPin_button = 4;
const int ledPin_web = 5;
const int latence = 900;

//Time variable
unsigned long control_time;


void setup() {
  Serial.begin(9600);
  while (!Serial);
  
  // initialize the BLE hardware
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");
    while (1);
  }
  Serial.println("BLE started");
  peripheralCounter = 0;
  pinMode(ledPin_button, OUTPUT);
  pinMode(ledPin_web, OUTPUT);
}

void loop() {
    // start scanning for peripherals
  BLE.scanForUuid("25a23d8d-d15d-4d14-b474-b101ef55afe6");
  Serial.println("Scan ongoing");
  unsigned long startMillis = millis();

  //Until timeout or max devices found
  while (peripheralCounter < BLE_MAX_PERIPHERALS ) {
    BLEDevice peripheral = BLE.available();

    if ( peripheral ) {
      //If device has name of interest, is not already in the list to be connected or in the list of connected devices
      if ( peripheral.localName() == "Detection_Web" && !peripheralsToConnect[0] && !peripheralsConnected[0]) {
        peripherals[0] = peripheral;
        peripheralCounter++;
        peripheralsToConnect[0]=true;
      }
      if ( peripheral.localName() == "Detection_Button" && !peripheralsToConnect[1] && !peripheralsConnected[1]) {
        peripherals[1] = peripheral;
        peripheralCounter++;
        peripheralsToConnect[1]=true;
      }
    }
  }
  Serial.print("Device found: ");
  Serial.println(peripheralCounter);
  BLE.stopScan();

  //Connecting to all devices found which are not already connected
  for ( int i = 0; i < BLE_MAX_PERIPHERALS; i++ ) {
    if(peripheralsToConnect[i]){
      peripherals[i].connect();
      peripherals[i].discoverAttributes();
      Serial.print("connected on : ");
      Serial.println(peripherals[i].localName());
      BLECharacteristic positionCharacteristic = peripherals[i].characteristic("25a23d8d-d15d-4d14-b474-b101ef55afe6");
      if ( positionCharacteristic ){
        positionCharacteristics[i] = positionCharacteristic;
        positionCharacteristics[i].subscribe();
        
      }
      peripheralsConnected[i]=true;
      peripheralsToConnect[i]=false;
    }
  }
  while(1){
    delay(latence);
    for ( int i = 0; i < BLE_MAX_PERIPHERALS; i++ ) {
      Serial.print("uuid characteristic of the device ");
      Serial.print(peripherals[i].localName());
      Serial.print(" is ");
      Serial.println(positionCharacteristics[i].uuid());
      Serial.print("CanRead? : ");
      Serial.println(positionCharacteristics[i].canRead());
      positionCharacteristics[i].read();
      Serial.print("valueLength : ");
      Serial.println(positionCharacteristics[i].valueLength());
      Serial.print("value : ");
      printData(positionCharacteristics[i].value(), positionCharacteristics[i].valueLength());
      Serial.print("value en boolean: ");
      Serial.println(vOut);
      if (vOut && peripherals[i].localName()== "Detection_Button"){
        positionCharacteristics[i].writeValue((byte)0x00);
        digitalWrite(ledPin_button, HIGH);
        delay(latence);
        digitalWrite(ledPin_button, LOW);
        int j = abs(i - 1);
        positionCharacteristics[j].writeValue((byte)0x01);
        /*digitalWrite(ledPin_web, HIGH);
        delay(900);
        digitalWrite(ledPin_web, LOW);*/
      }
      if (vOut && peripherals[i].localName()== "Detection_Web"){
        positionCharacteristics[i].writeValue((byte)0x00);
        digitalWrite(ledPin_web, HIGH);
        delay(latence);
        digitalWrite(ledPin_web, LOW);
      }
    }
  }
}

void printData(const unsigned char data[], int length) {
  for (int i = 0; i < length; i++) {
    unsigned char b = data[i];
    vOut = b!=0;
    Serial.println(b, HEX);
  }
}
