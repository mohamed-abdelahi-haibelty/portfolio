import type { Dictionary } from "./types";

// French typography: U+00A0 (no-break space) before ? ! : and inside "100 %".
export const fr = {
  site: {
    name: "abdellahi.dev",
    person: "Mohamed Abdellahi Haibelty",
  },
  logo: {
    text: "abdellahi.dev",
  },
  skip: "Aller au contenu",
  nav: {
    guarantees: "Ce que je garantis",
    method: "Méthode",
    contact: "Contact",
    cta: "Parlons-en ↗",
    menu: "Menu",
    language: "Langue",
    switchTo: "Version anglaise",
  },
  hero: {
    hello: "salut, moi c’est Mohamed Abdellahi !",
    title: {
      start: "Je construis des apps web ",
      highlight: "sûres",
      afterHighlight: ", ",
      circle: "rapides",
      afterCircle: " et ",
      wavy: "faciles à trouver",
      end: ".",
    },
    lead: "Sécurité, performance, référencement, code propre : je m’occupe de tout. Vous, vous gardez l’esprit tranquille.",
    ctaPrimary: "Parlons de votre projet",
    ctaWhatsapp: "WhatsApp",
    fig: "fig. 1 — moi, au travail",
    notes: ["sécurisé ✓", "rapide ✓", "propre ✓"],
    sticker: "100 % sur mesure !",
    characterAlt: "Mohamed Abdellahi au travail sur son ordinateur, dessiné au trait",
  },
  badge: {
    header: "PASS DÉVELOPPEUR",
    name: "Mohamed Abdellahi",
    role: "Développeur web · Nouakchott",
    tags: ["SÉCURITÉ", "VITESSE", "SEO"],
  },
  ideas: {
    title: { before: "Des idées en vrac ? ", highlight: "J’en fais un vrai projet." },
    lead: "Des idées pas encore organisées, un besoin encore flou ? Pas de souci : on les pose ensemble, je les mets en ordre et j’en fais un projet concret, prêt à servir.",
    scraps: [
      "une appli pour mes clients… ?",
      "un site ? une appli ?",
      "il faudrait que ça marche aussi sur téléphone",
      "paiement en ligne ??",
      "?!",
    ],
    arrow: "je trie, je clarifie, je structure",
    windowLabel: "votre projet",
    result: [
      "Des besoins clairs, écrits noir sur blanc",
      "Un plan et des maquettes validés ensemble",
      "Une application en ligne, qui marche",
    ],
    done: "un vrai projet ✓",
  },
  guarantees: {
    title: "Ce que je garantis",
    note: "— à main levée, mais promis tenu",
    items: [
      {
        title: "Sécurité",
        text: "Données protégées, connexions sûres, failles connues fermées dès la conception.",
      },
      {
        title: "Performance",
        text: "Des pages qui s’ouvrent vite, même sur un téléphone et une connexion faible.",
      },
      {
        title: "Référencement",
        text: "Bien structuré pour Google : on vous trouve, on vous clique.",
      },
      {
        title: "Code propre",
        text: "Clair, testé, documenté : facile à faire évoluer, sans mauvaise surprise.",
      },
    ],
  },
  method: {
    title: "Comment on travaille",
    note: "— sans prise de tête ↓",
    steps: [
      {
        title: "On discute",
        text: "Vous m’expliquez votre idée. C’est gratuit et sans engagement.",
      },
      {
        title: "Je propose un plan",
        text: "Ce qu’on construit, en combien de temps, pour quel prix. Clair.",
      },
      { title: "Je construis", text: "Vous suivez l’avancement à chaque étape, sans jargon." },
      {
        title: "En ligne !",
        text: "Votre site est publié, rapide et sûr. Et je reste disponible.",
      },
    ],
  },
  contact: {
    title: { before: "Un projet en tête ? ", highlight: "Parlons-en." },
    note: "promis, je ne mords pas →",
    whatsapp: { label: "WhatsApp", message: "Bonjour Mohamed, j’ai un projet en tête :" },
    phone: { label: "Téléphone" },
    email: { label: "E-mail" },
  },
  footer: {
    copyright: "© {year} Mohamed Abdellahi Haibelty",
    domain: "abdellahi.dev",
  },
  notFound: {
    title: "Oups, cette page s’est perdue.",
    text: "Pas de panique, l’accueil est juste là.",
    cta: "Retour à l’accueil",
  },
  seo: {
    title: "Mohamed Abdellahi — Développeur web : apps sûres, rapides et bien référencées",
    description:
      "Développeur web à Nouakchott. Je transforme vos idées, même en vrac, en applications web sûres, rapides et faciles à trouver sur Google. Parlons de votre projet.",
    ogAlt: "Mohamed Abdellahi, développeur web — abdellahi.dev",
    jobTitle: "Développeur web",
  },
} satisfies Dictionary;
