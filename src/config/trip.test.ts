import { describe, expect, it } from "vitest";
import {
  getAvailableMemberColorIndex,
  getMemberAccentColor,
  MAX_TRIP_PARTICIPANTS,
  MEMBER_ACCENT_COLORS,
  normalizeMemberColorIndex,
} from "./trip";

describe("trip member colors", () => {
  it("keeps the member limit aligned with the palette", () => {
    expect(MAX_TRIP_PARTICIPANTS).toBe(8);
    expect(MEMBER_ACCENT_COLORS).toHaveLength(MAX_TRIP_PARTICIPANTS);
  });

  it("uses the participant position for legacy members without a color", () => {
    expect(normalizeMemberColorIndex(undefined, 3)).toBe(3);
    expect(getMemberAccentColor(undefined, 3)).toBe(MEMBER_ACCENT_COLORS[3]);
  });

  it("reuses the first open color after a member is removed", () => {
    const participants = [0, 1, 3].map((colorIndex) => ({ colorIndex }));
    expect(getAvailableMemberColorIndex(participants)).toBe(2);
  });
});
