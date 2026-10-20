import { useEffect, useRef, useState, type ReactNode } from "react"

const CONTRACT_ADDRESS = "J4ixzSEG99FWNoHRYfoaE3y2e7T7e7KX8NKNPy96pump"

const NAV_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#buy", label: "How to buy" },
  { href: "#tokenomics", label: "Tokenomics" },
  { href: "#memes", label: "Memes" },
  { href: "#community", label: "Community" },
]

const MEMES = [
  {
    src: "/assets/meme-legend-plz.jpg",
    alt: "Meme: LEGEND PLZ, an iguana in a tuxedo",
  },
  {
    src: "/assets/meme-yo-legend.jpg",
    alt: "Meme: YO LEGEND, a yellow lizard in a pinstripe suit",
  },
  {
    src: "/assets/meme-suffering.jpg",
    alt: "Meme: LEGEND I’M SUFFERING, a green frog in a suit",
  },
  {
    src: "/assets/meme-please.jpg",
    alt: "Meme: LEGEND PLEASE, a yellow and black frog in a suit",
  },
  {
    src: "/assets/meme-pardon.jpg",
    alt: "Meme: PARDON ME LEGEND, a toad in a patterned suit",
  },
  {
    src: "/assets/meme-hello.jpg",
    alt: "Meme: HELLO LEGEND, a bearded dragon in a red jacket",
  },
  {
    src: "/assets/meme-turtle.jpg",
    alt: "Meme: LEGEND PLZ, a turtle-headed lizard in a teal suit",
  },
  {
    src: "/assets/meme-dont-lie.jpg",
    alt: "Meme: DON’T LIE TO ME LEGEND, a green lizard in a suit",
  },
]

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M5 15 15 5M7 5h8v8" />
    </svg>
  )
}

