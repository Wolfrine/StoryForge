import type { StoryworldEntity } from '../domain/types';

interface Props {
  entity: StoryworldEntity;
}

function LandscapeScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8ddf2"/>
          <stop offset="48%" stopColor="#f0cfba"/>
          <stop offset="100%" stopColor="#f4c484"/>
        </linearGradient>
        <linearGradient id="ls-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#79aac1"/>
          <stop offset="46%" stopColor="#4e819c"/>
          <stop offset="100%" stopColor="#355d77"/>
        </linearGradient>
        <radialGradient id="ls-sun">
          <stop offset="0%" stopColor="#fff9d4" stopOpacity=".98"/>
          <stop offset="48%" stopColor="#ffd889" stopOpacity=".62"/>
          <stop offset="100%" stopColor="#ffd889" stopOpacity="0"/>
        </radialGradient>
        <filter id="ls-soft"><feGaussianBlur stdDeviation="2.8"/></filter>
        <filter id="ls-grain">
          <feTurbulence type="fractalNoise" baseFrequency=".58" numOctaves="2" seed="11"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
      </defs>

      <rect width="1600" height="960" fill="url(#ls-sky)"/>
      <circle cx="1264" cy="210" r="205" fill="url(#ls-sun)"/>
      <circle cx="1264" cy="210" r="63" fill="#fff2b4"/>

      <g opacity=".54" fill="#ffffff" filter="url(#ls-soft)">
        <path d="M140 190 C225 130 324 150 360 210 C290 225 214 228 132 218 Z"/>
        <path d="M990 122 C1064 78 1150 94 1192 146 C1125 166 1051 166 976 153 Z"/>
      </g>

      <path d="M0 565 L210 376 L365 497 L602 278 L820 514 L1032 330 L1264 526 L1600 354 L1600 700 L0 700 Z" fill="#849ab0" opacity=".48"/>
      <path d="M0 624 L165 500 L365 590 L566 388 L754 554 L925 452 L1112 570 L1328 416 L1600 594 L1600 740 L0 740 Z" fill="#526f88" opacity=".82"/>
      <path d="M0 666 Q320 607 650 653 T1150 642 T1600 622 L1600 760 L0 760 Z" fill="#4e6d59"/>

      <rect x="0" y="690" width="1600" height="270" fill="url(#ls-water)"/>
      <path d="M0 721 C290 706 490 745 764 728 S1280 706 1600 724" fill="none" stroke="#f7e8c8" strokeOpacity=".34" strokeWidth="3"/>
      <path d="M0 776 C250 758 510 794 828 775 S1280 754 1600 782" fill="none" stroke="#d7eef1" strokeOpacity=".26" strokeWidth="2"/>
      <path d="M0 842 C260 826 520 852 846 838 S1275 825 1600 846" fill="none" stroke="#d7eef1" strokeOpacity=".16" strokeWidth="2"/>

      <g opacity=".95">
        <g transform="translate(240 600)">
          <rect width="94" height="59" rx="4" fill="#efd6b4"/>
          <path d="M-12 3 L47 -34 L106 3 Z" fill="#75574f"/>
          <rect x="16" y="28" width="20" height="31" fill="#b87b61"/>
          <rect x="62" y="21" width="18" height="17" fill="#ffeab5"/>
        </g>
        <g transform="translate(372 618) scale(.82)">
          <rect width="94" height="59" rx="4" fill="#f4dfc4"/>
          <path d="M-12 3 L47 -34 L106 3 Z" fill="#87625a"/>
          <rect x="63" y="21" width="18" height="17" fill="#ffeab5"/>
        </g>
        <g transform="translate(512 580) scale(1.1)">
          <rect width="94" height="59" rx="4" fill="#eccda7"/>
          <path d="M-12 3 L47 -34 L106 3 Z" fill="#72544d"/>
          <rect x="16" y="28" width="20" height="31" fill="#b87b61"/>
          <rect x="62" y="21" width="18" height="17" fill="#ffefbd"/>
        </g>
        <g transform="translate(688 614) scale(.78)">
          <rect width="94" height="59" rx="4" fill="#f2d8b7"/>
          <path d="M-12 3 L47 -34 L106 3 Z" fill="#795a52"/>
          <rect x="62" y="21" width="18" height="17" fill="#ffefbd"/>
        </g>
      </g>

      <g opacity=".58">
        <path d="M250 693 L250 763" stroke="#ffe6a9" strokeWidth="12"/>
        <path d="M574 682 L574 777" stroke="#ffe7ad" strokeWidth="18"/>
        <path d="M704 698 L704 754" stroke="#ffe7ad" strokeWidth="9"/>
      </g>

      <g fill="#27495e">
        <path d="M1122 822 C1166 788 1228 787 1280 820 C1237 846 1168 849 1122 822 Z" opacity=".72"/>
        <path d="M1188 770 L1188 824 L1242 807 Z" fill="#f5e6c8" opacity=".92"/>
      </g>

      <g stroke="#324f44" strokeWidth="5" strokeLinecap="round" opacity=".76">
        <path d="M84 960 Q88 846 54 780"/>
        <path d="M116 960 Q116 846 132 806"/>
        <path d="M1504 960 Q1506 844 1546 766"/>
        <path d="M1540 960 Q1540 866 1582 820"/>
      </g>

      <g stroke="#30475e" strokeWidth="3" fill="none" opacity=".45">
        <path d="M1012 166 q18 -16 36 0 q18 -16 36 0"/>
        <path d="M1084 212 q14 -13 28 0 q14 -13 28 0"/>
      </g>

      <rect width="1600" height="960" filter="url(#ls-grain)" opacity=".035"/>
    </svg>
  );
}

function PortraitScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="pt-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dff1eb"/>
          <stop offset="58%" stopColor="#c8e2db"/>
          <stop offset="100%" stopColor="#f0d7bd"/>
        </linearGradient>
        <radialGradient id="pt-halo">
          <stop offset="0%" stopColor="#fffef9" stopOpacity=".9"/>
          <stop offset="64%" stopColor="#86c1b5" stopOpacity=".18"/>
          <stop offset="100%" stopColor="#86c1b5" stopOpacity="0"/>
        </radialGradient>
        <filter id="pt-soft"><feGaussianBlur stdDeviation="18"/></filter>
        <filter id="pt-grain">
          <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="2" seed="6"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
      </defs>

      <rect width="1600" height="960" fill="url(#pt-bg)"/>
      <circle cx="1120" cy="420" r="410" fill="url(#pt-halo)"/>
      <ellipse cx="1114" cy="525" rx="242" ry="350" fill="#ffffff" opacity=".16" filter="url(#pt-soft)"/>

      <path d="M958 960 C976 736 1010 626 1080 584 C1135 551 1215 559 1260 606 C1328 678 1360 797 1372 960 Z" fill="#527c75"/>
      <path d="M1060 592 C1074 548 1079 510 1072 470 L1214 465 C1204 520 1210 556 1232 596 C1181 626 1111 626 1060 592 Z" fill="#b97761"/>

      <path d="M1018 282 C1033 223 1093 188 1155 196 C1231 205 1286 262 1282 341 C1278 430 1242 502 1182 535 C1123 568 1056 539 1026 478 C996 417 994 364 1018 282 Z" fill="#bf8069"/>
      <path d="M1020 289 C1038 214 1111 175 1178 193 C1240 210 1281 257 1289 315 C1253 291 1216 280 1172 285 C1117 291 1080 313 1042 342 C1032 327 1024 308 1020 289 Z" fill="#283f3b"/>
      <path d="M1029 304 C1006 336 1005 384 1018 421 C1003 405 991 382 991 354 C991 330 1005 310 1029 304 Z" fill="#283f3b"/>
      <path d="M1269 307 C1290 343 1291 389 1276 431 C1295 408 1305 380 1304 350 C1303 329 1291 313 1269 307 Z" fill="#283f3b"/>

      <ellipse cx="1273" cy="399" rx="20" ry="30" fill="#b97761"/>
      <path d="M1270 391 C1278 386 1285 391 1283 400" fill="none" stroke="#8f564a" strokeWidth="3"/>

      <path d="M1068 359 Q1106 342 1140 360" fill="none" stroke="#4b423f" strokeWidth="7" strokeLinecap="round"/>
      <path d="M1183 353 Q1213 342 1239 359" fill="none" stroke="#4b423f" strokeWidth="7" strokeLinecap="round"/>
      <path d="M1078 379 Q1104 390 1129 379" fill="none" stroke="#2c3f3b" strokeWidth="4" strokeLinecap="round"/>
      <path d="M1186 376 Q1209 386 1230 376" fill="none" stroke="#2c3f3b" strokeWidth="4" strokeLinecap="round"/>

      <path d="M1161 374 C1157 407 1148 430 1138 448 C1148 454 1161 455 1172 450" fill="none" stroke="#92594c" strokeWidth="4" strokeLinecap="round"/>
      <path d="M1098 476 Q1151 499 1204 471" fill="none" stroke="#7b4e46" strokeWidth="5" strokeLinecap="round"/>
      <path d="M1115 492 Q1150 508 1185 490" fill="none" stroke="#e7b39e" strokeWidth="3" strokeLinecap="round" opacity=".65"/>

      <path d="M1084 545 Q1148 576 1214 543" fill="none" stroke="#f0c3a8" strokeWidth="5" opacity=".44"/>
      <path d="M1005 675 C1075 712 1237 714 1315 674" fill="none" stroke="#eff7f2" strokeWidth="8" opacity=".46"/>

      <path d="M650 178 C820 260 887 436 858 692" fill="none" stroke="#4b9489" strokeWidth="3" opacity=".34"/>
      <path d="M705 126 C934 262 969 488 900 803" fill="none" stroke="#be795b" strokeWidth="2" opacity=".26"/>
      <path d="M570 372 C757 429 846 566 846 796" fill="none" stroke="#ffffff" strokeWidth="2" opacity=".44"/>

      <g fill="#407c73" opacity=".38">
        <circle cx="708" cy="246" r="8"/><circle cx="786" cy="401" r="5"/><circle cx="724" cy="608" r="7"/><circle cx="866" cy="731" r="6"/>
      </g>

      <rect width="1600" height="960" filter="url(#pt-grain)" opacity=".03"/>
    </svg>
  );
}

function RuptureScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="rp-sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d6eaf0"/>
          <stop offset="50%" stopColor="#edd2c4"/>
          <stop offset="100%" stopColor="#8c8790"/>
        </linearGradient>
        <radialGradient id="rp-flash">
          <stop offset="0%" stopColor="#fff8c9" stopOpacity=".92"/>
          <stop offset="100%" stopColor="#ef6452" stopOpacity="0"/>
        </radialGradient>
        <filter id="rp-grain"><feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="2" seed="3"/><feColorMatrix type="saturate" values="0"/></filter>
      </defs>

      <rect width="1600" height="960" fill="url(#rp-sky)"/>
      <circle cx="803" cy="335" r="230" fill="url(#rp-flash)"/>
      <circle cx="330" cy="190" r="78" fill="#fff0b9" opacity=".72"/>

      <g fill="#4e4a52" opacity=".58">
        <rect x="0" y="742" width="180" height="218"/>
        <rect x="196" y="690" width="130" height="270"/>
        <rect x="348" y="770" width="96" height="190"/>
        <rect x="1260" y="684" width="170" height="276"/>
        <rect x="1450" y="732" width="150" height="228"/>
      </g>

      <g stroke="#4f6470" strokeWidth="5" fill="none" opacity=".54">
        <path d="M80 668 L390 520 L672 662 L973 462 L1422 691"/>
        <path d="M110 475 L460 590 L757 405 L1104 603 L1495 454"/>
      </g>
      <g fill="#fff1c8" stroke="#876b5d" strokeWidth="3">
        <circle cx="390" cy="520" r="13"/><circle cx="672" cy="662" r="13"/><circle cx="973" cy="462" r="13"/><circle cx="460" cy="590" r="13"/><circle cx="757" cy="405" r="13"/><circle cx="1104" cy="603" r="13"/>
      </g>

      <path d="M814 52 L733 315 L821 300 L742 550 L922 292 L831 310 L930 52 Z" fill="#fff6d0" opacity=".9"/>
      <path d="M808 65 L778 346 L839 337 L798 576" fill="none" stroke="#cf5548" strokeWidth="9"/>

      <g stroke="#373841" strokeWidth="6" opacity=".58">
        <path d="M672 662 L714 620"/><path d="M735 603 L792 585"/>
        <path d="M973 462 L1030 493"/><path d="M1052 505 L1104 603"/>
      </g>

      <g stroke="#34343c" strokeWidth="5" opacity=".55">
        <path d="M1180 725 L1180 548 M1135 605 L1225 605 M1152 548 L1208 548"/>
        <path d="M1180 548 L1106 742 M1180 548 L1256 742"/>
      </g>

      <rect width="1600" height="960" filter="url(#rp-grain)" opacity=".04"/>
    </svg>
  );
}

function RitualScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="rt-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ede9e1"/>
          <stop offset="55%" stopColor="#f5f1ea"/>
          <stop offset="100%" stopColor="#dce3df"/>
        </linearGradient>
        <radialGradient id="rt-light">
          <stop offset="0%" stopColor="#fffdf3" stopOpacity=".98"/>
          <stop offset="100%" stopColor="#fffdf3" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1600" height="960" fill="url(#rt-bg)"/>
      <circle cx="1130" cy="392" r="350" fill="url(#rt-light)"/>
      <path d="M490 960 C570 770 669 620 792 484 C894 371 1010 286 1186 210" fill="none" stroke="#77877e" strokeWidth="16" opacity=".18"/>
      <g fill="none" stroke="#8b9992" strokeWidth="2" opacity=".62">
        <circle cx="584" cy="800" r="72"/><circle cx="734" cy="620" r="64"/><circle cx="900" cy="452" r="56"/><circle cx="1110" cy="286" r="48"/>
      </g>
      <g>
        <circle cx="584" cy="800" r="30" fill="#718079"/>
        <circle cx="734" cy="620" r="27" fill="#7f8d85"/>
        <circle cx="900" cy="452" r="24" fill="#8e9990"/>
        <circle cx="1110" cy="286" r="20" fill="#9fa79f"/>
      </g>
      <path d="M1060 230 H1160 V330 H1060 Z" fill="#f9f3e7" stroke="#76857c" strokeWidth="3"/>
      <path d="M1040 232 L1110 174 L1180 232 Z" fill="#6e7d75"/>
      <rect x="1089" y="267" width="42" height="63" fill="#d4ba93"/>
      <path d="M250 330 C405 240 545 256 675 340" fill="none" stroke="#c38d6f" strokeWidth="3" opacity=".27"/>
      <path d="M214 386 C402 296 560 328 730 446" fill="none" stroke="#82998f" strokeWidth="2" opacity=".28"/>
    </svg>
  );
}

function CivilizationScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="cv-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9d8ee"/>
          <stop offset="52%" stopColor="#eee2ea"/>
          <stop offset="100%" stopColor="#d5dfdc"/>
        </linearGradient>
        <radialGradient id="cv-glow"><stop offset="0%" stopColor="#fff8d8" stopOpacity=".96"/><stop offset="100%" stopColor="#fff8d8" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="1600" height="960" fill="url(#cv-sky)"/>
      <circle cx="1190" cy="180" r="170" fill="url(#cv-glow)"/>
      <path d="M0 620 Q245 454 446 581 T856 530 T1240 565 T1600 466 L1600 960 L0 960 Z" fill="#6d8580" opacity=".5"/>
      <path d="M0 704 Q250 568 478 658 T905 616 T1260 658 T1600 584 L1600 960 L0 960 Z" fill="#4e706b" opacity=".83"/>
      <g stroke="#665d8f" strokeWidth="3" fill="#f7f1fa">
        <path d="M684 655 C684 510 754 418 836 418 C918 418 990 510 990 655 Z"/>
        <path d="M520 712 C520 595 579 524 650 524 C721 524 780 595 780 712 Z"/>
        <path d="M930 730 C930 575 1008 494 1093 494 C1178 494 1250 580 1250 730 Z"/>
      </g>
      <g fill="#6d6395"><circle cx="836" cy="490" r="9"/><circle cx="650" cy="590" r="8"/><circle cx="1093" cy="565" r="8"/></g>
      <g stroke="#9f95b5" strokeWidth="2" opacity=".58">
        <path d="M650 590 Q742 500 836 490"/><path d="M836 490 Q960 495 1093 565"/><path d="M650 590 Q870 710 1093 565"/>
      </g>
      <g fill="none" stroke="#eef5ef" strokeWidth="2" opacity=".55"><path d="M340 792 Q790 640 1310 790"/><path d="M418 844 Q810 708 1240 842"/></g>
    </svg>
  );
}

