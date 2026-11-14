import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { ButtonSecondary } from "@/components/ButtonSecondary";
import { ContactRow } from "@/components/ContactRow";
import { IdeasWindow } from "@/components/IdeasWindow";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Logo } from "@/components/brand/Logo";
import { SketchDev } from "@/components/character/SketchDev";
import { ArrowUpRightIcon } from "@/components/icons/ArrowUpRightIcon";
import { BoltIcon } from "@/components/icons/BoltIcon";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { CodeIcon } from "@/components/icons/CodeIcon";
import { MagnifierIcon } from "@/components/icons/MagnifierIcon";
import { MailIcon } from "@/components/icons/MailIcon";
import { MenuIcon } from "@/components/icons/MenuIcon";
import { PhoneIcon } from "@/components/icons/PhoneIcon";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { HandArrow } from "@/components/paper/HandArrow";
import { HandNote } from "@/components/paper/HandNote";
import { Highlight } from "@/components/paper/Highlight";
import { MarkerTitle } from "@/components/paper/MarkerTitle";
import { PenCircle } from "@/components/paper/PenCircle";
import { Pin } from "@/components/paper/Pin";
import { Scrap } from "@/components/paper/Scrap";
import { Sticker } from "@/components/paper/Sticker";
import { StickyNote } from "@/components/paper/StickyNote";
import { Tape } from "@/components/paper/Tape";
import { WavyUnderline } from "@/components/paper/WavyUnderline";
import { getDictionary, isLocale } from "@/content";
import { contactLinks } from "@/lib/contact";
import { isGalleryEnabled } from "@/lib/site";
import { DevBadge } from "@/sections/DevBadge";

/*
 * Component gallery for visual checks. Not part of the site: it returns 404 on
 * Vercel production, is noindex, and is left out of the sitemap. Section
 * labels are component names (developer labels); every other word comes from
 * the dictionaries.
 */

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function Specimen({ name, children }: { name: string; children: ReactNode }) {
  const id = `gallery-${name.toLowerCase()}`;
  return (
    <section aria-labelledby={id} className="border-t-2 border-dashed border-ink/30 py-10">
      <h2
        id={id}
        lang="en"
        className="mb-6 font-sans text-label font-semibold text-muted uppercase"
      >
        {name}
      </h2>
      {children}
    </section>
  );
}

const icons = [
  ShieldIcon,
  BoltIcon,
  MagnifierIcon,
  CodeIcon,
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
  ArrowUpRightIcon,
  MenuIcon,
  CloseIcon,
];

const noteIcons = [ShieldIcon, BoltIcon, MagnifierIcon, CodeIcon];
const noteColors = ["highlight", "sky", "pink", "lime"] as const;
const noteRotations = [-3, 2, -1.5, 3];
const scrapColors = ["highlight", "sky", "pink", "lime", "white"] as const;
const scrapRotations = [-6, 5, 3, -4, 8];

