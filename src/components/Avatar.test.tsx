import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";

const user = {
  id: "member-a",
  name: "Member A",
  colorIndex: 1,
};

describe("Avatar", () => {
  it("uses the brand border by default", () => {
    const markup = renderToStaticMarkup(<Avatar user={user} decorative />);

    expect(markup).toContain('class="avatar avatar-md');
    expect(markup).not.toContain("avatar-member-accent");
    expect(markup).not.toContain("--member-accent-color");
  });

  it("adds the member color only when requested", () => {
    const markup = renderToStaticMarkup(
      <Avatar user={user} decorative memberAccent />
    );

    expect(markup).toContain("avatar-member-accent");
    expect(markup).toContain("--member-accent-color:#5F7EA8");
  });
});
