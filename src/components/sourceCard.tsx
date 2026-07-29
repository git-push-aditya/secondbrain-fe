import type { CSSProperties } from "react";
import { WebIcon } from "../icons/particularIcons";
import type { cardType } from "./card";

/* The card an answer cites, as a narrow rail beside the prose.
   ponytail: not CardElement — that's a 17rem x 15rem card that mounts a live
   iframe or an embed script per instance. A citation only needs to say which
   saved thing this came from and link to it, so this is a thumbnail: dithered
   header, brand mark, title, host.

   Brand marks come from public/dp, same as sourceBar. There's no Instagram file
   there, so it falls back to the inline WebIcon. */
const LOGOS: Partial<Record<cardType, string>> = {
    YOUTUBE: "youtube-logo.svg",
    TWITTER: "x-logo.svg",
    REDDIT: "reddit-icon.svg",
};

const host = (link: string) => {
    try {
        return new URL(link).hostname.replace(/^www\./, "");
    } catch {
        return link;   // notes can carry a bare string rather than a URL
    }
};

const SourceCard = ({ id, title, link, type }: { id: number; title: string; link: string; type: cardType }) => {
    const logo = LOGOS[type];

    return (
        <a href={link} target="_blank" rel="noreferrer"
            className="group/src block border border-[var(--accent)] bg-[#FBFBF9] p-1 transition-transform duration-200 hover:-translate-y-0.5">

            {/* dither-fine, not the card-header grain: at 56px tall the coarse
                blobs land inside a single cell and read as noise */}
            <span aria-hidden className="dither-strip dither-fine relative block h-14"
                style={{ "--dx": `${-(id % 7) * 43}px`, "--dy": `${-(id % 5) * 37}px` } as CSSProperties}>
                <span className="absolute left-1/2 top-2 flex -translate-x-1/2 gap-1.5">
                    {[0, 1, 2].map(d => <span key={d} className="size-1.5 rounded-full bg-[#FBFBF9]" />)}
                </span>
            </span>

            <div className="mt-1 border border-dashed border-[var(--accent)] px-2 pt-1.5 pb-2">
                <div className="flex items-center gap-1.5">
                    {logo
                        ? <img src={`/dp/${logo}`} alt="" className="size-3 shrink-0" />
                        : <WebIcon diml="12" dimb="12" style="size-3 shrink-0 fill-current text-[var(--accent)]" />}
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[var(--accent)]">
                        {type.toLowerCase()}
                    </span>
                </div>

                <p className="mt-1.5 line-clamp-3 text-[0.72rem] leading-[1.05rem] font-[600] text-[#141418] group-hover/src:underline">
                    {title}
                </p>

                <p className="mt-1 truncate font-mono text-[0.58rem] text-[#A1A1AA]">{host(link)}</p>
            </div>
        </a>
    );
};

export default SourceCard;
