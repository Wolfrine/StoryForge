import type { StoryworldEntity } from '../domain/types';

interface Props {
  entity: StoryworldEntity;
}

function LandscapeScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="skyWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe8ff" />
          <stop offset="52%" stopColor="#f7d6c4" />
          <stop offset="100%" stopColor="#f4c896" />
        </linearGradient>
        <linearGradient id="lakeWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78a5c9" />
          <stop offset="100%" stopColor="#426d92" />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="#fffbe8" stopOpacity="1" />
          <stop offset="42%" stopColor="#fff0ad" stopOpacity=".75" />
          <stop offset="100%" stopColor="#fff0ad" stopOpacity="0" />
        </radialGradient>
        <filter id="soften"><feGaussianBlur stdDeviation="1.8"/></filter>
      </defs>
      <rect width="1600" height="960" fill="url(#skyWarm)" />
      <circle cx="1255" cy="210" r="190" fill="url(#sunGlow)" />
      <circle cx="1255" cy="210" r="76" fill="#fff3bd" />
      <path d="M0 565 L240 360 L390 500 L655 285 L835 505 L1060 340 L1320 540 L1600 370 L1600 700 L0 700 Z" fill="#7189ad" opacity=".55" filter="url(#soften)" />
      <path d="M0 630 L170 500 L360 592 L570 390 L760 560 L930 455 L1120 575 L1330 420 L1600 600 L1600 760 L0 760 Z" fill="#526f91" opacity=".78" />
      <path d="M-40 676 Q350 615 805 672 T1640 650 L1640 770 L-40 770 Z" fill="#496553" />
      <rect x="0" y="690" width="1600" height="270" fill="url(#lakeWarm)" />
      <path d="M0 735 Q250 708 520 741 T1040 730 T1600 744" fill="none" stroke="rgba(255,255,255,.38)" strokeWidth="2" />
      <path d="M0 795 Q260 763 545 798 T1080 785 T1600 803" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="2" />
      <g className="scene-village">
        <g transform="translate(230 603) scale(.9)">
          <rect x="0" y="45" width="104" height="67" rx="4" fill="#efd4a8" />
          <path d="M-10 47 L52 4 L114 47 Z" fill="#855f52" />
          <rect x="18" y="67" width="22" height="45" fill="#b78366" />
          <rect x="66" y="66" width="20" height="18" fill="#ffeec7" />
        </g>
        <g transform="translate(410 620) scale(.72)">
          <rect x="0" y="45" width="104" height="67" rx="4" fill="#f2d9b4" />
          <path d="M-10 47 L52 4 L114 47 Z" fill="#8a6254" />
          <rect x="62" y="66" width="20" height="18" fill="#fff0c9" />
        </g>
        <g transform="translate(540 588) scale(1.08)">
          <rect x="0" y="45" width="104" height="67" rx="4" fill="#eed1a2" />
          <path d="M-10 47 L52 4 L114 47 Z" fill="#7b594d" />
          <rect x="18" y="67" width="22" height="45" fill="#b58264" />
          <rect x="66" y="66" width="20" height="18" fill="#fff0c9" />
        </g>
        <g transform="translate(780 615) scale(.76)">
          <rect x="0" y="45" width="104" height="67" rx="4" fill="#f0d8b0" />
          <path d="M-10 47 L52 4 L114 47 Z" fill="#865f52" />
          <rect x="65" y="66" width="20" height="18" fill="#fff0c9" />
        </g>
      </g>
      <path d="M1180 810 C1230 760 1290 760 1350 810 C1300 842 1230 842 1180 810 Z" fill="#253f58" opacity=".64"/>
      <path d="M1247 758 L1247 818 L1304 800 Z" fill="#f6e7c8" opacity=".9" />
    </svg>
  );
}

function PortraitScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="portraitBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e9f4ef" />
          <stop offset="55%" stopColor="#d6ebe7" />
          <stop offset="100%" stopColor="#f1dfc8" />
        </linearGradient>
        <radialGradient id="portraitHalo">
          <stop offset="0%" stopColor="#ffffff" stopOpacity=".94" />
          <stop offset="56%" stopColor="#a9dbd1" stopOpacity=".28" />
          <stop offset="100%" stopColor="#a9dbd1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="960" fill="url(#portraitBg)" />
      <circle cx="1110" cy="430" r="390" fill="url(#portraitHalo)" />
      <circle cx="1110" cy="346" r="122" fill="#688a86" opacity=".95" />
      <path d="M910 940 C930 650 962 495 1110 495 C1258 495 1290 650 1310 940 Z" fill="#4f7472" />
      <path d="M1020 454 C1075 490 1145 490 1202 452" fill="none" stroke="#f6efe2" strokeWidth="16" opacity=".54" />
      <path d="M676 160 C820 270 860 535 785 805" fill="none" stroke="#4b9489" strokeWidth="3" opacity=".36" />
      <path d="M730 130 C924 276 976 550 856 862" fill="none" stroke="#c07b5b" strokeWidth="2" opacity=".28" />
      <path d="M552 318 C780 415 844 642 806 838" fill="none" stroke="#ffffff" strokeWidth="2" opacity=".5" />
      <g fill="#497e77" opacity=".45">
        <circle cx="694" cy="252" r="8"/><circle cx="782" cy="390" r="5"/><circle cx="720" cy="595" r="6"/><circle cx="866" cy="710" r="7"/>
      </g>
    </svg>
  );
}

function RuptureScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ruptureSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9eef5" />
          <stop offset="58%" stopColor="#eed4c5" />
          <stop offset="100%" stopColor="#d7b1a1" />
        </linearGradient>
        <linearGradient id="ruptureDark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#252c36" stopOpacity="0" />
          <stop offset="66%" stopColor="#252c36" stopOpacity=".22" />
          <stop offset="100%" stopColor="#20242d" stopOpacity=".74" />
        </linearGradient>
        <filter id="ruptureBlur"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <rect width="1600" height="960" fill="url(#ruptureSky)" />
      <rect width="1600" height="960" fill="url(#ruptureDark)" />
      <circle cx="340" cy="210" r="92" fill="#fff1bb" />
      <g stroke="#526d80" strokeWidth="5" opacity=".52">
        <path d="M80 730 L400 540 L700 690 L980 480 L1430 720" fill="none" />
        <path d="M120 520 L470 610 L760 420 L1110 620 L1490 470" fill="none" />
      </g>
      <g fill="#fff7d4" stroke="#8f705b" strokeWidth="3">
        <circle cx="400" cy="540" r="15"/><circle cx="700" cy="690" r="15"/><circle cx="980" cy="480" r="15"/><circle cx="470" cy="610" r="15"/><circle cx="760" cy="420" r="15"/><circle cx="1110" cy="620" r="15"/>
      </g>
      <path d="M815 70 L742 325 L829 310 L750 548 L910 300 L821 317 L910 70 Z" fill="#fff7d0" opacity=".9" />
      <path d="M805 70 L782 356 L842 348 L798 565" fill="none" stroke="#d95e47" strokeWidth="8" opacity=".86" />
      <circle cx="820" cy="350" r="150" fill="#e05d4b" opacity=".13" filter="url(#ruptureBlur)" />
      <g stroke="#352f33" strokeWidth="6" opacity=".55">
        <path d="M980 480 L1050 515"/><path d="M1072 525 L1110 620"/>
        <path d="M700 690 L740 645"/><path d="M760 630 L820 610"/>
      </g>
      <rect x="0" y="808" width="1600" height="152" fill="#7b675f" opacity=".46"/>
      <g fill="#3f3d40" opacity=".6">
        <rect x="80" y="705" width="92" height="103"/><rect x="188" y="744" width="72" height="64"/>
        <rect x="1230" y="682" width="126" height="126"/><rect x="1374" y="730" width="78" height="78"/>
      </g>
    </svg>
  );
}

function RitualScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ritualBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e7e3dc" />
          <stop offset="55%" stopColor="#f1eee8" />
          <stop offset="100%" stopColor="#d8ddd8" />
        </linearGradient>
        <radialGradient id="ritualLight">
          <stop offset="0%" stopColor="#fffdf3" stopOpacity=".95" />
          <stop offset="100%" stopColor="#fffdf3" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="960" fill="url(#ritualBg)" />
      <circle cx="1120" cy="410" r="340" fill="url(#ritualLight)" />
      <path d="M540 960 C630 720 720 585 815 450 C900 330 1010 270 1180 220" fill="none" stroke="#738078" strokeWidth="18" opacity=".22" />
      <g>
        <circle cx="610" cy="805" r="35" fill="#6a7771" />
        <circle cx="760" cy="610" r="30" fill="#78857e" />
        <circle cx="915" cy="438" r="25" fill="#879188" />
        <circle cx="1112" cy="285" r="20" fill="#9ba29a" />
      </g>
      <g fill="none" stroke="#9aa49f" strokeWidth="2" opacity=".65">
        <circle cx="610" cy="805" r="76"/><circle cx="760" cy="610" r="68"/><circle cx="915" cy="438" r="60"/><circle cx="1112" cy="285" r="52"/>
      </g>
      <path d="M1060 224 H1168 V332 H1060 Z" fill="#f7f2e8" stroke="#7c887f" strokeWidth="3"/>
      <path d="M1040 226 L1114 166 L1188 226 Z" fill="#718078"/>
      <rect x="1092" y="268" width="44" height="64" fill="#ceb693"/>
      <path d="M280 300 C420 240 520 240 650 318" fill="none" stroke="#c59676" strokeWidth="3" opacity=".34"/>
      <path d="M250 345 C450 265 560 315 715 420" fill="none" stroke="#83988e" strokeWidth="2" opacity=".3"/>
    </svg>
  );
}

function CivilizationScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="civilSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dedaf1" />
          <stop offset="50%" stopColor="#efe6ef" />
          <stop offset="100%" stopColor="#d6dfdd" />
        </linearGradient>
        <radialGradient id="civilGlow">
          <stop offset="0%" stopColor="#fff8d9" stopOpacity=".95" />
          <stop offset="100%" stopColor="#fff8d9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="960" fill="url(#civilSky)" />
      <circle cx="1185" cy="180" r="170" fill="url(#civilGlow)" />
      <path d="M0 620 Q230 460 430 585 T835 535 T1230 568 T1600 475 L1600 960 L0 960 Z" fill="#708783" opacity=".53"/>
      <path d="M0 700 Q260 570 470 660 T890 618 T1240 660 T1600 588 L1600 960 L0 960 Z" fill="#4e6f6b" opacity=".83"/>
      <g stroke="#6e5d91" strokeWidth="3" fill="#f5f0f8">
        <path d="M680 655 C680 510 754 420 835 420 C916 420 990 510 990 655 Z"/>
        <path d="M520 710 C520 595 580 525 650 525 C720 525 778 595 778 710 Z"/>
        <path d="M930 730 C930 575 1008 495 1092 495 C1176 495 1248 580 1248 730 Z"/>
      </g>
      <g fill="#725e9b" opacity=".75">
        <circle cx="835" cy="490" r="10"/><circle cx="650" cy="590" r="8"/><circle cx="1092" cy="566" r="8"/>
      </g>
      <g stroke="#9d8db9" strokeWidth="2" opacity=".6">
        <path d="M650 590 Q740 500 835 490"/><path d="M835 490 Q960 495 1092 566"/><path d="M650 590 Q870 710 1092 566"/>
      </g>
      <g fill="none" stroke="#eef4ef" strokeWidth="2" opacity=".55">
        <path d="M360 790 Q790 640 1300 790"/><path d="M430 840 Q820 710 1230 840"/>
      </g>
    </svg>
  );
}

function AbstractScene() {
  const dots = Array.from({ length: 78 }, (_, index) => {
    const col = index % 13;
    const row = Math.floor(index / 13);
    const x = 320 + col * 72 + (row % 2) * 18;
    const y = 190 + row * 90;
    const edge = col < 2 || col > 10 || row < 1;
    return { x, y, r: edge ? 8 : 13 + ((index * 7) % 8), opacity: edge ? .24 : .68 };
  });

  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="canvasBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fffdfa" />
          <stop offset="100%" stopColor="#f2efe9" />
        </linearGradient>
        <radialGradient id="canvasReveal">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="75%" stopColor="#ffffff" stopOpacity=".88" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="960" fill="url(#canvasBg)" />
      <g fill="#303235">
        {dots.map((dot, index) => (
          <circle key={index} cx={dot.x} cy={dot.y} r={dot.r} opacity={dot.opacity}/>
        ))}
      </g>
      <circle cx="1100" cy="490" r="240" fill="url(#canvasReveal)" />
      <g fill="none" stroke="#ae9dc5" strokeWidth="2" opacity=".48">
        <circle cx="1100" cy="490" r="150"/>
        <circle cx="1100" cy="490" r="190"/>
      </g>
      <path d="M1080 370 C960 430 975 580 1100 640 C1220 580 1236 430 1120 370" fill="none" stroke="#796b96" strokeWidth="3" opacity=".55"/>
    </svg>
  );
}

function DistortionScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="distortBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#efe2de" />
          <stop offset="45%" stopColor="#ddd4da" />
          <stop offset="100%" stopColor="#c7ced0" />
        </linearGradient>
        <filter id="blur18"><feGaussianBlur stdDeviation="18"/></filter>
      </defs>
      <rect width="1600" height="960" fill="url(#distortBg)" />
      <ellipse cx="1040" cy="500" rx="310" ry="370" fill="#564c58" opacity=".18" filter="url(#blur18)"/>
      <path d="M950 240 C1080 320 1100 450 1020 560 C920 700 1040 790 1195 832" fill="none" stroke="#745a67" strokeWidth="58" opacity=".3"/>
      <path d="M1120 170 C970 330 1260 430 1110 600 C1000 730 1180 840 1300 900" fill="none" stroke="#bc6651" strokeWidth="16" opacity=".34"/>
      <g fill="#5b4c56" opacity=".36">
        <circle cx="830" cy="280" r="18"/><circle cx="760" cy="430" r="11"/><circle cx="880" cy="610" r="14"/><circle cx="720" cy="710" r="8"/>
      </g>
      <path d="M360 720 C550 550 675 530 860 690" fill="none" stroke="#ffffff" strokeWidth="2" opacity=".52"/>
      <path d="M345 760 C545 635 700 635 910 760" fill="none" stroke="#8f9a99" strokeWidth="2" opacity=".44"/>
    </svg>
  );
}

export function SceneArtwork({ entity }: Props) {
  const family = entity.visual?.sceneFamily ?? (
    entity.kind === 'place' ? 'landscape' :
    entity.kind === 'person' ? 'portrait' :
    entity.kind === 'event' ? 'rupture' :
    entity.kind === 'concept' ? 'abstract' :
    'civilization'
  );

  if (family === 'landscape') return <LandscapeScene />;
  if (family === 'portrait') return <PortraitScene />;
  if (family === 'rupture') return <RuptureScene />;
  if (family === 'ritual') return <RitualScene />;
  if (family === 'civilization') return <CivilizationScene />;
  if (family === 'distortion') return <DistortionScene />;
  return <AbstractScene />;
}
