import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShieldIcon } from "../icons/ShieldIcon";
import { HandArrow } from "./HandArrow";
import { HandNote } from "./HandNote";
import { Highlight } from "./Highlight";
import { MarkerTitle } from "./MarkerTitle";
import { PenCircle } from "./PenCircle";
import { Pin } from "./Pin";
import { Scrap } from "./Scrap";
import { Sticker } from "./Sticker";
import { StickyNote } from "./StickyNote";
import { Tape } from "./Tape";
import { WavyUnderline } from "./WavyUnderline";

describe("decorative paper components are hidden from assistive technology", () => {
  it.each([
    ["Pin", <Pin key="pin" />],
    ["Tape without text", <Tape key="tape" />],
    ["HandArrow", <HandArrow key="arrow" />],
    ["HandArrow down", <HandArrow key="down" variant="down" />],
  ])("%s", (_name, element) => {
    const { container } = render(element);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("PenCircle keeps the word readable and hides only the drawn ellipse", () => {
    const { container } = render(<PenCircle>rapides</PenCircle>);
    expect(container).toHaveTextContent("rapides");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("StickyNote hides its pin and icon but exposes the title and text", () => {
    render(
      <StickyNote
        title="Sécurité"
        text="Données protégées."
        icon={<ShieldIcon />}
        color="highlight"
        rotate={-3}
      />,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Sécurité" })).toBeInTheDocument();
    expect(screen.getByText("Données protégées.")).toBeVisible();
    for (const hidden of document.querySelectorAll("[aria-hidden]")) {
      expect(hidden).toHaveAttribute("aria-hidden", "true");
    }
    expect(document.querySelectorAll("[aria-hidden='true']")).toHaveLength(2);
  });
});

describe("text-bearing paper components keep their text accessible", () => {
  it("MarkerTitle renders a real h2", () => {
    render(<MarkerTitle id="guarantees">Ce que je garantis</MarkerTitle>);
    const heading = screen.getByRole("heading", { level: 2, name: "Ce que je garantis" });
    expect(heading).toHaveAttribute("id", "guarantees");
  });

  it.each([
    ["Tape with text", <Tape key="t">salut !</Tape>],
    ["Highlight", <Highlight key="h">salut !</Highlight>],
    ["WavyUnderline", <WavyUnderline key="w">salut !</WavyUnderline>],
    ["HandNote", <HandNote key="n">salut !</HandNote>],
    ["Scrap", <Scrap key="s">salut !</Scrap>],
    ["Sticker", <Sticker key="k" text="salut !" />],
  ])("%s", (_name, element) => {
    const { container } = render(element);
    expect(screen.getByText("salut !")).toBeVisible();
    expect(container.querySelector("[aria-hidden]")).toBeNull();
  });
});

describe("Sticker", () => {
  it.each([
    ["100\u00a0% sur mesure\u00a0!", "100\u00a0%<br>sur mesure\u00a0!"],
    ["100\u00a0% tailor-made!", "100\u00a0%<br>tailor-made!"],
    ["sur mesure", "sur mesure"],
  ])("puts the figure of %j on its own line", (text, html) => {
    const { container } = render(<Sticker text={text} />);
    expect(
      container.firstElementChild?.firstElementChild?.innerHTML.replaceAll("&nbsp;", "\u00a0"),
    ).toBe(html);
  });
});
