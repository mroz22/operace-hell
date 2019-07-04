// Membránová klávesnice 4x4

// připojení knihovny
#include <Keypad.h>

// vytvoření proměnných údávajících
// počet řádků a sloupců klávesnice
const byte radky = 4;
const byte sloupce = 4;
// vytvoření pole s rozmístěním kláves
char keys[radky][sloupce] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};
// nastavení čísel pinů pro spojení s klávesnicí
byte pinyRadku[radky] = {12, 11, 10, 9};
byte pinySloupcu[sloupce] = {8, 7, 6, 5};

// vytvoření instance klavesnice z knihovny Keypad
Keypad klavesnice = Keypad( makeKeymap(keys), pinyRadku, pinySloupcu, radky, sloupce); 

char readKeypadInput() {
  char klavesa = klavesnice.getKey();
  if (klavesa){
    return klavesa;
  }
}
