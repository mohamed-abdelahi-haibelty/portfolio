import { ButtonPrimary } from "@/components/ButtonPrimary";
import { ButtonSecondary } from "@/components/ButtonSecondary";
import { SketchDev } from "@/components/character/SketchDev";
import { HandArrow } from "@/components/paper/HandArrow";
import { HandNote } from "@/components/paper/HandNote";
import { Highlight } from "@/components/paper/Highlight";
import { PenCircle } from "@/components/paper/PenCircle";
import { Sticker } from "@/components/paper/Sticker";
import { Tape } from "@/components/paper/Tape";
import { WavyUnderline } from "@/components/paper/WavyUnderline";
import type { Dictionary } from "@/content";
import { cn } from "@/lib/utils";
import { DevBadge } from "./DevBadge";
import { container } from "./layout";

type HeroProps = {
  t: Dictionary["hero"];
  badge: Dictionary["badge"];
  /** WhatsApp link with the prefilled message. */
  whatsappHref: string;
};

/** "fig. 1 — moi, au travail" → ["fig. 1 —", "moi, au travail"], as drawn in the desktop mock. */
function splitAfterDash(text: string): [string, string] | [string] {
  const index = text.indexOf("— ");
  return index < 0 ? [text] : [text.slice(0, index + 1), text.slice(index + 2)];
}

const checkRotations = [-4, 3, -2] as const;
const mobileCheckRotations = [4, -3, 2] as const;

/** Desktop (≥1024px): the lanyard badge with hand notes and the sticker, drawn at 576×620. */
function BadgeFigure({ t, badge }: Omit<HeroProps, "whatsappHref">) {
  const [figFirst, figSecond] = splitAfterDash(t.fig);
  return (
    <div className="relative hidden h-[620px] w-[576px] lg:block lg:[zoom:0.78] xl:[zoom:1]">
      <DevBadge
        header={badge.header}
        name={badge.name}
        role={badge.role}
        tags={badge.tags}
        characterAlt={t.characterAlt}
        className="absolute start-0 -top-[22px]"
      />
      <HandNote rotate={6} className="absolute start-[360px] top-[68px] text-2xl">
        {figFirst}
        {figSecond === undefined ? null : (
          <>
            <br />
            {figSecond}
          </>
        )}
      </HandNote>
      <HandArrow variant="diagonal" className="absolute start-[350px] top-[128px]" />
      <HandArrow variant="left" color="ink" className="absolute start-[322px] top-[286px]" />
      {t.notes.map((note, index) => (
        <HandNote
          key={note}
          color="ink"
          rotate={checkRotations[index] ?? 0}
          className={cn(
            "absolute text-[26px]",
            ["start-[370px] top-[268px]", "start-[390px] top-[338px]", "start-[366px] top-[408px]"][
              index
            ],
          )}
        >
          {note}
        </HandNote>
      ))}
      <Sticker text={t.sticker} className="absolute start-[400px] top-[470px]" />
    </div>
  );
}

/** Under 1024px: the yellow card with the character, the hand notes and the sticker. */
function CharacterCard({ t }: Pick<HeroProps, "t">) {
  return (
    <div className="relative mt-[18px] h-[300px] max-w-xl rounded-[20px] border-3 border-ink bg-highlight shadow-hard-md md:mt-8 lg:hidden">
      <SketchDev
        alt={t.characterAlt}
        width={290}
        className="absolute start-[6%] bottom-2 h-auto w-[80%] max-w-[290px]"
      />
      <HandNote rotate={-3} className="absolute start-3.5 top-3 text-[19px] leading-tight">
        {t.fig}
      </HandNote>
      {t.notes.map((note, index) => (
        <HandNote
          key={note}
          rotate={mobileCheckRotations[index] ?? 0}
          className={cn(
            "absolute text-[19px] leading-tight",
            ["end-3 top-[70px]", "end-4 top-[112px]", "end-2.5 top-[154px]"][index],
          )}
        >
          {note}
        </HandNote>
      ))}
      <Sticker
        text={t.sticker}
        className="absolute -end-1.5 -bottom-3.5 md:size-[104px] md:text-base md:leading-none"
      />
    </div>
  );
}

export function Hero({ t, badge, whatsappHref }: HeroProps) {
  const { title } = t;
  return (
    <section
      aria-labelledby="hero-title"
      className={cn(container, "pt-[30px] lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:pt-10")}
    >
      <div className="min-w-0">
        <Tape rotate={-3} className="px-3 lg:ms-11 lg:px-6">
          {t.hello}
        </Tape>
        <h1
          id="hero-title"
          className="mt-4 max-w-[600px] font-display text-h1 font-extrabold text-ink lg:mt-9"
        >
          {title.start}
          <Highlight>{title.highlight}</Highlight>
          {title.afterHighlight}
          <PenCircle className="[&>svg]:hidden lg:[&>svg]:block">{title.circle}</PenCircle>
          {title.afterCircle}
          <WavyUnderline className="lg:whitespace-nowrap">{title.wavy}</WavyUnderline>
          {title.end}
        </h1>
        <p className="mt-4 max-w-[520px] text-lead text-muted lg:mt-14">{t.lead}</p>
        <CharacterCard t={t} />
        <div className="mt-[30px] flex flex-col gap-2.5 sm:flex-row sm:gap-3.5 lg:mt-10">
          <ButtonPrimary href="#contact">{t.ctaPrimary}</ButtonPrimary>
          <ButtonSecondary href={whatsappHref}>{t.ctaWhatsapp}</ButtonSecondary>
        </div>
      </div>
      <BadgeFigure t={t} badge={badge} />
    </section>
  );
}
