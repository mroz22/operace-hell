#define RELAY1 2               // sketch 2 == wemos D9 == arest 4
#define PUMP1 16               // sketch 16 == wemos D2 == arest 90 
#define MOISTURE_SENSOR1 A0;   // wemos A0

// https://cloud.arest.io/3g83sf/mode/2/o sets D4 to output
// https://cloud.arest.io/3g83sf/digital/2/1 sets D4 high

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <aREST.h>
#include <Timer.h>

// Clients
WiFiClient espClient;
PubSubClient client(espClient);
Timer t;

// Create aREST instance
aREST rest = aREST(client);

// Unique ID to identify the device for cloud.arest.io
char* device_id = "3g83sf";

// WiFi parameters
const char* ssid = "Internet U veverky";
const char* password = "procbychomsenetesili";

const int drySoilValue = 1024;               
const int wetSoilValue = 420;
const int wateringTreshold = 900;
int humidityValue = 0; // totaly wet

// Functions
void callback(char* topic, byte* payload, unsigned int length);

void water(int millis, int pulses) {
    t.oscillate(PUMP1, millis, LOW, pulses);
}

void handleWater() {
  humidityValue = analogRead(A0);
  Serial.print("humidity: ");
  Serial.println(humidityValue);
  
  if (humidityValue > wateringTreshold) {
     Serial.println("watering");
     water(1000 * 5, 1);
  }  
  
  
}

void setup(void)
{
  // Start Serial
  Serial.begin(9600);

  // Set callback
  client.setCallback(callback);
  
  // Give name and ID to device
  rest.set_id(device_id);
  rest.set_name("relay_anywhere");

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  // Set output topic
  char* out_topic = rest.get_topic();
  pinMode(RELAY1, OUTPUT);
  pinMode(PUMP1, OUTPUT);
  digitalWrite(PUMP1, LOW);
  humidityValue = analogRead(A0);
  Serial.print("humidity: ");
  Serial.println(humidityValue);
  t.every(1000 * 60 * 24, handleWater);

}

void loop() {
  // Connect to the cloud
  rest.loop(client);
  t.update();
 
}

// Handles message arrived on subscribed topic(s)
void callback(char* topic, byte* payload, unsigned int length) {
  rest.handle_callback(client, topic, payload, length);
}
