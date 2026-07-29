import React, { type CSSProperties } from "react";

/* Placeholder cards while a page loads. Matches the real card's geometry — 15rem
   wide, dithered header, dashed body — so the grid doesn't reflow when the data
   lands. The old version was a 330x440 SVG shimmer on its own breakpoint grid:
   more than twice the current card's size, in columns that no longer matched, at
   a 2s sweep that read as stalled.
   The dither is tinted grey rather than a source colour: a placeholder shouldn't
   claim to be a YouTube or Reddit card before the data says so. */
const Bar = ({ w, h = "h-2.5" }: { w: string; h?: string }) =>
    <div className={`skeleton-bar ${h} ${w} rounded-[2px]`} />;

const CardSkeleton = ({ i }: { i: number }) => (
    <div className="w-[15rem] border border-[var(--rule)] bg-[#FBFBF9] p-1.5">
        <div className="dither-strip dither-load h-12"
            style={{ "--accent": "#D6D6D2", "--dx": `${-(i % 7) * 43}px`, "--dy": `${-(i % 5) * 37}px` } as CSSProperties} />

        <div className="mt-1.5 h-[12rem] border border-dashed border-[var(--rule)] px-3 pt-3">
            <div className="flex items-center gap-2">
                <Bar w="w-4" h="h-4" />
                <Bar w="w-24" />
            </div>
            <div className="skeleton-bar mt-3 h-[6.5rem] w-full rounded-md" />
            <div className="mt-2.5 flex items-center gap-2">
                <Bar w="w-20" h="h-2" />
            </div>
        </div>
    </div>
);

const CardsLoaderSkeleton = () => (
    <div className="card-grid w-full" role="status" aria-label="Loading cards">
        {Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} i={i} />)}
    </div>
);

export default React.memo(CardsLoaderSkeleton);
