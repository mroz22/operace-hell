#include "DHT.h"

#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <stdlib.h>

#define typDHT11 DHT11
#define pinDHT 2  // MONSTRER BRAIN FUCK WARNING !!! PINS HAVE SOOME WEIRD MAPPING, MORE https://github.com/esp8266/Arduino/blob/master/variants/d1/pins_arduino.h

const char* wifiSSID = "Internet U veverky";
const char* wifiPassword = "procbychomsenetesili";
const char* server = "stroncnet.herokuapp.com";
const int httpPort = 80;

//const char* server = "localhost";
//const int httpPort = 3000;

DHT dht(pinDHT, typDHT11);
WiFiClient client;

void setup() {
  Serial.begin(9600);  
  delay(10);   
  dht.begin();
  WiFi.begin(wifiSSID, wifiPassword);   //WiFi connection
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(100);
    Serial.print(".");
  }
  Serial.print("Connected to network, local IP: ");
  Serial.println(WiFi.localIP());

}
 float h;
 float t;
void loop() {
  if (!client.connect(server, httpPort)) {
    Serial.println("connection failed");
    return;
  }
  
  h = dht.readHumidity();
  t = dht.readTemperature();  
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    delay(100);
    return;
  } else {
    Serial.print("Current humidity is ");
    Serial.print(h);
    Serial.println(" %");
    Serial.print("Current temperature is ");
    Serial.print(t);
    Serial.println(" C");
  }
  
   String dataString = String("{\"temperature\":") + t + String(",\"humidity\":") + h + String("}");

  // připojení na server Thingspeak pro odeslání dat
    String url = "/test";
    /* 
    functioning GET request 
    */
    
//    String request = (
//                  String("GET ") + url + " HTTP/1.1\r\n" +
//                  "Host: " + server + "\r\n" + 
//                  "Connection: close\r\n\r\n");

 String request = (
                  String("POST ") + url + " HTTP/1.1\r\n" +
                  "Host: " + server + "\r\n" + 
                  "Content-Type: application/json\r\n" +
                  "Content-Length: " +
                  dataString.length() + "\r\n"+ 
                  "Cache-control: no-cache \r\n\r\n" +
                  dataString
                  );
      Serial.println(request);
      client.print(request);

//    client.print("POST /test HTTP/1.1\n");
//    client.print("Host: " + server + "\n");
//    client.print("Connection: close\n");
//    client.print("Cache-Control: no-cache\n");
//    client.print("Content-Type: application/json\n");
//    client.print("Content-Length: 4\n");
//    //client.print(dataString.length());
//    client.print("\n\n");
//    client.print("{a:1}");
//      
    Serial.println("Udaje odeslany");
  
  // ukončení spojení se serverem Thingspeak
  client.stop();
  // nyní musíme vyčkat minimálně 15 vteřin do dalšího odeslání dat,
  // 15 vteřin je omezení Thingspeaku, v tomto příkladu je nastaven
  // interval 30 vteřin
  Serial.println("Pauza pred dalsim odeslanim dat.");
 

  delay(10000);  //Send a request every 30 seconds
 
}
