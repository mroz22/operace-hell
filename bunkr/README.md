# Bunkr

V herním území je několik (3) rozumně obývatelných bunkrů. Idea je taková, že každý bunkr bude mít svoji řídící jednotku 
postavenou na arduino a několika periferiích. Tato řídící jednotka bude:

* monitorovat stav bunkru (počet osob, stav kyslíku)
* ideálně posílat data o svém stavu na server

## Stav bunkru

K arduinu bude připojena nějaká periferie, jejímž prostřednictvím budou hráči zaznamenávat svůj příchod a odchod z bunkru. Například:

<img src="../img/bunkr/bunkr1.png">

Podle počtu osob v bunkru se určuej aktuální spotřeba kyslíku. Bunkr je obyvatelný jen tehdy, je-li stav kyslíku větší než 0. 

## Odesílání dat

Ideální by bylo, kdybychom dokázali data z bunkrů dostávat na centrální server. Místo Arduiono uno bychom mohli použít desku Wemos D1,
která má v sobě wifi modul a umí fungovat jako klient nebo stanice. Museli bychom zajistit pokrytí bunkru internetem. V tuto chvíli
mě nenapadá jiné řešení, než že by v bunkru musel fungovat nějaký mobil s běžícím hotspotem 
