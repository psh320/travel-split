import type { User } from "../types";
import { getAvatar, getAvatarConfig } from "../utils/avatars";
import { AvatarIllustration } from "./AvatarIllustration";

type AvatarProps = {
  user: Pick<User, "id" | "name" | "avatarId" | "avatarConfig">;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  decorative?: boolean;
  eager?: boolean;
  presetArt?: boolean;
};

export function Avatar({
  user,
  size = "md",
  className = "",
  decorative = false,
  eager = false,
  presetArt = false,
}: AvatarProps) {
  const config = getAvatarConfig(user);
  const preset = getAvatar(user);

  return (
    <span
      className={`avatar avatar-${size} ${className}`.trim()}
    >
      {presetArt && !user.avatarConfig ? (
        <img
          src={preset.src}
          alt={decorative ? "" : `${user.name} avatar`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <AvatarIllustration
          config={config}
          title={`${user.name} avatar`}
          decorative={decorative}
        />
      )}
    </span>
  );
}
