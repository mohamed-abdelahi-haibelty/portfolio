import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArrowUpRightIcon } from "./ArrowUpRightIcon";
import { BoltIcon } from "./BoltIcon";
import { CloseIcon } from "./CloseIcon";
import { CodeIcon } from "./CodeIcon";
import { MagnifierIcon } from "./MagnifierIcon";
import { MailIcon } from "./MailIcon";
import { MenuIcon } from "./MenuIcon";
import { PhoneIcon } from "./PhoneIcon";
import { ShieldIcon } from "./ShieldIcon";
import { WhatsAppIcon } from "./WhatsAppIcon";

const icons = {
  ArrowUpRightIcon,
  BoltIcon,
  CloseIcon,
  CodeIcon,
  MagnifierIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  ShieldIcon,
  WhatsAppIcon,
};

describe("icons", () => {
  it.each(Object.entries(icons))("%s is decorative and not focusable", (_name, IconComponent) => {
    const { container } = render(<IconComponent />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).toHaveAttribute("stroke", "currentColor");
  });
});
