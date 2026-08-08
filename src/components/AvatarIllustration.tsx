import type { AvatarConfig } from "../types";

type AvatarIllustrationProps = {
  config: AvatarConfig;
  title?: string;
  decorative?: boolean;
  className?: string;
};

const INK = "#171717";
const PAPER = "#ffffff";

const line = {
  fill: "none",
  stroke: INK,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function AvatarIllustration({
  config,
  title = "Custom avatar",
  decorative = false,
  className = "",
}: AvatarIllustrationProps) {
  const renderHairBack = () => {
    switch (config.hairStyle) {
      case "afro":
        return (
          <g fill={INK}>
            <circle cx="29" cy="53" r="17" /><circle cx="34" cy="35" r="17" />
            <circle cx="47" cy="23" r="18" /><circle cx="64" cy="19" r="19" />
            <circle cx="82" cy="24" r="18" /><circle cx="95" cy="37" r="17" />
            <circle cx="100" cy="55" r="16" /><circle cx="31" cy="70" r="14" />
            <circle cx="98" cy="71" r="14" />
          </g>
        );
      case "locs":
        return (
          <g>
            <path d="M31 57C29 32 43 20 64 20s36 13 34 38L88 72H40Z" fill={INK} />
            <g {...line} strokeWidth="8">
              <path d="M35 48c-5 18-4 38-1 59" /><path d="M44 40c-5 23-4 47-1 72" />
              <path d="M93 48c5 18 4 38 1 59" /><path d="M84 40c5 23 4 47 1 72" />
            </g>
          </g>
        );
      case "bob":
        return <path d="M29 62C27 32 43 18 64 18s38 15 36 45l3 31-15 7-7-19H47l-7 19-15-7Z" fill={INK} />;
      case "waves":
        return <path d="M28 63C26 33 42 17 64 17c23 0 39 17 37 48 0 22-6 39-17 51l-8-28H51l-8 28C32 103 27 86 28 63Z" fill={INK} />;
      case "long":
        return <path d="M28 60C27 31 43 17 64 17s37 15 36 44l-1 61H78l3-53H47l3 53H29Z" fill={INK} />;
      case "bun":
        return (
          <g fill={INK}>
            <circle cx="64" cy="15" r="14" />
            <path d="M31 62C29 33 43 19 64 19s36 15 34 44L89 82H39Z" />
          </g>
        );
      case "ponytail":
        return (
          <g fill={INK}>
            <path d="M86 30c19 1 27 12 24 26-3 12 0 24 9 34-18 3-30-6-32-22-2-14-1-26-1-38Z" />
            <path d="M31 61C29 33 43 19 64 19s36 14 34 43L89 81H39Z" />
          </g>
        );
      case "braids":
        return (
          <g>
            <path d="M31 60C29 33 43 19 64 19s36 14 34 42L89 79H39Z" fill={INK} />
            <g fill={INK}>
              {[63, 76, 89, 102].map((cy, index) => <ellipse key={`l-${cy}`} cx={33 - (index % 2)} cy={cy} rx="6" ry="8" />)}
              {[63, 76, 89, 102].map((cy, index) => <ellipse key={`r-${cy}`} cx={95 + (index % 2)} cy={cy} rx="6" ry="8" />)}
            </g>
          </g>
        );
      case "shag":
        return <path d="M29 59C27 33 42 17 63 17c22-1 38 15 38 41l7 12-10-1 5 15-10-5-1 20-12-23H49L37 99l-2-19-10 7 5-17-9 2Z" fill={INK} />;
      default:
        return null;
    }
  };

  const renderHairFront = () => {
    switch (config.hairStyle) {
      case "buzz":
        return <path d="M33 47C34 30 47 20 64 20s29 10 31 27c-7-4-13-6-19-7l-4-8-6 7-8-8-5 8-9-5-3 8Z" fill={INK} />;
      case "crop":
        return <path d="M32 50C33 31 46 20 64 20c15 0 27 8 32 22l-9-3 2 8-10-6-3 8-10-11-6 9-8-8-6 8-7-6-2 8Z" fill={INK} />;
      case "sidepart":
        return (
          <g>
            <path d="M32 49c4-19 17-29 34-29 14 0 25 7 30 22-12 1-23-3-31-12-6 11-17 17-33 19Z" fill={INK} />
            <path {...line} d="M64 25c-1 5-1 9 1 13" stroke={PAPER} strokeWidth="2.2" />
          </g>
        );
      case "quiff":
        return <path d="M32 49c2-14 10-23 23-27 0-9 7-15 15-16-2 5-1 10 2 14 8-6 15-5 20 1-6 2-10 6-12 11 7-2 13 1 16 8-14 4-25 1-33-7-8 10-18 15-31 16Z" fill={INK} />;
      case "bowl":
        return <path d="M31 49c2-19 15-30 33-30s31 11 33 30c-9-5-20-7-33-7s-24 2-33 7Z" fill={INK} />;
      case "curls":
        return (
          <g fill={INK}>
            <circle cx="36" cy="43" r="11" /><circle cx="45" cy="32" r="12" />
            <circle cx="58" cy="27" r="12" /><circle cx="71" cy="27" r="12" />
            <circle cx="84" cy="33" r="12" /><circle cx="93" cy="44" r="11" />
          </g>
        );
      case "afro":
        return (
          <g fill={INK}>
            <circle cx="36" cy="44" r="13" /><circle cx="48" cy="34" r="14" />
            <circle cx="64" cy="31" r="15" /><circle cx="80" cy="35" r="14" />
            <circle cx="93" cy="45" r="13" />
          </g>
        );
      case "locs":
        return <path d="M31 50c5-20 17-30 33-30 17 0 29 11 34 30-13-1-24-7-34-18-8 10-19 16-33 18Z" fill={INK} />;
      case "bob":
        return <path d="M31 51c5-20 17-31 34-31-1 12-7 22-18 29-5 4-11 6-16 7Zm34-31c17 1 29 12 33 31-13-1-23-7-29-17-3-5-4-9-4-14Z" fill={INK} />;
      case "waves":
        return <path d="M31 50c6-20 18-30 34-30 14 0 26 8 33 25-8 2-15 0-22-7-5 8-13 11-22 7-6 6-14 9-23 9Z" fill={INK} />;
      case "long":
        return <path d="M31 53c3-20 15-31 34-33-1 13-7 23-18 31-5 3-10 5-16 7Zm34-33c18 2 30 13 33 33-14-2-24-9-29-20-2-4-4-8-4-13Z" fill={INK} />;
      case "bun":
        return <path d="M31 53c4-20 16-31 33-32 18 1 30 11 34 32-13-2-24-8-34-19-8 10-19 16-33 19Z" fill={INK} />;
      case "pixie":
        return <path d="M32 50c4-19 17-30 34-29 14 0 25 7 30 19l-10-2 3 8-12-5-2 8-10-12-6 9-8-7-5 8-7-5-2 7Z" fill={INK} />;
      case "ponytail":
        return <path d="M31 52c4-21 17-32 34-32 14 0 26 9 33 27-14 1-26-4-34-16-8 12-18 18-33 21Z" fill={INK} />;
      case "braids":
        return <path d="M31 51c5-20 17-31 33-31 17 0 29 11 34 31-13-1-24-7-34-18-9 11-20 17-33 18Z" fill={INK} />;
      case "shag":
        return <path d="M30 53c3-21 16-32 34-33 17-1 30 9 35 29l-11-4 4 10-16-11-8-11c-9 11-21 18-38 20Z" fill={INK} />;
    }
  };

  const renderEyes = () => {
    switch (config.eyeStyle) {
      case "dot":
        return <g fill={INK}><circle cx="49" cy="67" r="3.2" /><circle cx="79" cy="67" r="3.2" /></g>;
      case "happy":
        return <g {...line} strokeWidth="4"><path d="M41 69q8-10 16 0M71 69q8-10 16 0" /></g>;
      case "sleepy":
        return <g {...line} strokeWidth="3.5"><path d="M40 66q9 8 18 0M70 66q9 8 18 0" /></g>;
      case "almond":
        return <g fill={INK}><path d="M39 67q10-11 20 0-10 9-20 0ZM69 67q10-11 20 0-10 9-20 0Z" /></g>;
      case "wink":
        return (
          <g>
            <ellipse cx="49" cy="67" rx="5.2" ry="7" fill={INK} />
            <path {...line} d="M71 69q8-10 16 0" strokeWidth="4" />
          </g>
        );
      case "curious":
        return (
          <g fill={INK}>
            <ellipse cx="49" cy="68" rx="4.4" ry="6.3" />
            <ellipse cx="79" cy="66" rx="6" ry="8.5" />
            <path {...line} d="M42 57q7-4 14 0M72 55q7-5 14-1" strokeWidth="2.6" />
          </g>
        );
      case "sparkle":
        return (
          <g>
            <ellipse cx="49" cy="67" rx="6" ry="8" fill={INK} /><ellipse cx="79" cy="67" rx="6" ry="8" fill={INK} />
            <g fill={PAPER}><circle cx="47" cy="64" r="1.7" /><circle cx="77" cy="64" r="1.7" /><circle cx="51" cy="69" r="1" /><circle cx="81" cy="69" r="1" /></g>
          </g>
        );
      default:
        return <g fill={INK}><ellipse cx="49" cy="67" rx="5.2" ry="7" /><ellipse cx="79" cy="67" rx="5.2" ry="7" /></g>;
    }
  };

  const renderMouth = () => {
    switch (config.mouthStyle) {
      case "grin":
        return <path d="M51 88q13 15 26 0c-1 13-25 14-26 0Z" fill={PAPER} stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
      case "open":
        return <ellipse cx="64" cy="93" rx="7" ry="8.5" fill={INK} />;
      case "pout":
        return <path {...line} d="M56 93q4-6 8 0 4-6 8 0-4 4-8 4t-8-4Z" strokeWidth="3" />;
      case "laugh":
        return (
          <g>
            <path d="M50 88q14 9 28 0c-1 17-27 18-28 0Z" fill={INK} />
            <path {...line} d="M54 91q10 4 20 0" stroke={PAPER} strokeWidth="2" />
          </g>
        );
      case "smirk":
        return <path {...line} d="M54 93q12 4 22-5" strokeWidth="3.5" />;
      case "tiny":
        return <path {...line} d="M60 92q4-4 8 0-4 4-8 0Z" strokeWidth="2.8" />;
      case "flat":
        return <path {...line} d="M57 92h14" strokeWidth="3.5" />;
      default:
        return <path {...line} d="M52 89q12 12 24 0" strokeWidth="3.5" />;
    }
  };

  const renderAccessory = () => {
    switch (config.accessory) {
      case "glasses":
        return (
          <g {...line} strokeWidth="3">
            <circle cx="49" cy="67" r="12" /><circle cx="79" cy="67" r="12" />
            <path d="M61 66h6M37 64l-7-3M91 64l7-3" />
          </g>
        );
      case "freckles":
        return <g fill={INK}><circle cx="42" cy="80" r="1.3" /><circle cx="47" cy="82" r="1.1" /><circle cx="52" cy="80" r="1.2" /><circle cx="76" cy="80" r="1.2" /><circle cx="81" cy="82" r="1.1" /><circle cx="86" cy="80" r="1.3" /></g>;
      case "blush":
        return <g {...line} strokeWidth="1.8"><path d="m37 80-5 4m11-3-5 5m52-6 5 4m-11-3 5 5" /></g>;
      case "earrings":
        return <g fill={PAPER} stroke={INK} strokeWidth="2.5"><circle cx="29" cy="78" r="4" /><circle cx="99" cy="78" r="4" /></g>;
      case "star":
        return <path d="m92 34 2.2 4.5 5 .8-3.6 3.5.8 5-4.4-2.4-4.4 2.4.8-5-3.6-3.5 5-.8Z" fill={PAPER} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />;
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
      shapeRendering="geometricPrecision"
    >
      <rect width="128" height="128" fill={PAPER} />
      {renderHairBack()}

      <path d="M19 128c4-20 20-31 45-31s41 11 45 31Z" fill={PAPER} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M52 91v16c5 6 19 6 24 0V91Z" fill={PAPER} stroke={INK} strokeWidth="4" strokeLinejoin="round" />

      <ellipse cx="30" cy="70" rx="8" ry="11" fill={PAPER} stroke={INK} strokeWidth="4" />
      <ellipse cx="98" cy="70" rx="8" ry="11" fill={PAPER} stroke={INK} strokeWidth="4" />
      <path {...line} d="M28 71q4-5 7 0M100 71q-4-5-7 0" strokeWidth="2" />

      <path d="M64 21c20 0 34 16 34 42 0 28-13 43-34 43S30 91 30 63c0-26 14-42 34-42Z" fill={PAPER} stroke={INK} strokeWidth="4.2" strokeLinejoin="round" />
      {renderHairFront()}
      {renderEyes()}
      {renderAccessory()}
      {renderMouth()}
    </svg>
  );
}
