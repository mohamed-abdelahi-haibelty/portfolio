type LogoMarkProps = {
  size: number;
  className?: string;
};

/** The sketched developer on an ink rounded square. Decorative: the wordmark carries the name. */
export function LogoMark({ size, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="48" height="48" rx="11" className="fill-ink" />
      <g
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white"
      >
        <circle cx="21" cy="19" r="8.5" />
        <path d="M12.8 16.6 C14.4 9.6 26 8.6 29 15.4" />
        <path d="M18.2 21.6 q2.8 2 5.6 0" />
        <path d="M8.5 41 C9.5 33.5 14.5 30 21 30 C24.5 30 27 31 29 32.6" />
      </g>
      <circle cx="17.8" cy="17.6" r="1.1" className="fill-white" />
      <circle cx="24.2" cy="17.6" r="1.1" className="fill-white" />
      <path
        d="M25.5 41 L29.5 32.5 H40.5 L36.5 41 Z"
        strokeWidth="2.2"
        strokeLinejoin="round"
        className="fill-lime stroke-white"
      />
    </svg>
  );
}
