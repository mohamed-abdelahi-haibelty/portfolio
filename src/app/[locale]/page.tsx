import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/content";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <main>
      <h1>{dict.seo.title}</h1>
    </main>
  );
}
