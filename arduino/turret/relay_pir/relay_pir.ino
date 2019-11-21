const int RELAY_PIN = 6;
const int PIR_PIN = 2;

const int LED_1_PIN = 3;
const int MAX_TRIGGERS = 10;
int triggerCounter = 0;
bool pirReadBlocked = false;

void setup() {
  Serial.begin(9600);  

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);  
  
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_1_PIN, OUTPUT);
  
  Serial.println("blink quickly to indicate we start");
  for (int i = 0; i <= 60; i++) {
    digitalWrite(LED_1_PIN, HIGH);
    delay(250);
    digitalWrite(LED_1_PIN, LOW);
    delay(250);
  }

  attachInterrupt(0, onPirRead, RISING);
}

void loop() {
   Serial.print("Time from start: ");
   Serial.print(millis()/1000);
   Serial.println(" seconds.");
   Serial.println("counter: ");
   Serial.println(triggerCounter);
}

void onPirRead() {
  if (pirReadBlocked) {
    return;
  }
  if (triggerCounter < MAX_TRIGGERS) {
    pirReadBlocked = true;
    triggerCounter++;
    digitalWrite(RELAY_PIN, LOW);
    delay(500);
    digitalWrite(RELAY_PIN, HIHG);
    pirReadBlocked = false;
  } 
}
