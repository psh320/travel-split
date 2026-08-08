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
            <path d="M29 58C27 29 42 14 64 14s39 16 36 45L89 75H39Z" fill={INK} />
            <g {...line} strokeWidth="8">
              <path d="M35 48c-5 18-4 38-1 59" /><path d="M44 40c-5 23-4 47-1 72" />
              <path d="M93 48c5 18 4 38 1 59" /><path d="M84 40c5 23 4 47 1 72" />
            </g>
          </g>
        );
      case "bob":
        return <path d="M26 63C24 30 40 13 64 13s41 18 39 51l3 29-17 9-8-20H47l-8 20-17-9Z" fill={INK} />;
      case "waves":
        return <path d="M25 64C23 30 40 12 64 12c25 0 42 19 40 54 0 22-7 40-19 53l-9-31H51l-9 31C30 105 24 87 25 64Z" fill={INK} />;
      case "long":
        return <path d="M26 61C24 29 41 12 64 12s40 17 39 50l-1 63H77l4-56H47l4 56H27Z" fill={INK} />;
      case "bun":
        return (
          <g fill={INK}>
            <circle cx="64" cy="13" r="16" />
            <path d="M29 63C27 31 42 15 64 15s39 17 36 49L89 84H39Z" />
          </g>
        );
      case "ponytail":
        return (
          <g fill={INK}>
            <path d="M87 25c21 1 30 14 26 30-3 13 1 26 10 37-20 3-33-7-35-24-2-16-1-29-1-43Z" />
            <path d="M29 62C27 30 42 14 64 14s39 16 36 49L89 83H39Z" />
          </g>
        );
      case "braids":
        return (
          <g>
            <path d="M29 61C27 30 42 14 64 14s39 17 36 48L89 81H39Z" fill={INK} />
            <g fill={INK}>
              {[63, 76, 89, 102].map((cy, index) => <ellipse key={`l-${cy}`} cx={33 - (index % 2)} cy={cy} rx="6" ry="8" />)}
              {[63, 76, 89, 102].map((cy, index) => <ellipse key={`r-${cy}`} cx={95 + (index % 2)} cy={cy} rx="6" ry="8" />)}
            </g>
          </g>
        );
      case "shag":
        return <path d="M27 60C24 30 41 12 63 12c24-1 41 17 41 46l7 12-11-1 5 16-11-5-2 21-12-25H49L36 101l-2-20-11 7 5-18-10 2Z" fill={INK} />;
      default:
        return null;
    }
  };

  const renderHairFront = () => {
    switch (config.hairStyle) {
      case "buzz":
        return <path d="M34 44C36 30 47 23 64 23s28 8 30 22c-9-5-19-8-30-8-12 0-22 2-30 7Z" fill={INK} />;
      case "crop":
        return <path d="M31 51C31 30 43 15 62 14c17-1 31 10 35 29l-9-4 1 9-10-7-3 9-10-11-7 9-8-8-6 8-7-6-2 8Z" fill={INK} />;
      case "sidepart":
        return (
          <g>
            <path d="M30 52C31 29 44 15 63 14c18-1 31 11 35 32-13 0-25-5-32-16-7 12-19 20-36 22Z" fill={INK} />
            <path {...line} d="M66 19c-2 4-2 8-1 12" stroke={PAPER} strokeWidth="1.8" />
          </g>
        );
      case "quiff":
        return <path d="M30 52c1-18 10-29 24-34 2-9 12-14 23-11-5 4-7 9-6 14 8-6 18-5 25 3-7 1-12 5-15 11 8-2 15 1 19 8-13 5-25 2-35-10-8 11-20 17-35 19Z" fill={INK} />;
      case "bowl":
        return <path d="M30 50c1-23 15-36 34-36s33 13 34 36c-10-6-21-9-34-9s-24 3-34 9Z" fill={INK} />;
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
        return <path d="M29 52c5-25 18-38 35-38 19 0 32 14 36 38-14-2-26-9-36-21-9 12-21 19-35 21Z" fill={INK} />;
      case "bob":
        return <path d="M28 54c4-25 18-40 36-40-1 15-8 27-19 35-6 4-11 7-17 9Zm36-40c20 1 34 16 37 40-15-2-27-10-33-23-2-5-4-11-4-17Z" fill={INK} />;
      case "waves":
        return <path d="M28 54c5-26 19-41 37-41 16 0 30 11 37 33-9 3-18 0-25-8-5 9-14 13-24 8-6 7-15 11-25 12Z" fill={INK} />;
      case "long":
        return <path d="M28 56c3-27 17-41 36-43-1 16-8 29-19 37-5 4-11 7-17 10Zm36-43c21 2 35 17 38 43-16-3-28-12-34-25-2-5-4-11-4-18Z" fill={INK} />;
      case "bun":
        return <path d="M28 55c4-27 18-40 36-41 20 1 34 15 38 41-15-2-27-10-38-23-9 12-21 20-36 23Z" fill={INK} />;
      case "pixie":
        return <path d="M29 53c3-25 17-39 36-39 17 0 30 10 35 28l-11-4 2 10-12-7-3 10-11-13-7 10-8-8-6 9-7-6-3 9Z" fill={INK} />;
      case "ponytail":
        return <path d="M28 54c4-27 18-40 37-40 16 0 30 11 37 34-16 1-29-6-38-20-9 15-21 23-36 26Z" fill={INK} />;
      case "braids":
        return <path d="M28 54c5-27 18-40 36-40 19 0 33 14 38 40-15-2-27-10-38-23-10 13-22 21-36 23Z" fill={INK} />;
      case "shag":
        return <path d="M27 56c2-28 17-42 36-43 19-1 34 12 39 37l-12-5 3 11-17-12-8-13c-10 14-23 22-41 25Z" fill={INK} />;
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
