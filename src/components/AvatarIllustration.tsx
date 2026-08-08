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
            <circle cx="29" cy="55" r="16" /><circle cx="34" cy="37" r="17" />
            <circle cx="46" cy="22" r="18" /><circle cx="64" cy="17" r="20" />
            <circle cx="83" cy="23" r="18" /><circle cx="96" cy="38" r="17" />
            <circle cx="100" cy="57" r="16" /><circle cx="31" cy="72" r="13" />
            <circle cx="98" cy="73" r="13" />
          </g>
        );
      case "locs":
        return (
          <g>
            <path d="M31 55C29 31 42 15 63 14c22-1 36 16 35 41L90 72H38Z" fill={INK} />
            <g {...line} strokeWidth="7">
              <path d="M31 43c-6 16-7 31-4 47" /><path d="M39 33c-6 18-7 35-4 53" />
              <path d="M97 43c6 16 7 31 4 47" /><path d="M89 33c6 18 7 35 4 53" />
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
        return <path d="M35 41c2-12 13-19 29-19s27 7 29 19c-8-4-18-6-29-6s-21 2-29 6Z" fill={INK} />;
      case "crop":
        return <path d="M30 52C30 29 43 13 62 12c18-1 31 10 36 30l-1 10-10-7 1 8-10-10-4 9-10-13-8 11-8-9-7 10-7-7-4 8Z" fill={INK} />;
      case "sidepart":
        return (
          <g>
            <path d="M29 54C29 30 43 14 64 13c20-1 33 13 35 37-8-1-15-4-20-9-5-5-7-11-5-18-8 11-18 20-29 25-6 3-11 5-16 6Z" fill={INK} />
            <path {...line} d="M78 17c-3 4-4 8-4 13" stroke={PAPER} strokeWidth="2" />
          </g>
        );
      case "quiff":
        return (
          <g>
            <path d="M29 54c1-19 10-32 24-38 4-9 13-14 24-12 8 1 14 5 18 11 7 1 13 7 16 14-9-1-17 2-23 8 7-1 14 2 18 7-12 5-24 3-34-4-5-4-8-8-10-14-6 13-17 23-33 28Z" fill={INK} />
            <path {...line} d="M57 17c11 1 21 6 29 15" stroke={PAPER} strokeWidth="2.2" />
          </g>
        );
      case "bowl":
        return <path d="M30 50c1-24 15-38 34-38 20 0 33 14 34 38-8-4-15-6-22-7-3 7-7 11-12 11s-10-4-13-11c-7 1-14 3-21 7Z" fill={INK} />;
      case "curls":
        return (
          <g fill={INK}>
            <path d="M30 51c2-19 14-32 34-33 20 0 32 13 34 33Z" />
            <circle cx="35" cy="44" r="10" /><circle cx="43" cy="32" r="11" />
            <circle cx="54" cy="25" r="11" /><circle cx="66" cy="23" r="11" />
            <circle cx="78" cy="27" r="11" /><circle cx="88" cy="34" r="11" />
            <circle cx="94" cy="45" r="10" />
          </g>
        );
      case "afro":
        return (
          <g fill={INK}>
            <circle cx="35" cy="46" r="13" /><circle cx="46" cy="34" r="14" />
            <circle cx="63" cy="28" r="16" /><circle cx="80" cy="34" r="15" />
            <circle cx="94" cy="47" r="13" />
          </g>
        );
      case "locs":
        return (
          <g>
            <path d="M30 51c4-24 17-37 34-37 18 0 31 13 35 37-8-2-15-6-21-12-4 7-8 11-14 13-6-2-11-6-14-13-6 6-12 10-20 12Z" fill={INK} />
            <g {...line} strokeWidth="6.5">
              <path d="M39 34c-4 8-5 17-3 27" /><path d="M48 25c-3 10-3 20 0 30" />
              <path d="M57 20c-2 10-1 21 3 31" /><path d="M89 34c4 8 5 17 3 27" />
              <path d="M80 25c3 10 3 20 0 30" /><path d="M71 20c2 10 1 21-3 31" />
            </g>
          </g>
        );
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
        return <g {...line} strokeWidth="3.6"><path d="M42 67h14M72 67h14" /></g>;
      case "sleepy":
        return <g {...line} strokeWidth="3.5"><path d="M40 65q9 9 18 0M70 65q9 9 18 0" /></g>;
      case "almond":
        return <g fill={INK}><ellipse cx="49" cy="67" rx="7.4" ry="3.8" /><ellipse cx="79" cy="67" rx="7.4" ry="3.8" /></g>;
      case "wink":
        return <g fill={INK}><ellipse cx="49" cy="67" rx="3.8" ry="8.4" /><ellipse cx="79" cy="67" rx="3.8" ry="8.4" /></g>;
      case "curious":
        return (
          <g>
            <path {...line} d="M40 69q9-12 18 0M70 69q9-12 18 0" strokeWidth="3" />
            <g fill={INK}><circle cx="49" cy="67" r="2.4" /><circle cx="79" cy="67" r="2.4" /></g>
          </g>
        );
      case "sparkle":
        return (
          <g>
            <ellipse cx="49" cy="67" rx="6.6" ry="8.8" fill={INK} /><ellipse cx="79" cy="67" rx="6.6" ry="8.8" fill={INK} />
            <g fill={PAPER}><circle cx="46.8" cy="63.5" r="1.9" /><circle cx="76.8" cy="63.5" r="1.9" /><circle cx="51.5" cy="69.5" r="1" /><circle cx="81.5" cy="69.5" r="1" /></g>
          </g>
        );
      default:
        return <g fill={INK}><ellipse cx="49" cy="67" rx="5.2" ry="7" /><ellipse cx="79" cy="67" rx="5.2" ry="7" /></g>;
    }
  };

  const renderMouth = () => {
    switch (config.mouthStyle) {
      case "grin":
        return <path d="M51 89q13 9 26 0c-2 13-24 13-26 0Z" fill={PAPER} stroke={INK} strokeWidth="2.8" strokeLinejoin="round" />;
      case "open":
        return <ellipse cx="64" cy="93" rx="5.2" ry="6.2" fill={PAPER} stroke={INK} strokeWidth="3" />;
      case "pout":
        return <path {...line} d="M57 93q3-4 7-1 4-3 7 1-3 4-7 4t-7-4Z" strokeWidth="2.6" />;
      case "laugh":
        return (
          <g>
            <path d="M50 88q14 10 28 0c-2 17-26 18-28 0Z" fill={INK} />
            <path {...line} d="M54 91q10 4 20 0" stroke={PAPER} strokeWidth="2.2" />
          </g>
        );
      case "smirk":
        return <path {...line} d="M54 92q11 5 21-2" strokeWidth="3.2" />;
      case "tiny":
        return <path {...line} d="M60 92q4 5 8 0" strokeWidth="2.6" />;
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