function AbstractScene() {
  const dots = Array.from({ length: 84 }, (_, index) => {
    const col = index % 14;
    const row = Math.floor(index / 14);
    const x = 300 + col * 70 + (row % 2) * 15;
    const y = 176 + row * 93;
    const edge = col < 2 || col > 11 || row < 1;
    return { x, y, r: edge ? 7 : 10 + ((index * 5) % 11), opacity: edge ? .18 : .58 };
  });

  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ab-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fffefa"/><stop offset="100%" stopColor="#f0ede7"/></linearGradient>
        <radialGradient id="ab-reveal"><stop offset="0%" stopColor="#fff" stopOpacity="1"/><stop offset="72%" stopColor="#fff" stopOpacity=".9"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="1600" height="960" fill="url(#ab-bg)"/>
      <g fill="#303236">{dots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r={dot.r} opacity={dot.opacity}/>)}</g>
      <circle cx="1110" cy="485" r="252" fill="url(#ab-reveal)"/>
      <g fill="none" stroke="#ad9ac6" strokeWidth="2" opacity=".44"><circle cx="1110" cy="485" r="150"/><circle cx="1110" cy="485" r="196"/><circle cx="1110" cy="485" r="226"/></g>
      <path d="M1090 362 C972 428 978 574 1112 646 C1232 572 1242 426 1130 362" fill="none" stroke="#786a96" strokeWidth="3" opacity=".53"/>
    </svg>
  );
}

function DistortionScene() {
  return (
    <svg className="scene-svg" viewBox="0 0 1600 960" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ds-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#eee0dc"/><stop offset="44%" stopColor="#ddd2d8"/><stop offset="100%" stopColor="#c6ced0"/></linearGradient>
        <filter id="ds-blur"><feGaussianBlur stdDeviation="20"/></filter>
      </defs>
      <rect width="1600" height="960" fill="url(#ds-bg)"/>
      <ellipse cx="1040" cy="500" rx="320" ry="380" fill="#574c58" opacity=".18" filter="url(#ds-blur)"/>
      <path d="M950 230 C1090 316 1112 448 1022 568 C918 706 1036 792 1196 840" fill="none" stroke="#735965" strokeWidth="58" opacity=".3"/>
      <path d="M1124 164 C966 330 1266 428 1110 602 C1000 734 1182 844 1306 904" fill="none" stroke="#bc6550" strokeWidth="16" opacity=".34"/>
      <g fill="#584a54" opacity=".34"><circle cx="826" cy="276" r="18"/><circle cx="760" cy="428" r="11"/><circle cx="884" cy="610" r="14"/><circle cx="720" cy="714" r="8"/></g>
      <path d="M360 720 C550 548 676 530 860 690" fill="none" stroke="#ffffff" strokeWidth="2" opacity=".52"/>
      <path d="M346 760 C548 634 700 636 912 760" fill="none" stroke="#8d9998" strokeWidth="2" opacity=".44"/>
    </svg>
  );
}

export function SceneArtwork({ entity }: Props) {
  const family =
    entity.visual?.sceneFamily ??
    (entity.kind === 'place'
      ? 'landscape'
      : entity.kind === 'person'
        ? 'portrait'
        : entity.kind === 'event'
          ? 'rupture'
          : entity.kind === 'concept'
            ? 'abstract'
            : 'civilization');

  if (family === 'landscape') return <LandscapeScene />;
  if (family === 'portrait') return <PortraitScene />;
  if (family === 'rupture') return <RuptureScene />;
  if (family === 'ritual') return <RitualScene />;
  if (family === 'civilization') return <CivilizationScene />;
  if (family === 'distortion') return <DistortionScene />;
  return <AbstractScene />;
}