function CopyIcon({ checked = false }: { checked?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      {checked ? (
        <path d="m4 10 4 4 8-9" />
      ) : (
        <>
          <rect x="7" y="7" width="9" height="9" rx="2" />
          <path d="M13 7V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" />
        </>
      )}
    </svg>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {open ? (
        <path d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  )
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible")
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal delay-${delay} ${className}`}>
      {children}
    </div>
  )
}

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number
  suffix?: string
}) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        if (reducedMotion) {
          setDisplay(value)
          return
        }
        const started = performance.now()
        const duration = 1200
        const tick = (now: number) => {
          const progress = Math.min((now - started) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.round(value * eased))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}

function ContractCard() {
  const [copied, setCopied] = useState(false)

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="contract-card">
      <div className="contract-content">
        <span>Official contract address</span>
        <code>{CONTRACT_ADDRESS}</code>
      </div>
      <button
        className={`copy-button ${copied ? "copied" : ""}`}
        type="button"
        onClick={copyAddress}
        aria-label="Copy contract address"
      >
        <CopyIcon checked={copied} />
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [progress, setProgress] = useState(0)
  const [selectedMeme, setSelectedMeme] = useState<typeof MEMES[number] | null>(
    null,
  )

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.querySelector(item.href),
    ).filter(Boolean) as Element[]
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id)
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!selectedMeme) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMeme(null)
    }
    document.body.classList.add("modal-open")
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.classList.remove("modal-open")
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [selectedMeme])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header className="site-header">
        <div className="shell nav-shell">
          <a
            className="logo"
            href="#top"
            onClick={closeMenu}
            aria-label="Legend home"
          >
            <img src="/assets/legend-avatar.jpg" alt="" />
            <span>
              LEGEND<strong>.</strong>
            </span>
          </a>
          <button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            <MenuIcon open={menuOpen} />
            <span>{menuOpen ? "Close" : "Menu"}</span>
          </button>
          <nav
            id="main-navigation"
            className={menuOpen ? "open" : ""}
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={activeSection === item.href.slice(1) ? "active" : ""}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero shell">
          <div className="hero-copy">
            <div className="eyebrow hero-sequence sequence-1">
              <span className="status-dot" /> Built on Solana <i /> $LEGEND
            </div>
            <h1 className="hero-sequence sequence-2">
              The coin for <em>everyday legends.</em>
            </h1>
            <p className="hero-sub hero-sequence sequence-3">
              Garri, indomie, jollof and gbas gbos. A community memecoin powered
              by reply guy energy.
            </p>
            <div className="hero-actions hero-sequence sequence-4">
              <a className="button button-primary" href="#buy">
                How to buy <ArrowIcon />
              </a>
              <a
                className="button button-secondary"
                href="https://x.com/LegendReplyGuy?s=20"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow on X <ArrowIcon />
              </a>
            </div>
          </div>

          <div
            className="hero-art hero-sequence sequence-3"
            aria-label="Legend, the tuxedo gecko mascot"
          >
            <div className="hero-glow" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="mascot-frame">
              <img
                src="/assets/legend-mascot.jpg"
                alt="Legend, a gecko in a tuxedo and bow tie"
              />
              <span className="mascot-shine" />
            </div>
            <span className="floating-tag tag-one">SHOW UP</span>
            <span className="floating-tag tag-two">REPLY</span>
            <span className="floating-tag tag-three">LEGENDARY</span>
          </div>

          <div className="hero-contract hero-sequence sequence-5">
            <ContractCard />
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[0, 1].map((set) => (
              <div className="ticker-set" key={set}>
                <span>SHOW UP</span>
                <i /> <span>REPLY</span>
                <i /> <span>NEVER LOG OFF</span>
                <i /> <span>EVERYDAY LEGENDS</span>
                <i />
              </div>
            ))}
          </div>
        </div>

        <section id="about" className="section shell">
          <Reveal>
            <div className="section-heading">
              <span className="kicker">01 — The story</span>
              <h2>
                Built by the people who <em>always show up.</em>
              </h2>
            </div>
          </Reveal>
          <div className="about-layout">
            <Reveal className="about-visual">
              <div className="portrait-card">
                <img
                  src="/assets/legend-mascot.jpg"
                  alt="Legend, a gecko in a tuxedo and bow tie"
                />
                <span>THE ORIGINAL REPLY GUY</span>
              </div>
            </Reveal>
            <Reveal className="about-copy" delay={1}>
              <p>
                Legend is a community memecoin built on reply guy culture: show
                up, reply, and never log off. That energy is doing real work.
              </p>
              <p>
                So far, the Legend community has{" "}
                <a
                  className="text-link"
                  href="https://x.com/LegendReplyGuy/status/2029248097273160040?s=20"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  built a school in Nigeria <ArrowIcon />
                </a>
                .
              </p>
              <div className="facts">
                <div>
                  <span>Network</span>
                  <strong>Solana</strong>
                </div>
                <div>
                  <span>Ticker</span>
                  <strong>$LEGEND</strong>
                </div>
                <div>
                  <span>Community</span>
                  <strong>X + Telegram</strong>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="buy" className="section section-tint">
          <div className="shell">
            <Reveal>
              <div className="section-heading split-heading">
                <div>
                  <span className="kicker">02 — Get Legend</span>
                  <h2>
                    Four steps to become <em>legendary.</em>
                  </h2>
                </div>
                <p>
                  New to Solana? Follow this simple path and always verify the
                  official contract address before swapping.
                </p>
              </div>
            </Reveal>
            <div className="steps">
              {[
                [
                  "Get a Solana wallet",
                  "Install a wallet you trust, such as Phantom or Solflare. Keep your seed phrase offline and never share it.",
                ],
                [
                  "Buy SOL",
                  "Fund your wallet with SOL from an exchange you use, then send it to your wallet address.",
                ],
                [
                  "Open a Solana DEX",
                  "Visit a Solana DEX such as pump.fun or Jupiter and connect your wallet.",
                ],
                [
                  "Swap SOL for Legend",
                  "Paste the verified contract address, review the details, and confirm your swap.",
                ],
              ].map(([title, body], index) => (
                <Reveal
                  className="step-card"
                  delay={(index % 4) + 1}
                  key={title}
                >
                  <span className="step-number">0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                  <span className="step-arrow">
                    <ArrowIcon />
                  </span>
                </Reveal>
              ))}
            </div>
            <Reveal className="inline-contract">
              <ContractCard />
            </Reveal>
          </div>
        </section>

        <section id="tokenomics" className="section shell">
          <Reveal>
            <div className="section-heading split-heading">
              <div>
                <span className="kicker">03 — Tokenomics</span>
                <h2>
                  Simple by <em>design.</em>
                </h2>
              </div>
              <p>
                No complicated mechanics. Just clear numbers and a community
                built around showing up.
              </p>
            </div>
          </Reveal>
          <div className="stats-grid">
            <Reveal className="stat-card stat-wide" delay={1}>
              <span>Total supply</span>
              <strong>
                <AnimatedNumber value={1_000_000_000} />
              </strong>
              <i className="stat-line" />
            </Reveal>
            <Reveal className="stat-card" delay={2}>
              <span>Liquidity</span>
              <strong>
                <AnimatedNumber value={21} suffix="%" />
              </strong>
              <small>at graduation</small>
            </Reveal>
            <Reveal className="stat-card" delay={3}>
              <span>Tax</span>
              <strong>
                <AnimatedNumber value={0} suffix="%" />
              </strong>
              <small>buy and sell</small>
            </Reveal>
            <Reveal className="stat-card stat-dark" delay={4}>
              <span>Mint / freeze authority</span>
              <strong>Revoked</strong>
              <small>
                <span className="status-dot" /> Verified status
              </small>
            </Reveal>
          </div>
        </section>

        <section id="memes" className="section memes-section">
          <div className="shell">
            <Reveal>
              <div className="section-heading split-heading">
                <div>
                  <span className="kicker">04 — The culture</span>
                  <h2>
                    The reply guys ask.
                    <br />
                    <em>Legend sees all.</em>
                  </h2>
                </div>
                <p>
                  A growing archive of the community’s finest replies. Tap any
                  meme for the full-size version.
                </p>
              </div>
            </Reveal>
            <div className="meme-grid">
              {MEMES.map((meme, index) => (
                <Reveal
                  className={`meme-item meme-${(index % 4) + 1}`}
                  delay={(index % 4) + 1}
                  key={meme.src}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedMeme(meme)}
                    aria-label={`Open ${meme.alt}`}
                  >
                    <img src={meme.src} alt={meme.alt} loading="lazy" />
                    <span>
                      VIEW MEME <ArrowIcon />
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="community" className="section shell">
          <Reveal>
            <div className="community-panel">
              <div className="community-copy">
                <span className="kicker">05 — Join the movement</span>
                <h2>
                  Don’t just watch.
                  <br />
                  <em>Become a legend.</em>
                </h2>
                <p>
                  Updates, memes, bounties, and maximum reply guy energy live
                  here.
                </p>
                <div className="community-actions">
                  <a
                    className="button button-light"
                    href="https://x.com/LegendReplyGuy?s=20"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Follow on X <ArrowIcon />
                  </a>
                  <a
                    className="button button-outline-light"
                    href="https://t.me/legendreplyguys"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Telegram <ArrowIcon />
                  </a>
                  <a
                    className="button button-text-light"
                    href={`https://pump.fun/coin/${CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View chart <ArrowIcon />
                  </a>
                </div>
              </div>
              <div className="community-mascot" aria-hidden="true">
                <div className="community-orbit" />
                <img src="/assets/legend-mascot.jpg" alt="" />
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer-top">
          <a className="logo" href="#top" aria-label="Legend home">
            <img src="/assets/legend-avatar.jpg" alt="" />
            <span>
              LEGEND<strong>.</strong>
            </span>
          </a>
          <p>Made for everyday legends. Built on Solana.</p>
          <div className="footer-links">
            <a
              href="https://x.com/LegendReplyGuy?s=20"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
            <a
              href="https://t.me/legendreplyguys"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </a>
            <a
              href={`https://pump.fun/coin/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chart
            </a>
          </div>
        </div>
        <div className="shell disclaimer">
          <p>
            Legend is a memecoin with no intrinsic value or promise of returns.
            This site is not financial advice. Only spend what you can afford to
            lose, and do your own research.
          </p>
          <span>© {new Date().getFullYear()} LEGEND</span>
        </div>
      </footer>

      {selectedMeme && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Meme preview"
          onClick={() => setSelectedMeme(null)}
        >
          <button
            className="lightbox-close"
            type="button"
            onClick={() => setSelectedMeme(null)}
            aria-label="Close meme preview"
          >
            <MenuIcon open />
          </button>
          <img
            src={selectedMeme.src}
            alt={selectedMeme.alt}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

export default App
