import { useId } from "react";
import type { AvatarConfig } from "../types";
import { getOptionColor } from "../utils/avatars";

type AvatarIllustrationProps = {
  config: AvatarConfig;
  title?: string;
  decorative?: boolean;
  className?: string;
};

const mix = (color: string, amount: number, withColor: string) =>
  `color-mix(in srgb, ${color} ${amount}%, ${withColor})`;

export function AvatarIllustration({
  config,
  title = "Custom avatar",
  decorative = false,
  className = "",
}: AvatarIllustrationProps) {
  const rawId = useId().replace(/:/g, "");
  const backgroundId = `avatar-background-${rawId}`;
  const faceId = `avatar-face-${rawId}`;
  const hairId = `avatar-hair-${rawId}`;
  const outfitId = `avatar-outfit-${rawId}`;
  const skin = getOptionColor("skinTone", config.skinTone);
  const hair = getOptionColor("hairColor", config.hairColor);
  const background = getOptionColor("background", config.background);
  const outfit = getOptionColor("outfit", config.outfit);
  const skinShadow = mix(skin, 82, "#80452f");
  const skinHighlight = mix(skin, 88, "#fff7ee");
  const hairShadow = mix(hair, 76, "#1d171a");
  const hairHighlight = mix(hair, 82, "#dba786");
  const outfitShadow = mix(outfit, 82, "#35506c");
  const eye = "#31282a";

  const renderHairBack = () => {
    switch (config.hairStyle) {
      case "bob":
        return (
          <g>
            <path d="M24 61C23 31 40 13 64 13s42 18 40 49l3 16c3 17-6 29-20 33l-5-17H46l-5 17C26 106 18 94 22 78Z" fill={`url(#${hairId})`} />
            <path d="M28 74c2 18 11 28 26 31-12 1-21-2-27-10-5-7-5-14 1-21Zm72 0c-2 18-11 28-26 31 12 1 21-2 27-10 5-7 5-14-1-21Z" fill={hairShadow} opacity=".48" />
          </g>
        );
      case "crop":
        return <path d="M28 57C28 29 43 15 65 15c23 0 37 16 35 44l-9-8-5-16-20 4-18-7-10 19Z" fill={`url(#${hairId})`} />;
      case "curls":
        return (
          <g fill={`url(#${hairId})`}>
            <circle cx="26" cy="56" r="14" /><circle cx="31" cy="38" r="15" />
            <circle cx="43" cy="25" r="16" /><circle cx="59" cy="19" r="17" />
            <circle cx="76" cy="21" r="17" /><circle cx="91" cy="30" r="16" />
            <circle cx="101" cy="45" r="15" /><circle cx="102" cy="63" r="13" />
            <circle cx="27" cy="74" r="11" /><circle cx="101" cy="77" r="11" />
          </g>
        );
      case "waves":
        return (
          <g>
            <path d="M23 65C21 34 38 13 63 13c28 0 45 21 43 55-1 19-7 34-18 44l-9-22 8-24c-8 8-15 12-24 12-11 0-21-5-30-14l9 27-7 21C26 102 22 84 23 65Z" fill={`url(#${hairId})`} />
            <path d="M31 76c5 11 10 18 18 24M97 75c-5 12-11 20-19 25" fill="none" stroke={hairHighlight} strokeWidth="3" strokeLinecap="round" opacity=".34" />
          </g>
        );
      case "long":
        return (
          <g>
            <path d="M23 59C22 29 39 12 64 12s42 17 41 47l-4 69H78l2-62H48l2 62H27Z" fill={`url(#${hairId})`} />
            <path d="M28 68c5 18 10 35 18 51M100 68c-4 19-9 36-17 51" fill="none" stroke={hairHighlight} strokeWidth="3" strokeLinecap="round" opacity=".27" />
          </g>
        );
      case "bun":
        return (
          <g>
            <circle cx="64" cy="14" r="17" fill={`url(#${hairId})`} />
            <path d="M52 5c7-5 18-4 24 2" fill="none" stroke={hairHighlight} strokeWidth="3" strokeLinecap="round" opacity=".35" />
            <path d="M27 64C25 31 41 17 64 17s40 15 38 48L92 87H36Z" fill={`url(#${hairId})`} />
          </g>
        );
      case "pixie":
        return <path d="M29 59c-4-16 1-31 14-39 12-8 28-8 42-1 12 6 18 19 15 37l-10-9-7-13-15 5-15-8-12 16Z" fill={`url(#${hairId})`} />;
      case "ponytail":
        return (
          <g>
            <path d="M86 31c21 2 29 16 24 31-3 10-1 20 7 30-17 3-28-4-31-18-3-13-1-28 0-43Z" fill={hairShadow} />
            <path d="M27 62C25 31 41 15 65 15s39 16 37 49L91 84H36Z" fill={`url(#${hairId})`} />
            <path d="M101 42c7 9 6 22 3 31" fill="none" stroke={hairHighlight} strokeWidth="3" strokeLinecap="round" opacity=".3" />
          </g>
        );
      case "braids":
        return (
          <g>
            <path d="M29 64C26 31 42 15 64 15s38 16 35 50L91 82H37Z" fill={`url(#${hairId})`} />
            <g fill={hairShadow} stroke={hair} strokeWidth="2">
              {[62, 73, 84, 95, 106].map((cy, index) => <ellipse key={`left-${cy}`} cx={31 - (index % 2) * 2} cy={cy} rx="7" ry="9" />)}
              {[62, 73, 84, 95, 106].map((cy, index) => <ellipse key={`right-${cy}`} cx={97 + (index % 2) * 2} cy={cy} rx="7" ry="9" />)}
            </g>
            <circle cx="29" cy="115" r="4" fill={outfit} /><circle cx="99" cy="115" r="4" fill={outfit} />
          </g>
        );
      case "afro":
        return (
          <g fill={`url(#${hairId})`}>
            <circle cx="22" cy="57" r="17" /><circle cx="27" cy="38" r="18" />
            <circle cx="39" cy="23" r="19" /><circle cx="57" cy="15" r="20" />
            <circle cx="76" cy="16" r="20" /><circle cx="94" cy="26" r="19" />
            <circle cx="105" cy="43" r="18" /><circle cx="106" cy="63" r="17" />
            <circle cx="28" cy="75" r="14" /><circle cx="100" cy="79" r="14" />
          </g>
        );
      case "shag":
        return (
          <g>
            <path d="M25 61C22 35 37 15 62 13c25-2 43 15 44 43l-8-4 7 16-9-2 5 17-10-5-3 18-12-22H51L39 97l-2-19-11 8 5-18-9 2Z" fill={`url(#${hairId})`} />
            <path d="M31 64 25 79l13-6-3 15M97 61l7 15-13-5 3 15" fill="none" stroke={hairHighlight} strokeWidth="2.4" strokeLinecap="round" opacity=".35" />
          </g>
        );
      case "locs":
        return (
          <g>
            <path d="M28 58C26 31 41 15 64 15s38 16 36 44L91 77H37Z" fill={`url(#${hairId})`} />
            <g fill="none" stroke={hairShadow} strokeWidth="8" strokeLinecap="round">
              <path d="M33 50c-5 17-4 34-1 51" /><path d="M41 44c-5 20-4 41-1 62" />
              <path d="M49 40c-3 22-2 43 1 67" /><path d="M95 50c5 17 4 34 1 51" />
              <path d="M87 44c5 20 4 41 1 62" /><path d="M79 40c3 22 2 43-1 67" />
            </g>
            <g fill="none" stroke={hairHighlight} strokeWidth="1.4" strokeLinecap="round" opacity=".35">
              <path d="M33 56v37M42 50v48M86 50v48M95 56v37" />
            </g>
          </g>
        );
    }
  };

  const renderHairFront = () => {
    switch (config.hairStyle) {
      case "bob":
        return (
          <g>
            <path d="M30 52c4-21 17-31 34-31-1 12-6 23-15 31-6 5-12 8-19 9Z" fill={`url(#${hairId})`} />
            <path d="M64 21c18 0 31 11 35 31-14-1-24-6-30-15-3-5-5-10-5-16Z" fill={`url(#${hairId})`} />
            <path d="M39 49c8-5 15-13 18-23M71 26c4 9 11 16 21 20" fill="none" stroke={hairHighlight} strokeWidth="2.5" strokeLinecap="round" opacity=".36" />
          </g>
        );
      case "crop":
        return (
          <g>
            <path d="M30 48c5-17 17-27 33-27l-5 8 12-8-1 8 13-5-2 9 14-2-8 12 12 1c-8 5-16 6-24 2l-8-8c-8 7-20 11-36 10Z" fill={`url(#${hairId})`} />
            <path d="M39 41c10-2 19-7 26-14" fill="none" stroke={hairHighlight} strokeWidth="2.4" strokeLinecap="round" opacity=".35" />
          </g>
        );
      case "curls":
        return (
          <g fill={`url(#${hairId})`}>
            <circle cx="37" cy="42" r="12" /><circle cx="49" cy="34" r="13" />
            <circle cx="63" cy="32" r="13" /><circle cx="77" cy="34" r="13" />
            <circle cx="90" cy="42" r="12" />
          </g>
        );
      case "waves":
        return (
          <g>
            <path d="M30 50c7-19 19-28 35-28 14 0 27 8 34 24-9 1-17-2-23-8-5 9-14 12-23 8-6 7-14 10-23 9Z" fill={`url(#${hairId})`} />
            <path d="M39 43c8-10 18-14 28-13 8 0 15 3 21 9" fill="none" stroke={hairHighlight} strokeWidth="2.5" strokeLinecap="round" opacity=".38" />
          </g>
        );
      case "long":
        return (
          <g>
            <path d="M30 54c2-19 13-31 34-33-1 13-7 24-17 31-6 4-11 6-17 7Z" fill={`url(#${hairId})`} />
            <path d="M64 21c20 2 31 13 34 33-15-2-25-9-31-21-2-4-3-8-3-12Z" fill={`url(#${hairId})`} />
            <path d="M56 27c-4 10-10 18-18 23M72 27c4 10 10 17 19 22" fill="none" stroke={hairHighlight} strokeWidth="2.3" strokeLinecap="round" opacity=".3" />
          </g>
        );
      case "bun":
        return (
          <g>
            <path d="M30 54c4-20 15-30 34-32-1 13-7 23-17 30-6 4-11 6-17 7Z" fill={`url(#${hairId})`} />
            <path d="M64 22c19 2 30 13 34 32-14-1-24-7-30-18-3-5-4-9-4-14Z" fill={`url(#${hairId})`} />
          </g>
        );
      case "pixie":
        return (
          <g>
            <path d="M31 49c6-20 19-29 38-27l-6 8 14-7-3 9 16-4-6 11 13 1c-9 8-19 9-28 4l-7-8c-8 7-18 12-31 13Z" fill={`url(#${hairId})`} />
            <path d="M42 40c9-2 17-7 24-13" fill="none" stroke={hairHighlight} strokeWidth="2.5" strokeLinecap="round" opacity=".38" />
          </g>
        );
      case "ponytail":
        return (
          <g>
            <path d="M30 53c5-21 17-31 35-31 14 0 27 8 34 26-15 1-27-4-36-15-8 12-18 18-33 20Z" fill={`url(#${hairId})`} />
            <path d="M43 44c8-5 14-11 19-19" fill="none" stroke={hairHighlight} strokeWidth="2.5" strokeLinecap="round" opacity=".34" />
          </g>
        );
      case "braids":
        return (
          <g>
            <path d="M30 53c4-21 17-31 34-31 18 0 31 11 35 31-13-1-24-7-35-19-9 11-20 18-34 19Z" fill={`url(#${hairId})`} />
            <path d="M64 24v10M54 26l2 12M74 26l-2 12" fill="none" stroke={hairHighlight} strokeWidth="2" strokeLinecap="round" opacity=".38" />
          </g>
        );
      case "afro":
        return (
          <g fill={`url(#${hairId})`}>
            <circle cx="35" cy="44" r="14" /><circle cx="47" cy="34" r="15" />
            <circle cx="63" cy="31" r="16" /><circle cx="79" cy="35" r="15" /><circle cx="92" cy="45" r="14" />
          </g>
        );
      case "shag":
        return (
          <g>
            <path d="M29 54c3-21 16-32 35-33 18-1 31 10 36 29l-12-5 4 10-17-11-7-10c-9 11-21 18-39 20Z" fill={`url(#${hairId})`} />
            <path d="M36 49c10-4 19-11 26-21M75 29c4 8 10 14 18 18" fill="none" stroke={hairHighlight} strokeWidth="2.4" strokeLinecap="round" opacity=".35" />
          </g>
        );
      case "locs":
        return (
          <g>
            <path d="M29 51c6-20 18-29 35-29 18 0 31 10 35 29-13-1-24-7-35-18-9 10-20 16-35 18Z" fill={`url(#${hairId})`} />
            <path d="M43 41c5-5 10-10 14-17M85 42c-5-6-10-11-14-18" fill="none" stroke={hairHighlight} strokeWidth="2" strokeLinecap="round" opacity=".35" />
          </g>
        );
    }
  };

  const renderEyes = () => {
    if (config.eyeStyle === "happy") {
      return (
        <g fill="none" stroke={eye} strokeWidth="3.8" strokeLinecap="round">
          <path d="M42 64q7-8 14 0" /><path d="M72 64q7-8 14 0" />
        </g>
      );
    }
    if (config.eyeStyle === "sleepy") {
      return (
        <g fill="none" stroke={eye} strokeWidth="3.4" strokeLinecap="round">
          <path d="M42 63q7 5 14 0" /><path d="M72 63q7 5 14 0" />
        </g>
      );
    }
    return (
      <g>
        <ellipse cx="49" cy="64" rx="9.5" ry="12" fill="#fffdf9" />
        <ellipse cx="79" cy="64" rx="9.5" ry="12" fill="#fffdf9" />
        <ellipse cx="50" cy="66" rx="4.8" ry="6.7" fill={eye} />
        <ellipse cx="78" cy="66" rx="4.8" ry="6.7" fill={eye} />
        <g fill="#fff">
          <circle cx="48.5" cy="62.5" r="1.7" /><circle cx="76.5" cy="62.5" r="1.7" />
          {config.eyeStyle === "sparkle" && <><circle cx="52" cy="67" r="1.1" /><circle cx="80" cy="67" r="1.1" /></>}
        </g>
      </g>
    );
  };

  const renderNose = () => {
    if (config.noseStyle === "dot") return <circle cx="64" cy="77" r="3" fill={skinShadow} />;
    if (config.noseStyle === "triangle") return <path d="m64 71-5 10h10Z" fill={skinShadow} opacity=".72" />;
    if (config.noseStyle === "soft") return <path d="M63 71c-4 7-2 11 4 11" fill="none" stroke={skinShadow} strokeWidth="2.8" strokeLinecap="round" />;
    return <ellipse cx="64" cy="77" rx="5" ry="4" fill={skinShadow} opacity=".68" />;
  };

  const renderMouth = () => {
    const lip = mix(skin, 66, "#9f3f4f");
    if (config.mouthStyle === "grin") return <path d="M51 87q13 14 26 0c-3 12-23 13-26 0Z" fill="#fffdf9" stroke={lip} strokeWidth="2.4" strokeLinejoin="round" />;
    if (config.mouthStyle === "open") return <><ellipse cx="64" cy="91" rx="8" ry="7" fill="#783b43" /><path d="M59 94q5-3 10 0" fill="none" stroke="#e78683" strokeWidth="2" strokeLinecap="round" /></>;
    if (config.mouthStyle === "pout") return <path d="M58 92q6-5 12 0" fill="none" stroke={lip} strokeWidth="3" strokeLinecap="round" />;
    return <path d="M52 88q12 11 24 0" fill="none" stroke={lip} strokeWidth="3" strokeLinecap="round" />;
  };

  const renderAccessory = () => {
    switch (config.accessory) {
      case "glasses":
        return (
          <g fill="none" stroke="#3c383d" strokeWidth="2.6">
            <circle cx="49" cy="64" r="13.5" /><circle cx="79" cy="64" r="13.5" />
            <path d="M62.5 63h3M35.5 60l-7.5-3M92.5 60l7.5-3" />
          </g>
        );
      case "freckles":
        return <g fill={skinShadow} opacity=".65"><circle cx="42" cy="78" r="1.4" /><circle cx="47" cy="80" r="1.2" /><circle cx="52" cy="78" r="1.3" /><circle cx="76" cy="78" r="1.3" /><circle cx="81" cy="80" r="1.2" /><circle cx="86" cy="78" r="1.4" /></g>;
      case "blush":
        return <g fill="#f17f7c" opacity=".42"><ellipse cx="40" cy="80" rx="9" ry="5" /><ellipse cx="88" cy="80" rx="9" ry="5" /></g>;
      case "earrings":
        return <g><circle cx="28" cy="76" r="3.3" fill="#f4bf42" /><circle cx="100" cy="76" r="3.3" fill="#f4bf42" /><circle cx="27" cy="75" r="1" fill="#fff4bd" /><circle cx="99" cy="75" r="1" fill="#fff4bd" /></g>;
      case "star":
        return <path d="m91 34 2.3 4.7 5.2.8-3.8 3.6.9 5.2-4.6-2.5-4.6 2.5.9-5.2-3.8-3.6 5.2-.8Z" fill="#f4bf42" stroke="#fff8dc" strokeWidth="1.2" />;
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
      <defs>
        <radialGradient id={backgroundId} cx="50%" cy="42%" r="72%">
          <stop offset="0" stopColor={mix(background, 62, "#ffffff")} />
          <stop offset="1" stopColor={background} />
        </radialGradient>
        <linearGradient id={faceId} x1="36" y1="30" x2="88" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor={skinHighlight} /><stop offset="1" stopColor={skin} />
        </linearGradient>
        <linearGradient id={hairId} x1="35" y1="20" x2="92" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor={hairHighlight} /><stop offset=".42" stopColor={hair} /><stop offset="1" stopColor={hairShadow} />
        </linearGradient>
        <linearGradient id={outfitId} x1="43" y1="97" x2="75" y2="128" gradientUnits="userSpaceOnUse">
          <stop stopColor={mix(outfit, 80, "#ffffff")} /><stop offset="1" stopColor={outfitShadow} />
        </linearGradient>
      </defs>

      <rect width="128" height="128" rx="30" fill={`url(#${backgroundId})`} />
      <circle cx="18" cy="22" r="17" fill="#fff" opacity=".13" />
      <circle cx="113" cy="111" r="25" fill="#fff" opacity=".12" />
      <path d="M18 128c4-23 20-35 46-35s42 12 46 35Z" fill={`url(#${outfitId})`} />
      <path d="M50 91v16c4 6 24 6 28 0V91Z" fill={`url(#${faceId})`} />
      <path d="M49 101c8 5 22 5 30 0" fill="none" stroke={skinShadow} strokeWidth="2" opacity=".22" />

      {renderHairBack()}

      <ellipse cx="28" cy="71" rx="8.5" ry="11.5" fill={`url(#${faceId})`} />
      <ellipse cx="100" cy="71" rx="8.5" ry="11.5" fill={`url(#${faceId})`} />
      <path d="M25 71q4-5 7 0M103 71q-4-5-7 0" fill="none" stroke={skinShadow} strokeWidth="1.8" strokeLinecap="round" opacity=".38" />
      <ellipse cx="64" cy="67" rx="36" ry="42" fill={`url(#${faceId})`} />
      <ellipse cx="52" cy="57" rx="18" ry="26" fill="#fff" opacity=".06" />

      {renderHairFront()}
      <path d="M42 51q7-5 14 0M72 51q7-5 14 0" fill="none" stroke={hairShadow} strokeWidth="3" strokeLinecap="round" opacity=".88" />
      {renderEyes()}
      {renderNose()}
      {renderAccessory()}
      {renderMouth()}
      <path d="M45 112q19 8 38 0" fill="none" stroke={outfitShadow} strokeWidth="3" strokeLinecap="round" opacity=".34" />
    </svg>
  );
}
