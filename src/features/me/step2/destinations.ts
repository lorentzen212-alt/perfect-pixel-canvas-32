import aalborgImg from "@/assets/destinations/aalborg.jpg";
import aarhusImg from "@/assets/destinations/aarhus.jpg";
import areImg from "@/assets/destinations/are.jpg";
import bergenImg from "@/assets/destinations/bergen.jpg";
import billundImg from "@/assets/destinations/billund.jpg";
import bodoImg from "@/assets/destinations/bodo.jpg";
import copenhagenImg from "@/assets/destinations/copenhagen.jpg";
import gothenburgImg from "@/assets/destinations/gothenburg.jpg";
import helsinkiImg from "@/assets/destinations/helsinki.jpg";
import kirunaImg from "@/assets/destinations/kiruna.jpg";
import leviImg from "@/assets/destinations/levi.jpg";
import lofotenImg from "@/assets/destinations/lofoten.jpg";
import malmoImg from "@/assets/destinations/malmo.jpg";
import odenseImg from "@/assets/destinations/odense.jpg";
import osloImg from "@/assets/destinations/oslo.jpg";
import ouluImg from "@/assets/destinations/oulu.jpg";
import porvooImg from "@/assets/destinations/porvoo.jpg";
import roskildeImg from "@/assets/destinations/roskilde.jpg";
import rovaniemiImg from "@/assets/destinations/rovaniemi.jpg";
import skagenImg from "@/assets/destinations/skagen.jpg";
import stavangerImg from "@/assets/destinations/stavanger.jpg";
import stockholmImg from "@/assets/destinations/stockholm.jpg";
import tampereImg from "@/assets/destinations/tampere.jpg";
import tromsoImg from "@/assets/destinations/tromso.jpg";
import trondheimImg from "@/assets/destinations/trondheim.jpg";
import turkuImg from "@/assets/destinations/turku.jpg";
import uppsalaImg from "@/assets/destinations/uppsala.jpg";
import visbyImg from "@/assets/destinations/visby.jpg";
import { FlagDK, FlagFI, FlagNO, FlagSE } from "@/features/me/common/flags";
import { Building2, Globe, Landmark, Palmtree, Plane, Waves } from "lucide-react";
import React from "react";

export type Destination = {
  id: string;
  name: string;
  image?: string;
  Icon: typeof Building2;
  anywhere?: boolean;
};

export type CountryCode = "NO" | "SE" | "DK" | "FI";

export const COUNTRIES: { code: CountryCode; name: string; Flag: () => React.ReactElement }[] = [
  { code: "NO", name: "Norway", Flag: FlagNO },
  { code: "SE", name: "Sweden", Flag: FlagSE },
  { code: "DK", name: "Denmark", Flag: FlagDK },
  { code: "FI", name: "Finland", Flag: FlagFI },
];

export const DESTINATIONS_BY_COUNTRY: Record<CountryCode, Destination[]> = {
  NO: [
    { id: "oslo", name: "Oslo", image: osloImg, Icon: Building2 },
    { id: "bergen", name: "Bergen", image: bergenImg, Icon: Landmark },
    { id: "tromso", name: "Tromsø", image: tromsoImg, Icon: Plane },
    { id: "stavanger", name: "Stavanger", image: stavangerImg, Icon: Building2 },
    { id: "trondheim", name: "Trondheim", image: trondheimImg, Icon: Landmark },
    { id: "bodo", name: "Bodø", image: bodoImg, Icon: Building2 },
    { id: "lofoten", name: "Lofoten", image: lofotenImg, Icon: Waves },
    { id: "anywhere-NO", name: "Anywhere in Norway", Icon: Globe, anywhere: true },
  ],
  SE: [
    { id: "stockholm", name: "Stockholm", image: stockholmImg, Icon: Building2 },
    { id: "gothenburg", name: "Gothenburg", image: gothenburgImg, Icon: Waves },
    { id: "malmo", name: "Malmö", image: malmoImg, Icon: Building2 },
    { id: "uppsala", name: "Uppsala", image: uppsalaImg, Icon: Landmark },
    { id: "kiruna", name: "Kiruna", image: kirunaImg, Icon: Plane },
    { id: "visby", name: "Visby", image: visbyImg, Icon: Landmark },
    { id: "are", name: "Åre", image: areImg, Icon: Palmtree },
    { id: "anywhere-SE", name: "Anywhere in Sweden", Icon: Globe, anywhere: true },
  ],
  DK: [
    { id: "copenhagen", name: "Copenhagen", image: copenhagenImg, Icon: Building2 },
    { id: "aarhus", name: "Aarhus", image: aarhusImg, Icon: Waves },
    { id: "odense", name: "Odense", image: odenseImg, Icon: Landmark },
    { id: "aalborg", name: "Aalborg", image: aalborgImg, Icon: Building2 },
    { id: "roskilde", name: "Roskilde", image: roskildeImg, Icon: Landmark },
    { id: "skagen", name: "Skagen", image: skagenImg, Icon: Waves },
    { id: "billund", name: "Billund", image: billundImg, Icon: Plane },
    { id: "anywhere-DK", name: "Anywhere in Denmark", Icon: Globe, anywhere: true },
  ],
  FI: [
    { id: "helsinki", name: "Helsinki", image: helsinkiImg, Icon: Building2 },
    { id: "tampere", name: "Tampere", image: tampereImg, Icon: Landmark },
    { id: "turku", name: "Turku", image: turkuImg, Icon: Waves },
    { id: "rovaniemi", name: "Rovaniemi", image: rovaniemiImg, Icon: Plane },
    { id: "oulu", name: "Oulu", image: ouluImg, Icon: Building2 },
    { id: "porvoo", name: "Porvoo", image: porvooImg, Icon: Landmark },
    { id: "levi", name: "Levi", image: leviImg, Icon: Palmtree },
    { id: "anywhere-FI", name: "Anywhere in Finland", Icon: Globe, anywhere: true },
  ],
};

export type SearchableDestination = {
  id: string;
  name: string;
  country: CountryCode;
  countryName: string;
};

export const ALL_SEARCHABLE_DESTINATIONS: SearchableDestination[] = (Object.keys(
  DESTINATIONS_BY_COUNTRY,
) as CountryCode[]).flatMap((code) => {
  const country = COUNTRIES.find((c) => c.code === code)!;
  return DESTINATIONS_BY_COUNTRY[code]
    .filter((d) => !d.anywhere)
    .map((d) => ({
      id: d.id,
      name: d.name,
      country: code,
      countryName: country.name,
    }));
});
