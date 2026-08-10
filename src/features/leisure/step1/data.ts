import leisureStep1HeroAsset from "@/assets/leisure-step1-hero-v3.png.asset.json";
import aalborgImg from "@/assets/leisure/aalborg.jpg.asset.json";
import aarhusImg from "@/assets/leisure/aarhus.jpg.asset.json";
import alesundImg from "@/assets/leisure/alesund.jpg.asset.json";
import areImg from "@/assets/leisure/are.jpg.asset.json";
import bergenImg from "@/assets/leisure/bergen.jpg.asset.json";
import billundImg from "@/assets/leisure/billund.jpg.asset.json";
import bodoImg from "@/assets/leisure/bodo.jpg.asset.json";
import copenhagenImg from "@/assets/leisure/copenhagen.jpg.asset.json";
import geirangerImg from "@/assets/leisure/geiranger.jpg.asset.json";
import gothenburgImg from "@/assets/leisure/gothenburg.jpg.asset.json";
import helsinkiImg from "@/assets/leisure/helsinki.jpg.asset.json";
import kirunaImg from "@/assets/leisure/kiruna.jpg.asset.json";
import leviImg from "@/assets/leisure/levi.jpg.asset.json";
import lofotenImg from "@/assets/leisure/lofoten.jpg.asset.json";
import malmoImg from "@/assets/leisure/malmo.jpg.asset.json";
import odenseImg from "@/assets/leisure/odense.jpg.asset.json";
import osloImg from "@/assets/leisure/oslo.jpg.asset.json";
import rovaniemiImg from "@/assets/leisure/rovaniemi.jpg.asset.json";
import stavangerImg from "@/assets/leisure/stavanger.jpg.asset.json";
import stockholmImg from "@/assets/leisure/stockholm.jpg.asset.json";
import tampereImg from "@/assets/leisure/tampere.jpg.asset.json";
import tromsoImg from "@/assets/leisure/tromso.jpg.asset.json";
import trondheimImg from "@/assets/leisure/trondheim.jpg.asset.json";
import turkuImg from "@/assets/leisure/turku.jpg.asset.json";
import uppsalaImg from "@/assets/leisure/uppsala.jpg.asset.json";
import visbyImg from "@/assets/leisure/visby.jpg.asset.json";
import { CITIES, COUNTRIES } from "@/features/leisure/data";
import { type CountryCode, type Destination } from "@/features/leisure/types";

export const S1_HERO = leisureStep1HeroAsset.url;

export const DEST_IMG: Record<string, string> = {
  Oslo: osloImg.url,
  Bergen: bergenImg.url,
  Tromsø: tromsoImg.url,
  Lofoten: lofotenImg.url,
  Stavanger: stavangerImg.url,
  Trondheim: trondheimImg.url,
  Bodø: bodoImg.url,
  Ålesund: alesundImg.url,
  Stockholm: stockholmImg.url,
  Gothenburg: gothenburgImg.url,
  Malmö: malmoImg.url,
  Uppsala: uppsalaImg.url,
  Kiruna: kirunaImg.url,
  Åre: areImg.url,
  Visby: visbyImg.url,
  Copenhagen: copenhagenImg.url,
  Aarhus: aarhusImg.url,
  Odense: odenseImg.url,
  Aalborg: aalborgImg.url,
  Billund: billundImg.url,
  Helsinki: helsinkiImg.url,
  Rovaniemi: rovaniemiImg.url,
  Tampere: tampereImg.url,
  Turku: turkuImg.url,
  Levi: leviImg.url,
};

export const ANYWHERE_IMG: Record<CountryCode, string> = {
  NO: geirangerImg.url,
  SE: kirunaImg.url,
  DK: copenhagenImg.url,
  FI: rovaniemiImg.url,
};

export const NORWAY_TILES: { name: string; img: string }[] = [
  { name: "Bergen", img: bergenImg.url },
  { name: "Oslo", img: osloImg.url },
  { name: "Lofoten", img: lofotenImg.url },
  { name: "Tromsø", img: tromsoImg.url },
  { name: "Stavanger", img: stavangerImg.url },
  { name: "Trondheim", img: trondheimImg.url },
  { name: "Geiranger", img: geirangerImg.url },
];

export const COUNTRY_FLAG_EMOJI: Record<CountryCode, string> = {
  NO: "🇳🇴",
  SE: "🇸🇪",
  DK: "🇩🇰",
  FI: "🇫🇮",
};

export const FALLBACK_IMG = geirangerImg.url; // premium placeholder when a photo is missing

export function makeDest(
  name: string,
  code: CountryCode,
  countryName: string,
  image: string | undefined,
): Destination {
  if (!image) {
    // eslint-disable-next-line no-console
    console.warn(`[destinations] Missing image for "${name}" (${countryName}) — using fallback.`);
  }
  return {
    id: `${code.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    country: code,
    countryName,
    image: image || FALLBACK_IMG,
    alt: `${name}, ${countryName}`,
  };
}

export const DESTINATIONS: Record<CountryCode, Destination[]> = (() => {
  const build = (code: CountryCode): Destination[] => {
    const countryName = COUNTRIES.find((c) => c.code === code)!.name;
    const cities = CITIES[code].map((n) => makeDest(n, code, countryName, DEST_IMG[n]));
    cities.push(
      makeDest(`Anywhere in ${countryName}`, code, countryName, ANYWHERE_IMG[code]),
    );
    return cities;
  };
  return { NO: build("NO"), SE: build("SE"), DK: build("DK"), FI: build("FI") };
})();

export const ALL_DESTINATIONS: Destination[] = Object.values(DESTINATIONS).flat();
