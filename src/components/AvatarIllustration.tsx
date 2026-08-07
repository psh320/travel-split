import { useId } from "react";
import type { AvatarConfig } from "../types";
import { getOptionColor } from "../utils/avatars";

type AvatarIllustrationProps = {
  config: AvatarConfig;
  title?: string;
  decorative?: boolean;
  className?: string;
};

const faceShadow = (skin: string) => `color-mix(in srgb, ${skin} 84%, #7a3f2e)`;

export function AvatarIllustration({
  config,
  title = "Custom avatar",
  decorative = false,
  className = "",
}: AvatarIllustrationProps) {
  const rawId = useId().replace(/:/g, "");
  const clipId = `avatar-face-${rawId}`;
  const skin = getOptionColor("skinTone", config.skinTone);
  const hair = getOptionColor("hairColor", config.hairColor);
  const background = getOptionColor("background", config.background);
  const outfit = getOptionColor("outfit", config.outfit);
  const shadow = faceShadow(skin);
  const eye = "#2f292b";

  const renderHairBack = () => {
    switch (config.hairStyle) {
      case "bob":
        return <path d="M27 60C24 31 41 15 64 15s40 17 37 48v34H27Z" fill={hair} />;
      case "curls":
        return (
          <g fill={hair}>
            <circle cx="31" cy="54" r="15" /><circle cx="37" cy="34" r="16" />
            <circle cx="51" cy="23" r="17" /><circle cx="69" cy="21" r="17" />
            <circle cx="86" cy="29" r="17" /><circle cx="98" cy="47" r="15" />
            <circle cx="30" cy="74" r="12" /><circle cx="98" cy="71" r="12" />
          </g>
        );
      case "waves":
        return <path d="M25 66C22 37 37 15 62 14c27-1 44 20 42 54-1 14-7 27-16 35l-8-20 8-21c-8 8-15 12-25 12-11 0-22-5-30-14l10 24-7 20c-8-9-12-23-11-38Z" fill={hair} />;
      case "long":
        return <path d="M25 59C24 31 39 14 64 14s40 17 39 46l-4 53H83l-4-42H49l-4 42H29Z" fill={hair} />;
      case "bun":
        return (
          <g fill={hair}>
            <circle cx="64" cy="14" r="15" />
            <path d="M27 64C25 32 41 18 64 18s39 15 37 47L92 84H36Z" />
          </g>
        );
      default:
        return <path d="M28 57C29 30 44 17 65 17c23 0 36 16 35 43L89 51l-8-17-16 7-18-8-9 18Z" fill={hair} />;
    }
  };

  const renderHairFront = () => {
    switch (config.hairStyle) {
      case "bob":
        return <path d="M31 50c7-21 21-27 36-27 14 0 26 7 32 24-11 2-22-1-31-9-7 10-19 16-37 16Z" fill={hair} />;
      case "curls":
        return (
          <g fill={hair}>
            <circle cx="42" cy="38" r="11" /><circle cx="57" cy="32" r="12" />
            <circle cx="73" cy="32" r="12" /><circle cx="88" cy="40" r="11" />
          </g>
        );
      case "waves":
        return <path d="M31 48c8-19 20-26 35-26 13 0 25 7 33 22-9 2-16 0-23-5-6 9-15 11-23 7-7 8-14 10-22 8Z" fill={hair} />;
      case "long":
        return <path d="M31 53c4-20 16-30 34-30 15 0 28 8 34 27-13-1-22-6-29-15-8 11-20 18-39 18Z" fill={hair} />;
      case "bun":
        return <path d="M31 53c5-22 17-31 34-31 16 0 28 10 34 29-13 0-24-5-33-15-7 9-18 15-35 17Z" fill={hair} />;
      default:
        return <path d="M32 46c9-18 22-24 38-22 12 1 22 8 29 20-11-1-20-4-27-10-8 7-20 12-40 12Z" fill={hair} />;
    }
  };

  const renderEyes = () => {
    if (config.eyeStyle === "happy") {
      return <g fill="none" stroke={eye} strokeWidth="4" strokeLinecap="round"><path d="M43 62q6-8 12 0" /><path d="M73 62q6-8 12 0" /></g>;
    }
    if (config.eyeStyle === "sleepy") {
      return <g fill="none" stroke={eye} strokeWidth="3.5" strokeLinecap="round"><path d="M42 62q7 4 14 0" /><path d="M72 62q7 4 14 0" /></g>;
    }
    return (
      <g>
        <ellipse cx="49" cy="62" rx="9" ry="11" fill="#fff" />
        <ellipse cx="79" cy="62" rx="9" ry="11" fill="#fff" />
        <ellipse cx="50" cy="64" rx="4.5" ry="6" fill={eye} />
        <ellipse cx="78" cy="64" rx="4.5" ry="6" fill={eye} />
        {config.eyeStyle === "sparkle" && <g fill="#fff"><circle cx="51" cy="61" r="1.8" /><circle cx="79" cy="61" r="1.8" /></g>}
      </g>
    );
  };

  const renderNose = () => {
    if (config.noseStyle === "dot") return <circle cx="64" cy="75" r="3" fill={shadow} />;
    if (config.noseStyle === "triangle") return <path d="m64 69-5 10h10Z" fill={shadow} opacity=".82" />;
    if (config.noseStyle === "soft") return <path d="M63 69c-4 7-2 11 4 11" fill="none" stroke={shadow} strokeWidth="3" strokeLinecap="round" />;
    return <ellipse cx="64" cy="75" rx="5" ry="4" fill={shadow} opacity=".75" />;
  };

  const renderMouth = () => {
    const lip = faceShadow(skin);
    if (config.mouthStyle === "grin") return <path d="M51 85q13 14 26 0c-3 12-23 13-26 0Z" fill="#fff" stroke={lip} strokeWidth="2.5" strokeLinejoin="round" />;
    if (config.mouthStyle === "open") return <ellipse cx="64" cy="89" rx="8" ry="7" fill="#7f3d43" />;
    if (config.mouthStyle === "pout") return <path d="M58 90q6-5 12 0" fill="none" stroke={lip} strokeWidth="3" strokeLinecap="round" />;
    return <path d="M52 86q12 11 24 0" fill="none" stroke={lip} strokeWidth="3" strokeLinecap="round" />;
  };

  const renderAccessory = () => {
    switch (config.accessory) {
      case "glasses":
        return <g fill="none" stroke="#38343a" strokeWidth="2.5"><circle cx="49" cy="63" r="13" /><circle cx="79" cy="63" r="13" /><path d="M62 62h4M36 60l-8-3M92 60l8-3" /></g>;
      case "freckles":
        return <g fill={shadow} opacity=".75"><circle cx="43" cy="76" r="1.4" /><circle cx="48" cy="78" r="1.2" /><circle cx="52" cy="76" r="1.3" /><circle cx="76" cy="76" r="1.3" /><circle cx="81" cy="78" r="1.2" /><circle cx="85" cy="76" r="1.4" /></g>;
      case "blush":
        return <g fill="#ed7f78" opacity=".42"><ellipse cx="42" cy="77" rx="8" ry="4" /><ellipse cx="86" cy="77" rx="8" ry="4" /></g>;
      case "earrings":
        return <g fill="#f2ba38"><circle cx="29" cy="74" r="3" /><circle cx="99" cy="74" r="3" /></g>;
      case "star":
        return <path d="m91 34 2.3 4.7 5.2.8-3.8 3.6.9 5.2-4.6-2.5-4.6 2.5.9-5.2-3.8-3.6 5.2-.8Z" fill="#f2ba38" stroke="#fff" strokeWidth="1.2" />;
      default:
        return null;
    }
  };

  return (
    <svg
      className={`avatar-illustration ${className}`.trim()}
      viewBox="0 0 128 128"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
    >
      <rect width="128" height="128" rx="30" fill={background} />
      <circle cx="20" cy="24" r="14" fill="#fff" opacity=".18" />
      <circle cx="112" cy="112" r="22" fill="#fff" opacity=".16" />
      <path d="M21 128c3-23 17-35 43-35s40 12 43 35Z" fill={outfit} />
      {renderHairBack()}
      <g clipPath={`url(#${clipId})`}>
        <ellipse cx="64" cy="66" rx="36" ry="42" fill={skin} />
      </g>
      <defs><clipPath id={clipId}><ellipse cx="64" cy="66" rx="36" ry="42" /></clipPath></defs>
      <ellipse cx="28" cy="70" rx="8" ry="11" fill={skin} />
      <ellipse cx="100" cy="70" rx="8" ry="11" fill={skin} />
      {renderHairFront()}
      <path d="M42 49q7-5 14 0M72 49q7-5 14 0" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round" opacity=".82" />
      {renderEyes()}
      {renderNose()}
      {renderMouth()}
      {renderAccessory()}
    </svg>
  );
}
