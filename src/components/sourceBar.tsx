import type { ReactNode } from "react";
import { GlossySquircle, squircleWellStyle } from "./ui/squircle/glossy";

/* The Episodes source filter as an iOS segmented control: a recessed squircle
   well with one glossy porcelain thumb that slides under whichever source is
   selected. Picking YouTube or Reddit glides the thumb there rather than snapping
   a new highlight on — one moving object reads as a single continuous gesture.

   Logos come from public/dp, which ships the real brand marks — web_logo.png
   included. "All" is a word, not a glyph: it means "no filter", which no symbol
   says as plainly as the label does.
   ponytail: no lucide-react — every glyph is already in the repo. */
const logo = (file: string) => <img src={`/dp/${file}`} alt="" className="size-[22px] shrink-0" />;

const SOURCES: { tab: string; label: string; icon: ReactNode }[] = [
    // "no filter" reads better as a word than as another glyph competing with four logos
    { tab: "dashboard", label: "all", icon: <span className="text-[0.82rem] font-[600] tracking-[-0.01em] text-[#3F3F46]">All</span> },
    { tab: "dashboard-YOUTUBE", label: "youtube", icon: logo("youtube-logo.svg") },
    { tab: "dashboard-TWITTER", label: "x", icon: logo("x-logo.svg") },
    { tab: "dashboard-REDDIT", label: "reddit", icon: logo("reddit-icon.svg") },
    { tab: "dashboard-WEB", label: "web", icon: logo("web_logo.png") },
];

/* exponent 2 is a true circle in superellipse terms, so at radius = half the
   height both ends come out as exact semicircles — a real pill, matching the
   input's border-radius rather than the squarer exponent-5 squircle. */
const ROUND = 2;

/* Sized to sit level with the QuickAdd field beside it, whose box is
   2px rim + 6px pad + 36px button + 6px pad + 2px rim = 52px, with a radius that
   clamps to a full stadium. Radius here is half the height for the same reason:
   at smoothing 1 squirclePath clamps to min(w,h)/2, so H/2 is as round as the
   superellipse goes — the squircle equivalent of a pill. */
const H = 52;                       // == QuickAdd's outer height
const PAD = 5;                      // well inset, so the thumb never touches the rim
const SEG = 52;                     // per-source width
const W = SEG * SOURCES.length + PAD * 2;
const THUMB = H - PAD * 2;

/* The reference animates `left`; this animates `transform` instead — same motion,
   but it stays on the compositor so the slide can't jank against the card grid
   re-laying out behind it. Curve is Apple's own 0.32/0.72/0/1. */
const GLIDE = "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)";

const SourceBar = ({ tab, onPick, inline = false }: { tab: string; onPick: (tab: string) => void; inline?: boolean }) => {
    // an unknown tab (a collection, say) parks the thumb on "all"
    const active = Math.max(0, SOURCES.findIndex(s => s.tab === tab));

    const control = (
        <div className="pointer-events-auto relative drop-shadow-[0_6px_16px_rgba(10,27,51,0.14)]"
            style={{ width: W, height: H }}>

                {/* recessed well */}
                <span aria-hidden className="absolute inset-0"
                    style={squircleWellStyle(W, H, H / 2, 1, ROUND)} />

                {/* the one moving part */}
                <div className="absolute" aria-hidden
                    style={{
                        top: PAD,
                        left: PAD,
                        width: SEG,
                        height: THUMB,
                        transform: `translateX(${active * SEG}px)`,
                        transition: GLIDE,
                    }}>
                    <GlossySquircle w={SEG} h={THUMB} radius={THUMB / 2} smoothing={1} exponent={ROUND} interactive={false} />
                </div>

                {/* symbols sit above the thumb; the inactive ones dim back */}
                <div className="absolute inset-0 flex items-center" style={{ padding: PAD }}>
                    {SOURCES.map((s, i) => (
                        <button
                            key={s.tab}
                            onClick={() => onPick(s.tab)}
                            aria-pressed={i === active}
                            aria-label={s.label}
                            title={s.label}
                            style={{ width: SEG, transition: "opacity 220ms ease, transform 220ms ease" }}
                            className={`relative z-[2] grid h-full shrink-0 cursor-pointer place-items-center ${i === active
                                ? "opacity-100"
                                : "opacity-45 hover:scale-110 hover:opacity-90"}`}>
                            {s.icon}
                        </button>
                    ))}
            </div>
        </div>
    );

    // inline sits in the Episodes header row; floating is the original bottom dock
    return inline ? control : (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2">{control}</div>
    );
};

export default SourceBar;
