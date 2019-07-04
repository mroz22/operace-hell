#include "DHT.h"

#include <ESP8266WiFi.h>
#include <stdlib.h>
#include <PubSubClient.h>
#include <aREST.h>

#define RELAY1 16  // it is 2 port MONSTRER BRAIN FUCK WARNING !!! PINS HAVE SOOME WEIRD MAPPING, MORE https://github.com/esp8266/Arduino/blob/master/variants/d1/pins_arduino.h

const char* ssid = "Internet U veverky";
const char* password = "procbychomsenetesili";

// Clients
WiFiClient espClient;
PubSubClient client(espClient);

// Create aREST instance
aREST rest = aREST(client);

// Unique ID to identify the device for cloud.arest.io
char* device_id = "dljge9vjkfke92m";

// Functions
void callback(char* topic, byte* payload, unsigned int length);

void setup() {
  Serial.begin(9600);
  client.setCallback(callback);

  pinMode(RELAY1, OUTPUT);
  delay(10);   

  // Give name and ID to device
  rest.set_id(device_id);
  rest.set_name("relay_anywhere");

  // Connect to WiFi
  WiFi.begin(ssid, password);   //WiFi connection
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(100);
    Serial.print(".");
  }
  Serial.print("Connected to network, local IP: ");
  Serial.println(WiFi.localIP());
  
  char* out_topic = rest.get_topic();
}

void loop() {
   // Connect to the cloud
  rest.loop(client);
  //digitalWrite(LED, HIGH);   // turn the LED on (HIGH is the voltage level)
  //Serial.println("on");
  //delay(3000);              // wait for a second
  //digitalWrite(LED, LOW);    // turn the LED off by making the voltage LOW
  //Serial.println("off");
  //delay(3000);       
}

void callback(char* topic, byte* payload, unsigned int length) {

  rest.handle_callback(client, topic, payload, length);

}
