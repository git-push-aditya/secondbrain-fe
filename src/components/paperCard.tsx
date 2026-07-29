import type { CSSProperties, ReactNode } from "react";

/* Dither tint per source, so the header says what kind of thing the card is
   before you read a word of it. Overriding --accent on the strip alone is enough:
   .dither-strip takes its fill from that var, while the frame's borders keep
   reading the theme's --accent from the ancestor. */
const TINTS: Record<string, string> = {
    TWITTER: "#0B0B0F",     // X — black
    YOUTUBE: "#E11D2E",     // red
    REDDIT: "#FF4500",      // orange (Reddit's own)
    INSTAGRAM: "#BC1888",   // magenta, the colour card.tsx already used for it
    WEB: "#1D4ED8",         // blue
};

/** Ticket-stub frame: hairline outer border, dithered header with three punched
 *  holes, dashed rule around the body. `i` shifts the dither blob so neighbouring
 *  cards don't repeat the same pattern; `type` tints the header. */
const PaperCard = ({ i, type, children }: { i: number; type?: string; children: ReactNode }) => {
    const tint = type ? TINTS[type] : undefined;

    return (
        <div className="border border-[var(--accent)] bg-[#FBFBF9] p-1.5 transition-transform duration-200 hover:-translate-y-1">
            <div className="dither-strip h-12"
                style={{
                    "--dx": `${-(i % 7) * 43}px`,
                    "--dy": `${-(i % 5) * 37}px`,
                    ...(tint ? { "--accent": tint } : {}),
                } as CSSProperties}>
                <div className="absolute left-1/2 top-2.5 flex -translate-x-1/2 gap-2">
                    {[0, 1, 2].map(d => <span key={d} className="size-2 rounded-full bg-[#FBFBF9]" />)}
                </div>
            </div>
            <div className="mt-1.5 border border-dashed border-[var(--accent)] pt-2">
                {children}
            </div>
        </div>
    );
};

export default PaperCard;
