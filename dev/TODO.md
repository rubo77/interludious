# TODO

- [ ] test this: If you finish the last level it should start the first level again with ab bit stronger gravity
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
- [ ] es soll eine extra steuerung geben, die überall auf dem screen funktioniert mit maus der touch: ausgehend von dem punkt wo der touch beginnt, nach rechts soll sich das raumschiff nach rechts drehen und nach links dito. nach oben soll es beschleunigen
- [ ] Touch tractor beam button inside canvas, wenn ratio long enough rechts und links einer, onst unten. transparente buttons, Button highlights when active (yellow background) der css stil der buttons soll so wie aus 575909e4 
