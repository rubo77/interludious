# TODO

- [x] der himmel soll voller sterne sein, die ein bischen flackern. Die sterne sollen100 px über der startposition des raumschiffs langsam anfangen und beim erreichen des SKY_THRESHOLD_OFFSET die volle dichte erreichen. Die sterne sollen zufällig angeordnet sein und mit unterschiedlicher helligkeit und leicht flackernd.
- [x] die anzahl herzen oben im scren zählt noch nicht runter, wenn man ein leben verliert
- [x] sobald der pod angedockt ist, soll die kollision des pods auch geprüft werden, und wenn der etwas berührt, dann explodiert der zuerst, und eine halbe sekunde später auch das raumschiff
- [x] der pod soll runter fallen, wenn man ihn loslässt, aber nicht beim level start, da soll er sicher auf seinem podhalter silien ohne kollision zu erzeugen
- [x] der pod halter muss eine besonderes objekt sein, das den pod die eigenschaft verändert, dass er keine gravity hat und keine kollisionen durch schüsse der raketenbasen getroffen wird, nur die schuesse des raumschiffs dürfen ihn zerstören (da muss man halt aufpassen)
- [x] der pod muss viel schwerer sein , ein faktor 2 in den constants definierbar, der muss physikalisch richtig implementiert werden, so dass sich das system aus pod und raumschiff phaysikalsch richtig um sich dreht, aber der schwerpunkt ist näher beim pod
- [ ] der angedockte pod muss auch von den schüssen der raketentürme getroffen werden
- [ ] der pod string muss auch von den schüssen der raketentürme getroffen werden
- [ ] man muss mit dem podhalter kollidieren können, auch der pod muss damit kollidieren können
- [ ] die raketentürme sollen mit einem schuss vernichthbar sein
- [ ] es kommt vor, dass die rakententürme nicht mehr zerstörbar sined, wahrschinlich wenn man rechts aus dem bild geflogen ist und auf der anderen seite wieder eingeflogen ist
- [ ] test this: If you finish the last level it should start the first level again with ab bit stronger gravity
- [ ] es soll eine extra steuerung geben, die überall auf dem screen funktioniert mit maus der touch: ausgehend von dem punkt wo der touch beginnt, nach rechts soll sich das raumschiff nach rechts drehen und nach links dito. nach oben soll es beschleunigen
- [x] Touch tractor beam button inside canvas, wenn ratio long enough rechts und links einer, sonst unten. transparente buttons, Button highlights when active (yellow background) der css stil der buttons soll so wie schon eingebaut . bei ratio 1.6 soll der umschalter sein, seite oder unten (in constants,js)
- [x] ergänze in der unteren rechten und unteren linken ecke zwei buttons, die schub geben und wenn die pod buttons am rand sind, dann über dem thrust button einen feuer button auf beiden seiten wenn der pod button unten ist nur einen feuer button in der oberen rechten ecke des canvas. in der oberen lnken ecke zwei klkeine buttons für nach lnks und nach rechts drehen. achte darauf, dass die bisherige positioniertung der pod buttons so erhalten bleibt, sie ist. also nu zussätzliche butons für fuer (x) und thrust (up) 
- [ ] man muss das fuel langsam leer  saugen können nund wenn es lehr ist, soll der sprite aus dem level verschwinden
- [ ] Der pod button geht aus, wenn man den thrust drückt, soll aber zusammen funktionieren
- [ ] Schießt man auf das Kraftwerk am Höhleneingang, werden die Geschütztürme kurz deaktiviert.
- [ ] Den Reaktor etwa 10 Sekunden lang beschießen löst eine Kernschmelze aus. Nach 10 Sekunden explodiert der gesamte Planet mit grosser animation. Schafft man es mit der Kugel noch rechtzeitig zu entkommen, gibt es 2000 Bonuspunkte. 
- [ ] Der aktivierte pod button verbraucht auch fuel
- [ ] Schutzschild:  Er schützt dein Schiff vor Geschossen der Geschütztürme. Solange der Schild aktiv ist, kannst du allerdings nicht schießen und verbrauchst kontinuierlich Treibstoff. der schutzschild aktiviert sich immer gleichzeitig durch den pod button. 

^