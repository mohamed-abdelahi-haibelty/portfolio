/** Off-site links (wa.me) open in a new tab without leaking the opener or referrer. */
export function externalLinkProps(href: string): { target?: "_blank"; rel?: string } {
  return /^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
