import type { Dictionary } from "./types";

// French typography: U+00A0 (no-break space) before ? ! : and inside "100 %".
export const fr = {
  site: {
    name: "abdellahi.dev",
    person: "Mohamed Abdellahi Haibelty",
  },
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
  contact: {
    title: { before: "Un projet en tête ? ", highlight: "Parlons-en." },
    note: "promis, je ne mords pas →",
    whatsapp: { label: "WhatsApp", message: "Bonjour Mohamed, j’ai un projet en tête :" },
    phone: { label: "Téléphone" },
    email: { label: "E-mail" },
  },
  seo: {
    title: "Mohamed Abdellahi — Développeur web : apps sûres, rapides et bien référencées",
  },
} satisfies Dictionary;
