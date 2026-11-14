import type { Locale } from "./site";

/** Paths under `/en` get the English 404; everything else the French one. */
const ENGLISH_PATH = /^\/en(?:\/|$)/;

export function notFoundLocale(pathname: string): Locale {
  return ENGLISH_PATH.test(pathname) ? "en" : "fr";
}

/**
 * The 404 is one static document (French by default). This inline script,
 * run in <head> before the first paint, switches it to English under `/en`:
 * `<html lang>` decides which copy the CSS shows, and the title follows
 * (kept English with an observer: hydration writes the French title back).
 */
export function notFoundLocaleScript(englishTitle: string): string {
  const title = JSON.stringify(englishTitle).replace(/</g, "\\u003c");
  return `if(${ENGLISH_PATH.toString()}.test(location.pathname)){var d=document,f=function(){if(d.title!==${title})d.title=${title}};d.documentElement.lang="en";f();new MutationObserver(f).observe(d.head,{subtree:true,childList:true,characterData:true})}`;
}
