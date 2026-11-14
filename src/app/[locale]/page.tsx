import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/content";
import { whatsappHref } from "@/lib/contact";
import { Contact } from "@/sections/Contact";
import { Guarantees } from "@/sections/Guarantees";
import { Hero } from "@/sections/Hero";
import { Ideas } from "@/sections/Ideas";
import { Method } from "@/sections/Method";
import { SiteFooter } from "@/sections/SiteFooter";
import { SiteHeader } from "@/sections/SiteHeader";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} name={dict.logo.text} skip={dict.skip} t={dict.nav} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero
          t={dict.hero}
          badge={dict.badge}
          whatsappHref={whatsappHref(dict.contact.whatsapp.message)}
        />
        <Ideas t={dict.ideas} />
        <Guarantees t={dict.guarantees} />
        <Method t={dict.method} />
        <Contact t={dict.contact} characterAlt={dict.hero.characterAlt} />
      </main>
      <SiteFooter t={dict.footer} year={new Date().getFullYear()} />
    </>
  );
}
