"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { MenuIcon } from "@/components/icons/MenuIcon";

export type MenuLink = { href: `#${string}`; label: string };

type MobileMenuProps = {
  /** `nav.menu`: names the menu button, the sheet and its close button. */
  label: string;
  links: readonly MenuLink[];
  cta: MenuLink;
};

/**
 * The language switch keeps the section: copy the current `#hash` onto every
 * `[data-keep-hash]` link (on load and on every hash change). Without
 * JavaScript the switch still works and opens the top of the other locale.
 */
function useKeepHashOnLanguageLinks() {
  useEffect(() => {
    function sync() {
      for (const link of document.querySelectorAll<HTMLAnchorElement>("a[data-keep-hash]")) {
        const path = link.getAttribute("href")?.split("#")[0] ?? "";
        link.setAttribute("href", `${path}${window.location.hash}`);
      }
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
    };
  }, []);
}

/** Jump to a section after the sheet has closed (and the page scroll is unlocked). */
function goTo(hash: string) {
  if (window.location.hash === hash) {
    document.getElementById(hash.slice(1))?.scrollIntoView();
  } else {
    window.location.hash = hash;
  }
}

const buttonClass =
  "relative grid size-10 place-items-center rounded-xl border-2 border-ink bg-white text-ink before:absolute before:-inset-0.5";

/**
 * Under 768px: a menu button opening a sheet with the section links and the
 * call to action. Modal: focus is trapped, Escape closes it, focus returns to
 * the button. The only Client Component of the site.
 */
export function MobileMenu({ label, links, cta }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pendingHash = useRef<string | null>(null);
  useKeepHashOnLanguageLinks();

  function follow(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    pendingHash.current = href;
    setOpen(false);
  }

  function onOpenChangeComplete(isOpen: boolean) {
    const hash = pendingHash.current;
    if (isOpen || hash === null) return;
    pendingHash.current = null;
    goTo(hash);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} onOpenChangeComplete={onOpenChangeComplete}>
      <Dialog.Trigger aria-label={label} className={buttonClass}>
        <MenuIcon size={22} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-ink/40 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:transition-opacity motion-safe:duration-200" />
        <Dialog.Popup className="fixed inset-y-0 end-0 z-50 flex w-[min(20rem,88vw)] flex-col gap-8 overflow-y-auto border-s-3 border-ink paper px-5 pt-[22px] pb-8 text-ink data-ending-style:translate-x-full data-starting-style:translate-x-full motion-safe:transition-transform motion-safe:duration-200">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-hand text-hand font-bold text-pen">{label}</Dialog.Title>
            <Dialog.Close aria-label={label} aria-expanded="true" className={buttonClass}>
              <CloseIcon size={22} />
            </Dialog.Close>
          </div>
          <nav>
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => {
                      follow(event, link.href);
                    }}
                    className="block py-2.5 font-display text-[1.625rem] leading-tight font-extrabold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={cta.href}
            onClick={(event) => {
              follow(event, cta.href);
            }}
            className="flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3 text-base font-bold text-white"
          >
            {cta.label}
          </a>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
