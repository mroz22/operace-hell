const int RELAY_PIN = 6;
const int PIR_PIN = 2;
const int MAX_TRIGGERS = 20;
const int SHOOT_INTERVAL = 300;
int triggerCounter = 0;
int val = 0;
long randDelay;

void setup() {
    Serial.begin(9600);
    randomSeed(analogRead(0));
    pinMode(LED_BUILTIN, OUTPUT);   
    pinMode(PIR_PIN, INPUT);

    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, LOW); 

    Serial.println("blink quickly to indicate we start");
    for (int i = 0; i <= 60; i++) {
        Serial.println(i);
        digitalWrite(LED_BUILTIN, HIGH);
        delay(250);
        digitalWrite(LED_BUILTIN, LOW);
        delay(250);
    }
    Serial.println("ready");
}

void loop() {
    
    val = digitalRead(PIR_PIN); 
    if (triggerCounter > MAX_TRIGGERS) {
        Serial.println("blocked");
        delay(10000); 
        return;
    } 

    Serial.println(val);
    if (val == HIGH) {
        triggerCounter++;
        if (triggerCounter > 8) {
            randDelay= (random(1, 6) * triggerCounter) * 1000;
            Serial.print("random delay: ");
            Serial.println(randDelay);
            delay(randDelay);
        }
        Serial.println("shooting start");
        digitalWrite(RELAY_PIN, HIGH);
        digitalWrite(LED_BUILTIN, HIGH);
        delay(SHOOT_INTERVAL);
        Serial.println("shooting stop");
        digitalWrite(RELAY_PIN, LOW);
        digitalWrite(LED_BUILTIN, LOW);

    }
    delay(1000);
}