export default async function GalleryPage({ params }: PageProps<"/[locale]/_gallery">) {
  if (!isGalleryEnabled({ VERCEL_ENV: process.env.VERCEL_ENV })) notFound();
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const links = contactLinks(t.contact.whatsapp.message);

  return (
    <main className="mx-auto max-w-288 overflow-x-clip px-5 py-10 md:px-16">
      <h1 className="mb-10 font-display text-h2 font-extrabold">{t.site.name}</h1>

      <Specimen name="Logo">
        <div className="flex flex-wrap items-center gap-10">
          <Logo name={t.site.name} />
          <Logo name={t.site.name} variant="footer" />
        </div>
      </Specimen>

      <Specimen name="SketchDev">
        <div className="flex flex-wrap items-end gap-10">
          <SketchDev alt={t.hero.characterAlt} width={290} />
          <SketchDev alt={t.hero.characterAlt} width={170} accent="highlight" />
          <SketchDev alt={t.hero.characterAlt} width={110} />
        </div>
      </Specimen>

      <Specimen name="Icons">
        <div className="flex flex-wrap gap-4">
          {icons.map((IconComponent) => (
            <span
              key={IconComponent.name}
              className="grid size-12 place-items-center rounded-tile border-[2.5px] border-ink"
            >
              <IconComponent size={26} />
            </span>
          ))}
        </div>
      </Specimen>

      <Specimen name="Highlight · PenCircle · WavyUnderline">
        <p className="max-w-150 font-display text-h1 font-extrabold">
          {t.hero.title.start}
          <Highlight>{t.hero.title.highlight}</Highlight>
          {t.hero.title.afterHighlight}
          <PenCircle>{t.hero.title.circle}</PenCircle>
          {t.hero.title.afterCircle}
          <WavyUnderline>{t.hero.title.wavy}</WavyUnderline>
          {t.hero.title.end}
        </p>
        <p className="mt-8 font-display text-h2 font-extrabold">
          {t.ideas.title.before}
          <Highlight color="highlight">{t.ideas.title.highlight}</Highlight>
        </p>
      </Specimen>

      <Specimen name="MarkerTitle">
        <div className="flex flex-col items-start gap-8">
          <MarkerTitle>{t.guarantees.title}</MarkerTitle>
          <MarkerTitle color="sky" rotate={1.5}>
            {t.guarantees.title}
          </MarkerTitle>
        </div>
      </Specimen>

      <Specimen name="Tape">
        <div className="flex flex-wrap items-center gap-10">
          <Tape>{t.hero.hello}</Tape>
          <Tape className="h-[30px] w-[120px]" color="pink" rotate={-20} />
          <Tape className="h-[30px] w-[130px]" color="sky" rotate={24} />
          <Tape className="h-[30px] w-[130px]" />
        </div>
      </Specimen>

      <Specimen name="Pin">
        <div className="flex gap-6">
          <Pin />
          <Pin color="pin-pink" />
        </div>
      </Specimen>

      <Specimen name="StickyNote">
        <div className="grid gap-x-8 gap-y-10 pt-2 md:grid-cols-2 lg:grid-cols-4">
          {t.guarantees.items.map((item, index) => {
            const NoteIcon = noteIcons[index] ?? ShieldIcon;
            return (
              <StickyNote
                key={item.title}
                title={item.title}
                text={item.text}
                icon={<NoteIcon size={26} />}
                color={noteColors[index] ?? "highlight"}
                rotate={noteRotations[index] ?? 0}
                pin={index % 2 === 0 ? "pen" : "pin-pink"}
              />
            );
          })}
        </div>
      </Specimen>

      <Specimen name="HandNote">
        <div className="flex flex-wrap items-start gap-10">
          <HandNote rotate={6}>{t.hero.fig}</HandNote>
          <div className="flex flex-col gap-3">
            {t.hero.notes.map((note, index) => (
              <HandNote key={note} color="ink" rotate={[-4, 3, -2][index] ?? 0}>
                {note}
              </HandNote>
            ))}
          </div>
          <HandNote>{t.guarantees.note}</HandNote>
          <HandNote>{t.contact.note}</HandNote>
        </div>
      </Specimen>

      <Specimen name="HandArrow">
        <div className="flex flex-wrap items-center gap-10">
          <HandArrow />
          <HandArrow variant="down" />
          <HandArrow variant="diagonal" />
          <HandArrow variant="left" color="ink" />
        </div>
      </Specimen>

      <Specimen name="Scrap">
        <div className="flex flex-wrap items-start gap-x-4 gap-y-5">
          {t.ideas.scraps.map((scrap, index) => (
            <Scrap
              key={scrap}
              color={scrapColors[index] ?? "highlight"}
              rotate={scrapRotations[index] ?? 0}
            >
              {scrap}
            </Scrap>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <HandArrow variant="down" />
          <HandNote className="text-lg md:text-[22px]">{t.ideas.arrow}</HandNote>
        </div>
      </Specimen>

      <Specimen name="Sticker">
        <Sticker text={t.hero.sticker} />
      </Specimen>

      <Specimen name="DevBadge">
        <DevBadge {...t.badge} characterAlt={t.hero.characterAlt} />
      </Specimen>

      <Specimen name="ContactRow">
        <div
          data-testid="contact-block"
          className="max-w-[600px] rounded-block border-3 border-ink bg-white p-5 shadow-hard-lg md:p-8"
        >
          <div className="flex flex-col gap-3">
            <ContactRow
              href={links.whatsapp.href}
              label={t.contact.whatsapp.label}
              value={links.whatsapp.display}
              icon={<WhatsAppIcon size={22} strokeWidth={2} />}
            />
            <ContactRow
              href={links.phone.href}
              label={t.contact.phone.label}
              value={links.phone.display}
              icon={<PhoneIcon size={22} strokeWidth={2} />}
            />
            <ContactRow
              href={links.email.href}
              label={t.contact.email.label}
              value={links.email.display}
              icon={<MailIcon size={22} strokeWidth={2} />}
            />
          </div>
        </div>
      </Specimen>

      <Specimen name="IdeasWindow">
        <div className="max-w-[426px]">
          <IdeasWindow label={t.ideas.windowLabel} items={t.ideas.result} />
          <HandNote className="mt-4 text-end">{t.ideas.done}</HandNote>
        </div>
      </Specimen>

      <Specimen name="LanguageSwitch">
        <LanguageSwitch locale={locale} hash="#contact" labels={t.nav} />
      </Specimen>

      <Specimen name="ButtonPrimary · ButtonSecondary">
        <div className="flex flex-col gap-3.5 sm:flex-row">
          <ButtonPrimary href="#contact">{t.hero.ctaPrimary}</ButtonPrimary>
          <ButtonSecondary href={links.whatsapp.href}>{t.hero.ctaWhatsapp}</ButtonSecondary>
        </div>
      </Specimen>
    </main>
  );
}
