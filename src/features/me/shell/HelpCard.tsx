import { SERIF } from "@/features/me/tokens";
import { Mail, Phone } from "lucide-react";

export function HelpCard() {
  return (
    <div>
      <h3
        className="text-[#0A1B2C] text-[26px] leading-tight"
        style={{ fontFamily: SERIF }}
      >
        Need help?
      </h3>
      <p className="mt-3 text-[#4A5866] text-[15px] leading-relaxed">
        Our M&amp;E specialists are ready
        <br />
        to assist you.
      </p>
      <div className="mt-6 flex flex-col gap-4">
        <a
          href="tel:+4721002100"
          className="flex items-center gap-3 text-[#0A1B2C] text-[15px] hover:text-[#B88A2E] transition-colors"
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
            style={{ borderColor: "rgba(184,138,46,0.4)" }}
          >
            <Phone size={16} strokeWidth={1.8} style={{ color: "#B88A2E" }} />
          </span>
          +47 21 00 21 00
        </a>
        <a
          href="mailto:meetings@hotelgroupbook.com"
          className="flex items-center gap-3 text-[#0A1B2C] text-[15px] hover:text-[#B88A2E] transition-colors whitespace-nowrap"
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
            style={{ borderColor: "rgba(184,138,46,0.4)" }}
          >
            <Mail size={16} strokeWidth={1.8} style={{ color: "#B88A2E" }} />
          </span>
          meetings@hotelgroupbook.com
        </a>
      </div>
    </div>
  );
}
