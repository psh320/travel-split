import type { CSSProperties } from "react";
import type { User } from "../types";
import { getMemberAccentColor } from "../config/trip";
import { getAvatarConfig } from "../utils/avatars";
import { AvatarIllustration } from "./AvatarIllustration";

type AvatarProps = {
  user: Pick<User, "id" | "name" | "colorIndex" | "avatarId" | "avatarConfig">;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  decorative?: boolean;
  memberAccent?: boolean;
};

export function Avatar({
  user,
  size = "md",
  className = "",
  decorative = false,
  memberAccent = false,
}: AvatarProps) {
  const config = getAvatarConfig(user);
  const memberColorStyle =
    !memberAccent || user.colorIndex === undefined
      ? undefined
      : ({
          "--member-accent-color": getMemberAccentColor(user.colorIndex),
        } as CSSProperties);

  return (
    <span
      className={`avatar avatar-${size}${
        memberAccent ? " avatar-member-accent" : ""
      } ${className}`.trim()}
      style={memberColorStyle}
    >
      <AvatarIllustration
        config={config}
        title={`${user.name} avatar`}
        decorative={decorative}
      />
    </span>
  );
}
