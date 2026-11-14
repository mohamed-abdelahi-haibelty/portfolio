import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/content";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <main className="mx-auto max-w-288 px-5 py-16 md:px-16">
      <h1 className="font-display text-h1 font-extrabold">{dict.seo.title}</h1>
    </main>
  );
}
