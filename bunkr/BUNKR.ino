#include "Timer.h"

#include "C:\Users\Mroz\Desktop\BUNKR\keypad\keypad.ino"

const int OXYGEN_CONSUMPTION_PER_PERSON = 1;
const int INTERVAL = 1000;
const int LOG_INTERVAL = 10000;
const int WARNING_TRESHOLD = 60 * 30;
const int WARNING_TRESHOLD_CRITICAL = 60 * 3;
const char PERSON_ENTER = '*';
const char PERSON_LEAVE = '#';
 
int people = 0;
int oxygenLevel = 60 * 31 ;
int oxygenConsumption;

int remainingMinutes;

Timer t;
 
int getCurrentOxygenConsumption(int p) {
  return p * OXYGEN_CONSUMPTION_PER_PERSON;
}

int setRemainingMinutes(float o, float p, float r) {
  int currentConsumption = getCurrentOxygenConsumption(p);
  remainingMinutes = (o / currentConsumption) / 60;
  return remainingMinutes;
}

void addPerson() {
  people++;
}

void removePerson() {
  if (people > 0) {
    people--;  
  }
}

void logInfo() {
  String oxygenInfoMsg;
  String oxygenTotalMsg;
  String peopleInfoMsg;
  String peopleTotalMsg;
 
    oxygenInfoMsg = String("stav jednotek kysliku: ");
    oxygenTotalMsg = oxygenInfoMsg + oxygenLevel;

    peopleInfoMsg = String("pocet osob v bunkru: ");
    peopleTotalMsg = peopleInfoMsg + people;
    Serial.println(oxygenTotalMsg);
    Serial.println(peopleTotalMsg);
    Serial.println();
 
}

void consumeOxygen() {
    oxygenLevel -= getCurrentOxygenConsumption(people);
    if (oxygenLevel < 0) {
      oxygenLevel = 0;
    }
    considerWarning();  
}

void considerWarning() {
  if (oxygenLevel == 0) {
    Serial.println("Bunkr mimo provoz");
  }
  else if (oxygenLevel < WARNING_TRESHOLD_CRITICAL) {
    Serial.println("Pozor! Kriticka uroven kysliku. Okamzite si oblecte ochranne obleky.");
  }
  else if (oxygenLevel < WARNING_TRESHOLD) {
    Serial.println("Pozor! Dochazi kyslik. Co nejdive jej doplnte");
  }
}

void setup() {
  Serial.begin(9600);
  t.every(INTERVAL, consumeOxygen);
  t.every(LOG_INTERVAL, logInfo);
}


void loop() { 
  char klavesa = readKeypadInput();
  if (klavesa == PERSON_ENTER) {
    addPerson();
    logInfo();
  }
   if (klavesa == PERSON_LEAVE) {
    removePerson();
    logInfo();
  }
  t.update(); 
}
