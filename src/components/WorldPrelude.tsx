interface Props {
  onEnter: () => void;
  onAtlas: () => void;
}

export function WorldPrelude({ onEnter, onAtlas }: Props) {
  return (
    <section className="prelude">
      <div className="prelude-art" aria-hidden="true">
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="preludeSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cbdfe3" />
              <stop offset="43%" stopColor="#f1d7bc" />
              <stop offset="100%" stopColor="#d5c08f" />
            </linearGradient>
            <linearGradient id="preludeWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8fb5b4" />
              <stop offset="100%" stopColor="#355d63" />
            </linearGradient>
            <radialGradient id="preludeSun">
              <stop offset="0%" stopColor="#fff3c8" />
              <stop offset="58%" stopColor="#f5c373" />
              <stop offset="100%" stopColor="#efb469" stopOpacity="0" />
            </radialGradient>
            <filter id="softGrain">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="8" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>

          <rect width="1600" height="1000" fill="url(#preludeSky)" />
          <circle cx="1210" cy="246" r="175" fill="url(#preludeSun)" opacity="0.78" />
          <circle cx="1304" cy="152" r="44" fill="#f7f4df" opacity="0.92" />

          <path d="M0 542 C190 405 315 455 480 335 C638 222 760 392 904 314 C1110 204 1250 420 1600 330 L1600 690 L0 690Z" fill="#63786d" opacity="0.9" />
          <path d="M0 602 C220 470 402 520 572 444 C760 358 950 520 1128 430 C1300 342 1430 440 1600 390 L1600 690 L0 690Z" fill="#859483" opacity="0.95" />
          <path d="M0 654 C260 584 390 612 620 574 C905 526 1186 612 1600 532 L1600 722 L0 722Z" fill="#b6aa80" />

          <path d="M0 654 C300 622 580 635 815 612 C1090 586 1300 605 1600 560 L1600 1000 L0 1000Z" fill="url(#preludeWater)" />
          <path d="M565 642 C770 660 1028 650 1225 618" fill="none" stroke="#f3dfad" strokeWidth="9" opacity="0.42" strokeLinecap="round" />
          <path d="M710 686 C930 705 1116 690 1378 652" fill="none" stroke="#c5dfd9" strokeWidth="4" opacity="0.32" strokeLinecap="round" />
          <path d="M112 746 C460 700 880 748 1430 692" fill="none" stroke="#dbeee8" strokeWidth="2" opacity="0.28" />

          <g fill="#695e4f" opacity="0.92">
            <path d="M1092 583 l30 -21 l32 21 v34 h-62z" />
            <path d="M1160 598 l23 -17 l26 17 v27 h-49z" />
            <path d="M1028 605 l20 -15 l24 15 v24 h-44z" />
          </g>
          <g stroke="#e5bd72" strokeWidth="3" opacity="0.92">
            <line x1="1118" y1="582" x2="1118" y2="618" />
            <line x1="1183" y1="598" x2="1183" y2="626" />
            <line x1="1049" y1="605" x2="1049" y2="630" />
          </g>

          <path d="M0 875 C190 808 338 850 520 808 C716 762 885 835 1055 796 C1260 748 1395 790 1600 724 L1600 1000 L0 1000Z" fill="#263f3d" opacity="0.95" />

          <g stroke="#526b5f" strokeWidth="7" strokeLinecap="round" opacity="0.82">
            <path d="M110 1000 Q110 875 95 806" />
            <path d="M168 1000 Q155 882 178 824" />
            <path d="M1478 1000 Q1472 858 1512 786" />
            <path d="M1532 1000 Q1520 870 1555 832" />
          </g>

          <rect width="1600" height="1000" filter="url(#softGrain)" opacity="0.055" />
        </svg>
      </div>

      <div className="prelude-vignette" />

      <header className="prelude-topline">
        <span>StoryForge</span>
        <span>NovaSaga / an explorable storyworld</span>
      </header>

      <div className="prelude-copy">
        <div className="prelude-kicker">A world does not need to be read in order.</div>
        <h1>NovaSaga</h1>
        <p>
          When the wires went quiet, older things became visible.
          Not all of them were meant to be found.
        </p>
        <div className="prelude-actions">
          <button className="prelude-enter" type="button" onClick={onEnter}>
            <span>Begin with a place</span>
            <strong>Enter Sunset Moonland</strong>
            <i>↗</i>
          </button>
          <button className="prelude-atlas" type="button" onClick={onAtlas}>
            Open the world atlas
          </button>
        </div>
      </div>

      <div className="prelude-footnote">
        <span>01</span>
        <p>Move by curiosity. The world will explain itself only when you ask it to.</p>
      </div>
    </section>
  );
}
