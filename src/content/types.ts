/** Text with a highlighted part, rendered with `<Highlight>`. */
export type HighlightedText = {
  before: string;
  highlight: string;
};

export type Dictionary = {
  site: {
    name: string;
    person: string;
  };
  logo: {
    text: string;
  };
  /** Skip link text. */
  skip: string;
  nav: {
    guarantees: string;
    method: string;
    contact: string;
    cta: string;
    menu: string;
    language: string;
    switchTo: string;
  };
  hero: {
    hello: string;
    /** H1 split around its three effects: highlight, pen circle, wavy underline. */
    title: {
      start: string;
      highlight: string;
      afterHighlight: string;
      circle: string;
      afterCircle: string;
      wavy: string;
      end: string;
    };
    lead: string;
    ctaPrimary: string;
    ctaWhatsapp: string;
    fig: string;
    notes: [string, string, string];
    sticker: string;
    characterAlt: string;
  };
  badge: {
    header: string;
    name: string;
    role: string;
    tags: [string, string, string];
  };
  ideas: {
    title: HighlightedText;
    lead: string;
    scraps: [string, string, string, string, string];
    arrow: string;
    windowLabel: string;
    result: [string, string, string];
    done: string;
  };
  guarantees: {
    title: string;
    note: string;
    items: [GuaranteeItem, GuaranteeItem, GuaranteeItem, GuaranteeItem];
  };
  method: {
    title: string;
    note: string;
    steps: [MethodStep, MethodStep, MethodStep, MethodStep];
  };
  contact: {
    title: HighlightedText;
    note: string;
    whatsapp: { label: string; message: string };
    phone: { label: string };
    email: { label: string };
  };
  footer: {
    /** `{year}` is replaced with the build year. */
    copyright: string;
    domain: string;
  };
  notFound: {
    title: string;
    text: string;
    cta: string;
  };
  seo: {
    title: string;
    description: string;
    ogAlt: string;
    jobTitle: string;
  };
};

export type MethodStep = {
  title: string;
  text: string;
};

export type GuaranteeItem = {
  title: string;
  text: string;
};
