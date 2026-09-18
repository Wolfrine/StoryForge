import type { StoryworldEntity } from '../domain/types';

interface Props {
  entity: StoryworldEntity;
}

function Landscape() {
  return (
    <svg className="scene-svg" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="scenePlaceSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sf-sky-top)" />
          <stop offset="100%" stopColor="var(--sf-sky-bottom)" />
        </linearGradient>
        <linearGradient id="scenePlaceWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="color-mix(in srgb, var(--sf-scene-a) 70%, white)" />
          <stop offset="100%" stopColor="var(--sf-scene-a)" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#scenePlaceSky)" />
      <circle cx="880" cy="216" r="104" fill="var(--sf-glow)" opacity="0.72" />
      <circle cx="982" cy="140" r="30" fill="#fff8df" opacity="0.88" />
      <path d="M0 490 C170 365 280 408 412 310 C560 204 660 364 768 310 C920 232 1024 366 1200 276 V618 H0Z" fill="var(--sf-scene-a)" opacity="0.78" />
      <path d="M0 566 C180 462 342 492 506 426 C682 354 802 488 958 425 C1070 382 1140 404 1200 382 V640 H0Z" fill="var(--sf-scene-b)" opacity="0.86" />
      <path d="M0 612 C220 575 364 600 552 570 C780 534 948 590 1200 522 V900 H0Z" fill="url(#scenePlaceWater)" />
      <path d="M386 633 C600 656 765 642 970 610" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="5" strokeLinecap="round" />
      <path d="M178 714 C478 672 730 708 1080 658" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="2" />
      <g fill="color-mix(in srgb, var(--sf-scene-a) 70%, black)">
        <path d="M824 516 l28 -19 l31 19 v34 h-59z" />
        <path d="M890 531 l22 -16 l24 16 v28 h-46z" />
        <path d="M760 536 l18 -14 l21 14 v24 h-39z" />
      </g>
      <path d="M0 816 C220 744 376 790 560 750 C742 712 872 772 1200 690 V900 H0Z" fill="color-mix(in srgb, var(--sf-scene-a) 68%, black)" opacity="0.92" />
    </svg>
  );
}

function Portrait() {
  return (
    <svg className="scene-svg" viewBox="0 0 1000 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="portraitBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--sf-sky-top)" />
          <stop offset="100%" stopColor="var(--sf-sky-bottom)" />
        </linearGradient>
        <radialGradient id="portraitHalo">
          <stop offset="0%" stopColor="var(--sf-glow)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--sf-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="900" fill="url(#portraitBg)" />
      <circle cx="596" cy="348" r="260" fill="url(#portraitHalo)" />
      <path d="M0 690 C210 610 360 650 540 604 C740 552 860 608 1000 578 V900 H0Z" fill="var(--sf-scene-b)" opacity="0.55" />
      <path d="M0 746 C210 690 382 738 610 676 C760 636 860 662 1000 626 V900 H0Z" fill="var(--sf-scene-a)" opacity="0.72" />
      <ellipse cx="610" cy="305" rx="118" ry="142" fill="color-mix(in srgb, var(--sf-scene-a) 72%, #1d2826)" />
      <path d="M420 828 C440 612 502 500 608 500 C724 500 808 620 834 900 H384Z" fill="color-mix(in srgb, var(--sf-scene-a) 76%, #182321)" />
      <path d="M468 500 C518 458 700 454 758 506" fill="none" stroke="var(--sf-glow)" strokeWidth="2" opacity="0.44" />
      <path d="M268 304 C374 220 424 178 526 132" fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="2" opacity="0.52" />
      <path d="M180 354 C340 356 392 330 488 280" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1.5" />
      <circle cx="294" cy="294" r="7" fill="var(--sf-glow)" />
      <circle cx="214" cy="354" r="4" fill="var(--sf-accent)" />
      <circle cx="392" cy="214" r="4" fill="var(--sf-accent)" />
    </svg>
  );
}

