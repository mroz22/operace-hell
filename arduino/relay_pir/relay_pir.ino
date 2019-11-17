const int RELAY_PIN = 6;
const int PIR_PIN = 2;

const int LED_1_PIN = 3;
const int LED_2_PIN = 4;
const int LED_3_PIN = 5;

const int PIR_TRESHOLD = 3;
const int COOLDOWN_TRESHOLD = 10;
const int INITIAL_WAIT_MS = 1000 * 5;

int triggerCounter = 0;
int cooldownCounter = 0;

void setup() {
  Serial.begin(9600);  

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);  
  
  pinMode(PIR_PIN, INPUT);

  pinMode(LED_1_PIN, OUTPUT);
  pinMode(LED_2_PIN, OUTPUT);
  pinMode(LED_3_PIN, OUTPUT);
  
  Serial.println("wait for some time");
  delay(INITIAL_WAIT_MS);
  
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
   delay(1000);
   cooldownCounter++;
   if (triggerCounter == PIR_TRESHOLD) {
      digitalWrite(RELAY_PIN, LOW);
      digitalWrite(LED_1_PIN, LOW);
      digitalWrite(LED_2_PIN, LOW);
      digitalWrite(LED_3_PIN, LOW);        
   } else {
     if (cooldownCounter == COOLDOWN_TRESHOLD) {
       if (triggerCounter > 0) {
         triggerCounter--;
       }
       cooldownCounter = 0;
     }
     if (triggerCounter == 0) {
      digitalWrite(LED_1_PIN, LOW);
      digitalWrite(LED_2_PIN, LOW);
      digitalWrite(LED_3_PIN, LOW);
   }
   
   if (triggerCounter == 1) {
      digitalWrite(LED_1_PIN, HIGH);
      digitalWrite(LED_2_PIN, LOW);
      digitalWrite(LED_3_PIN, LOW);      
   }

   if (triggerCounter == 2) {
      digitalWrite(LED_1_PIN, HIGH);
      digitalWrite(LED_2_PIN, HIGH);
      digitalWrite(LED_3_PIN, LOW);      
   }
   
   if (triggerCounter == 3) {
      digitalWrite(LED_1_PIN, HIGH);
      digitalWrite(LED_2_PIN, HIGH);
      digitalWrite(LED_3_PIN, HIGH);       
   }
   }   
}

void onPirRead() {
  if (triggerCounter < PIR_TRESHOLD) {
    triggerCounter++;
    cooldownCounter = 0;
  } 
}
