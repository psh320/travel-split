import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DEFAULT_AVATAR_CONFIG, AVATAR_OPTIONS } from "../utils/avatars";
import type { AvatarConfig } from "../types";
import { AvatarIllustration } from "./AvatarIllustration";

const renderAvatar = (config: AvatarConfig) =>
  renderToStaticMarkup(<AvatarIllustration config={config} decorative />);

const expectCleanSvg = (markup: string) => {
  expect(markup).toContain("<svg");
  expect(markup).toContain('viewBox="0 0 128 128"');
  expect(markup).not.toContain("NaN");
  expect(markup).not.toContain("undefined");
  expect(markup).not.toContain("url(#");
  expect(markup).not.toContain("Gradient");
};

describe("AvatarIllustration", () => {
  it.each(AVATAR_OPTIONS.hairStyle)("renders the $id hair without broken SVG references", ({ id }) => {
    expectCleanSvg(renderAvatar({ ...DEFAULT_AVATAR_CONFIG, hairStyle: id }));
  });

  it.each(AVATAR_OPTIONS.eyeStyle)("renders the $id eyes", ({ id }) => {
    expectCleanSvg(renderAvatar({ ...DEFAULT_AVATAR_CONFIG, eyeStyle: id }));
  });

  it.each(AVATAR_OPTIONS.mouthStyle)("renders the $id mouth", ({ id }) => {
    expectCleanSvg(renderAvatar({ ...DEFAULT_AVATAR_CONFIG, mouthStyle: id }));
  });

  it.each(AVATAR_OPTIONS.accessory)("renders the $id accessory", ({ id }) => {
    expectCleanSvg(renderAvatar({ ...DEFAULT_AVATAR_CONFIG, accessory: id }));
  });
});
