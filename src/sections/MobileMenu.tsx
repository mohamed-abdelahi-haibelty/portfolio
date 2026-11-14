"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
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

/** Jump to a section (the sheet is closed and the page scroll unlocked). */
function goTo(hash: string) {
  if (window.location.hash === hash) {
    document.getElementById(hash.slice(1))?.scrollIntoView();
  } else {
    window.location.hash = hash;
  }
}

function lockPageScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

const buttonClass =
  "relative grid size-10 place-items-center rounded-xl border-2 border-ink bg-white text-ink before:absolute before:-inset-0.5";

/**
 * Under 768px: a menu button opening a sheet with the section links and the
 * call to action. A native modal `<dialog>`: the page behind is inert, Escape
 * closes it and focus returns to the button; Tab wraps inside the sheet.
 * The only Client Component of the site.
 */
export function MobileMenu({ label, links, cta }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useKeepHashOnLanguageLinks();

  function show() {
    dialog.current?.showModal();
    lockPageScroll(true);
    setOpen(true);
  }

  function hide() {
    dialog.current?.close();
  }

  /** Fires for every way of closing: close button, Escape, backdrop, a link. */
  function onClose() {
    lockPageScroll(false);
    setOpen(false);
  }

  function follow(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    hide();
    lockPageScroll(false);
    goTo(href);
  }

  /** A click on the backdrop lands on the dialog element, outside its box. */
  function onDialogClick(event: MouseEvent<HTMLDialogElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const inside =
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom;
    if (event.target === event.currentTarget && !inside) hide();
  }

  /** Keep Tab inside the sheet (a modal dialog would otherwise let it reach the browser UI). */
  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const focusable = [
      ...event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    ];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={show}
        className={buttonClass}
      >
        <MenuIcon size={22} />
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onClose={onClose}
        onClick={onDialogClick}
        onKeyDown={onKeyDown}
        className="fixed inset-y-0 start-auto end-0 m-0 h-dvh max-h-none w-[min(20rem,88vw)] max-w-none translate-x-full overflow-y-auto border-0 border-s-3 border-ink paper px-5 pt-[22px] pb-8 text-ink backdrop:bg-ink/40 open:translate-x-0 motion-safe:transition-[translate,display,overlay] motion-safe:transition-discrete motion-safe:duration-200 starting:open:translate-x-full"
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 id={titleId} className="font-hand text-hand font-bold text-pen">
              {label}
            </h2>
            <button
              type="button"
              aria-label={label}
              aria-expanded="true"
              onClick={hide}
              className={buttonClass}
            >
              <CloseIcon size={22} />
            </button>
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
        </div>
      </dialog>
    </>
  );
}
