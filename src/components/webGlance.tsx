import { Lightbox } from "./ui/lightbox";

/* Zen-style glance: the saved page floats over the workspace in a blue-dithered
   frame instead of stealing a tab. Blue is the same #1D4ED8 the WEB card header
   is tinted with, so the overlay reads as that card grown large. */
const ACCENT = "#1D4ED8";

const hostOf = (link: string) => {
    try { return new URL(link).host.replace(/^www\./, ""); }
    catch { return link; }   // a malformed saved link still gets a label
};

const WebGlance = ({ link, title, onClose }: { link: string; title: string; onClose: () => void }) => (
    <Lightbox label={title} accent={ACCENT} dx={-67} dy={-51} width="max-w-[76rem]" onClose={onClose}>
        {/* Chrome bar. "open in new tab" is permanent, not a fallback shown on
            error: most sites send X-Frame-Options/frame-ancestors and refuse to
            embed, and a cross-origin frame gives us no reliable way to detect
            that — so the escape hatch is always there rather than guessed at. */}
        <div className="flex items-center gap-2 bg-[#FBFBF9] px-2.5 py-1.5">
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
            <span className="min-w-0 flex-1 truncate font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#52525B]">
                {hostOf(link)}
            </span>
            <a href={link} target="_blank" rel="noopener noreferrer"
                className="shrink-0 border border-[#E4E2DA] px-2 py-[0.15rem] font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#52525B] transition-colors hover:bg-[#F4F4F1]">
                open in new tab ↗
            </a>
            <button onClick={onClose} aria-label="Close"
                className="shrink-0 cursor-pointer border border-[#E4E2DA] px-2 py-[0.15rem] font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#52525B] transition-colors hover:bg-[#F4F4F1]">
                esc
            </button>
        </div>

        <div className="h-[min(78vh,44rem)] w-full overflow-hidden border-t-2 bg-white" style={{ borderColor: ACCENT }}>
            <iframe
                className="h-full w-full"
                src={link}
                title={title}
                referrerPolicy="strict-origin-when-cross-origin"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                allowFullScreen
            />
        </div>
    </Lightbox>
);

export default WebGlance;