function Event() {
  return (
    <svg className="scene-svg" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="eventSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sf-sky-top)" />
          <stop offset="70%" stopColor="var(--sf-sky-bottom)" />
          <stop offset="100%" stopColor="color-mix(in srgb, var(--sf-sky-bottom) 55%, white)" />
        </linearGradient>
        <radialGradient id="eventBurst">
          <stop offset="0%" stopColor="#fff8d6" />
          <stop offset="38%" stopColor="var(--sf-glow)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--sf-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#eventSky)" />
      <circle cx="712" cy="228" r="210" fill="url(#eventBurst)" />
      <g stroke="var(--sf-accent)" strokeWidth="1" opacity="0.32">
        <path d="M0 236 L1200 430" />
        <path d="M0 332 L1200 516" />
        <path d="M0 434 L1200 604" />
        <path d="M160 0 L486 900" />
        <path d="M360 0 L638 900" />
        <path d="M570 0 L800 900" />
        <path d="M770 0 L956 900" />
      </g>
      <g fill="var(--sf-scene-a)" opacity="0.88">
        <rect x="0" y="650" width="1200" height="250" />
        <rect x="90" y="542" width="80" height="108" />
        <rect x="198" y="590" width="114" height="60" />
        <rect x="344" y="508" width="92" height="142" />
        <rect x="472" y="560" width="150" height="90" />
        <rect x="658" y="500" width="102" height="150" />
        <rect x="792" y="574" width="130" height="76" />
        <rect x="954" y="520" width="84" height="130" />
      </g>
      <g stroke="#f7e8c2" strokeWidth="3" opacity="0.75">
        <path d="M132 542 v108" />
        <path d="M390 508 v142" />
        <path d="M708 500 v150" />
        <path d="M996 520 v130" />
      </g>
      <path d="M164 582 C280 538 380 532 508 580 C672 640 794 548 946 566" fill="none" stroke="#f7e8c2" strokeWidth="3" strokeDasharray="14 16" opacity="0.68" />
      <path d="M610 165 L665 270 L628 270 L690 390" fill="none" stroke="#fff8db" strokeWidth="5" strokeLinecap="round" opacity="0.76" />
    </svg>
  );
}

function Sanctuary() {
  return (
    <svg className="scene-svg" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sanctuaryBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sf-sky-top)" />
          <stop offset="100%" stopColor="var(--sf-sky-bottom)" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#sanctuaryBg)" />
      <circle cx="840" cy="180" r="92" fill="var(--sf-glow)" opacity="0.62" />
      <path d="M0 650 C230 530 344 600 510 504 C664 416 822 520 1200 398 V900 H0Z" fill="var(--sf-scene-b)" opacity="0.54" />
      <g fill="none" stroke="var(--sf-scene-a)" strokeWidth="24" opacity="0.9">
        <path d="M262 714 V432 C262 318 354 226 468 226 C582 226 674 318 674 432 V714" />
        <path d="M404 714 V502 C404 430 464 370 536 370 C608 370 668 430 668 502 V714" opacity="0.72" />
      </g>
      <g fill="var(--sf-scene-a)" opacity="0.88">
        <rect x="188" y="714" width="700" height="46" rx="8" />
        <rect x="236" y="762" width="610" height="34" rx="8" opacity="0.72" />
        <rect x="322" y="804" width="460" height="28" rx="8" opacity="0.58" />
      </g>
      <g fill="var(--sf-scene-c)">
        <circle cx="198" cy="700" r="18" />
        <circle cx="900" cy="690" r="16" />
        <circle cx="158" cy="730" r="9" />
        <circle cx="940" cy="720" r="8" />
      </g>
      <g stroke="rgba(255,255,255,.48)" strokeWidth="2" opacity="0.55">
        <path d="M472 226 V120" />
        <path d="M536 370 V286" />
        <path d="M302 410 C382 344 446 318 516 318" />
      </g>
    </svg>
  );
}

function Concept() {
  return (
    <svg className="scene-svg" viewBox="0 0 1100 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="conceptBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#faf8f1" />
          <stop offset="100%" stopColor="var(--sf-sky-bottom)" />
        </linearGradient>
      </defs>
      <rect width="1100" height="900" fill="url(#conceptBg)" />
      <rect x="175" y="120" width="740" height="650" rx="26" fill="#fffdfa" stroke="var(--sf-border)" strokeWidth="2" />
      <g opacity="0.82">
        {[
          [270, 260, 18],[360, 205, 9],[438, 304, 27],[530, 230, 13],[640, 278, 22],
          [722, 206, 8],[790, 338, 18],[328, 420, 24],[480, 445, 10],[604, 420, 30],
          [744, 472, 15],[282, 582, 12],[412, 620, 22],[602, 590, 11],[780, 604, 25]
        ].map(([cx, cy, r], index) => (
          <circle
            key={index}
            cx={cx}
            cy={cy}
            r={r}
            fill={index % 3 === 0 ? 'var(--sf-accent)' : index % 3 === 1 ? 'var(--sf-scene-a)' : 'var(--sf-scene-c)'}
            opacity={0.45 + (index % 4) * 0.1}
          />
        ))}
      </g>
      <circle cx="565" cy="470" r="128" fill="#fffdfa" opacity="0.93" />
      <circle cx="565" cy="470" r="92" fill="none" stroke="var(--sf-accent)" strokeWidth="2" strokeDasharray="4 12" opacity="0.32" />
      <path d="M512 470 H618" stroke="var(--sf-accent)" strokeWidth="1.5" opacity="0.4" />
      <path d="M565 416 V524" stroke="var(--sf-accent)" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

export function SceneArtwork({ entity }: Props) {
  if (entity.kind === 'place') return <Landscape />;
  if (entity.kind === 'person') return <Portrait />;
  if (entity.kind === 'event') return <Event />;
  if (entity.kind === 'faction') return <Sanctuary />;
  if (entity.kind === 'concept') return <Concept />;
  return <Sanctuary />;
}
