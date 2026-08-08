import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const rootMarkup = indexHtml.match(
  /<div id="root">([\s\S]*?)<\/div>\s*<script type="module"/
)?.[1];

describe("initial document", () => {
  it("shows the app loading skeleton before React starts", () => {
    expect(rootMarkup).toContain('data-initial-loader="true"');
    expect(rootMarkup).not.toContain(
      "Split expenses with a clear, verifiable settlement"
    );
  });

  it("keeps the static explanatory content for browsers without JavaScript", () => {
    const noScriptMarkup = indexHtml.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1];

    expect(noScriptMarkup).toContain(
      "Split expenses with a clear, verifiable settlement"
    );
  });
});
