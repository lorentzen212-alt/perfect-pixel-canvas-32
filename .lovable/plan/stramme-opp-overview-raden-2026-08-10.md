# Stramme opp Overview-raden

## Mål
"View full timeline" skal ligge naturlig rett over raden under, uten luftlomme, og "What happens next" skal ha samme kortmateriale som "Current action / Add rooming list"-kortet — uten den indre rammen. "Booking details" beholder sin indre ramme.

## Endringer (kun `src/features/booking-workspace/overview/Overview.tsx`)

1. **What happens next — samme kort som Current action**
   - Bytt den manuelle div-en med egen bakgrunn/skygge til det delte `Card`-materialet (samme som Current action-kortet).
   - Fjern det indre ramme-elementet (`inset-[9px]`-spennet).
   - Padding justeres til samme nivå som Current action (px-5/px-6, py-4).

2. **Komprimer høyre kolonne**
   - Booking details: litt lavere rad-høyde og padding (py-[4px] rader, py-5 container, mindre topp-marg på listen, tettere footer).
   - Need help: mindre padding og strammere avstand mellom tittel, tekst og knapp.

3. **Komprimer What happens next slik at raden faktisk blir lavere**
   - Rad-høyde 54/62 px reduseres til ca. 46/54 px.
   - Mindre luft over listen og under "View full timeline" (mt-6 → mt-4, mindre bunn-padding), slik at lenken lander tett over summary-stripen.

## Uendret
- Farger, ikoner, badges, piller, tekstinnhold og alle andre kort/filer røres ikke.
