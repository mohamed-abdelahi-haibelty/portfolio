import { ContactRow } from "@/components/ContactRow";
import { SketchDev } from "@/components/character/SketchDev";
import { MailIcon } from "@/components/icons/MailIcon";
import { PhoneIcon } from "@/components/icons/PhoneIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { HandNote } from "@/components/paper/HandNote";
import { Highlight } from "@/components/paper/Highlight";
import { Tape } from "@/components/paper/Tape";
import type { Dictionary } from "@/content";
import { contactLinks } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { anchorOffset, container } from "./layout";

type ContactProps = {
  t: Dictionary["contact"];
  /** `hero.characterAlt`. */
  characterAlt: string;
};

/**
 * White block with tape on two corners and the character sitting on its top
 * edge (left on desktop, right on mobile). Heading and note, then the three
 * contact rows.
 */
export function Contact({ t, characterAlt }: ContactProps) {
  const links = contactLinks(t.whatsapp.message);
  const rows = [
    { key: "whatsapp", label: t.whatsapp.label, link: links.whatsapp, Icon: WhatsAppIcon },
    { key: "phone", label: t.phone.label, link: links.phone, Icon: PhoneIcon },
    { key: "email", label: t.email.label, link: links.email, Icon: MailIcon },
  ] as const;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className={cn(container, anchorOffset, "mt-[154px] lg:mt-[140px]")}
    >
      <div className="relative rounded-[22px] border-3 border-ink bg-white px-5 pt-7 pb-[22px] shadow-hard-md md:px-10 md:py-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:rounded-block lg:ps-[46px] lg:pe-11 lg:pt-[30px] lg:pb-[34px] lg:shadow-hard-lg">
        <SketchDev
          alt={characterAlt}
          width={170}
          accent="highlight"
          className="absolute end-[18px] -top-[84px] h-auto w-[110px] lg:start-[76px] lg:end-auto lg:-top-[129px] lg:w-[170px]"
        />
        <Tape
          color="pink"
          rotate={-20}
          className="absolute -start-6 -top-2 hidden h-[30px] w-[120px] lg:block"
        />
        <Tape
          color="sky"
          rotate={24}
          className="absolute -end-3.5 -top-3.5 hidden h-[30px] w-[130px] lg:block"
        />
        <div>
          <h2
            id="contact-title"
            className="font-display text-h2 font-extrabold text-ink lg:text-[50px] lg:leading-[1.05]"
          >
            {t.title.before}
            <span className="lg:block">
              <Highlight>{t.title.highlight}</Highlight>
            </span>
          </h2>
          <HandNote className="mt-2.5 mb-[18px] lg:mt-[18px] lg:mb-0 lg:text-[26px]">
            {t.note}
          </HandNote>
        </div>
        <ul className="flex flex-col gap-3">
          {rows.map(({ key, label, link, Icon }) => (
            <li key={key}>
              <ContactRow
                href={link.href}
                label={label}
                value={link.display}
                icon={<Icon size={22} strokeWidth={2} />}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
