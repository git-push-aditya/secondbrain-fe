import { useState } from "react";
import { WebIcon } from "../../icons/particularIcons";

/* ponytail: favicon + host instead of a live iframe. A 112px-tall frame of a
   real page is a random crop of its mobile layout, it mounts one iframe per
   card, and it comes up blank for every site that sends X-Frame-Options. The
   page itself is one click away in the glance.

   Icons come from DuckDuckGo's endpoint — one third-party request per card, and
   the only part of this that touches the network. Swap the template for a
   self-hosted favicon cache if that request ever matters. */
const iconUrl = (host: string) => `https://icons.duckduckgo.com/ip3/${host}.ico`;

const parts = (link: string) => {
    try {
        const u = new URL(link);
        const path = (u.pathname + u.search).replace(/\/$/, "");
        return { host: u.hostname.replace(/^www\./, ""), path };
    } catch {
        return { host: link, path: "" };   // a malformed saved link still gets a label
    }
};

export const LinkChip = ({ link }: { link: string }) => {
    // sites with no favicon serve a 404, so fall back to the inline WEB glyph
    const [noIcon, setNoIcon] = useState(false);
    const { host, path } = parts(link);

    return (
        <div className="mx-auto flex w-[98%] items-center gap-2.5 border border-dashed border-[#E4E2DA] bg-white/60 px-2.5 py-2">
            <span className="grid size-7 shrink-0 place-items-center border border-[#EDEBE4] bg-white">
                {noIcon
                    ? <WebIcon diml="14" dimb="14" style="size-3.5 fill-current text-[#1D4ED8]" />
                    : <img src={iconUrl(host)} alt="" onError={() => setNoIcon(true)}
                        className="size-4 object-contain" />}
            </span>

            <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[#3F3F46]">{host}</p>
                {path && <p className="truncate font-mono text-[0.58rem] text-[#A1A1AA]">{path}</p>}
            </div>
        </div>
    );
};
