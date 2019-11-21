const int RELAY_PIN = 6;
const int PIR_PIN = 2;

const int LED_1_PIN = 3;
const int MAX_TRIGGERS = 10;
int triggerCounter = 0;
bool pirReadBlocked = false;

void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(0));
  pinMode(LED_BUILTIN, OUTPUT);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);  
  
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_1_PIN, OUTPUT);
 
  Serial.println("blink quickly to indicate we start");
  for (int i = 0; i <= 60; i++) {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(250);
    digitalWrite(LED_BUILTIN, LOW);
    delay(250);
  }

}

int val = 0;
long randDelay;

void loop() {
  val = digitalRead(PIR_PIN);  // čtení hodnoty
 
  if (triggerCounter > MAX_TRIGGERS) {
    Serial.println("blocked");
    delay(10000); 
    return;
  } 

    Serial.println(val);
    if (val == HIGH) {
      triggerCounter++;
      if (triggerCounter > 5) {
        randDelay= (random(1, 20) * triggerCounter) * 1000;
        Serial.print("random delay: ");
        Serial.println(randDelay);
        delay(randDelay);
      }
      Serial.println("shooting start");
      digitalWrite(RELAY_PIN, HIGH);
      delay(300);
      Serial.println("shooting stop");
      digitalWrite(RELAY_PIN, LOW);
    }
    delay(1000);
}
