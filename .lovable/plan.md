# Booking Overview — justeringer mot beskrivelsen

Jeg gikk gjennom Booking Overview-fanen. Nesten alt du beskriver finnes allerede og skal ikke røres:

- Statistikk-raden (datoer, rom/gjester, depositum, tjenester, status)
- "Booking journey" med 6 steg — grønne checkmarks 1–3, gull aktiv sirkel "4" med "Rooming list" / "Due in 6 days" i gull, grå outline 5–6
- "Current action"-boks med gull deadline-tekst, gull progress bar, "X% completed · N of M names" og gull Continue-knapp
- Høyre sidebar: "Rooming list progress" med gull ring + Completed / Pending / Missing, gull "Open rooming list"-knapp, og "Latest documents" (Contract.pdf, RoomingList_v2.xlsx, Invoice.pdf) med nedlastingsikoner

## Det eneste som avviker: fanene

Beskrivelsen sier aktiv fane skal være **#173957 med hvit tekst**, og inaktive faner **cream med mørk tekst**. I dag er det motsatt: aktiv fane er cream/ivory med mørk tekst, inaktive er mørke.

### Endring

I fane-raden (delt header som brukes på alle workspace-faner):

- Aktiv fane: bakgrunn `#173957`, tekst hvit, ikon i dempet gull for kontrast, beholder samme form/radius/padding
- Inaktive faner: cream bakgrunn (`#F7F3EC`), mørk tekst (`#16293A`), lett kantlinje, litt redusert opacity slik at aktiv fane fortsatt leser tydeligst

Ingen andre farger, typografi, avstander, komponenter eller innhold endres. Endringen gjelder kun fane-stilen og slår automatisk gjennom på alle workspace-fanene siden headeren er delt.

## Teknisk

- Fil: `src/components/BookingWorkspaceHeader.tsx` — bytt om `isActive`-grenene i style-objektet for fanene.
- Ingen ruting-, data- eller funksjonsendringer.
