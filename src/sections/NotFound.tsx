import { ButtonPrimary } from "@/components/ButtonPrimary";
import { SketchDev } from "@/components/character/SketchDev";
import { Tape } from "@/components/paper/Tape";
import type { Dictionary, Locale } from "@/content";

type NotFoundProps = {
  locale: Locale;
  t: Dictionary["notFound"];
  /** `hero.characterAlt`. */
  characterAlt: string;
};

/**
 * One language of the 404: the character sitting on a taped white card, the
 * title, the text and one button home. Both languages are in the document;
 * `<html lang>` decides which one shows (`globals.css`).
 */
export function NotFound({ locale, t, characterAlt }: NotFoundProps) {
  return (
    <div lang={locale} data-locale={locale} className="w-full max-w-[560px]">
      <div className="relative mt-[96px] rounded-[22px] border-3 border-ink bg-white px-6 pt-16 pb-9 text-center shadow-hard-md md:px-12 md:pt-[84px] md:pb-11 lg:shadow-hard-lg">
        <SketchDev
          alt={characterAlt}
          width={170}
          accent="highlight"
          className="absolute inset-x-0 -top-[96px] mx-auto h-auto w-[140px] md:-top-[120px] md:w-[170px]"
        />
        <Tape color="pink" rotate={-20} className="absolute -start-6 -top-2 h-[30px] w-[110px]" />
        <Tape color="sky" rotate={24} className="absolute -end-3.5 -top-3.5 h-[30px] w-[120px]" />
        <h1 className="font-display text-h2 font-extrabold text-ink">{t.title}</h1>
        <p className="mt-4 text-lead text-muted">{t.text}</p>
        <ButtonPrimary href={`/${locale}`} className="mt-8">
          {t.cta}
        </ButtonPrimary>
      </div>
    </div>
  );
}
