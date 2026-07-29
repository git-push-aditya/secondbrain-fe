import { useEffect } from "react";
import { createPortal } from "react-dom";
import { youtubeEmbed } from "../utils/youtube";

/* Full-size player, opened from a card's poster frame.
   Portalled to document.body on purpose: PaperCard has a hover translate, and a
   transform makes the element a containing block for `fixed` descendants — an
   overlay rendered inside the card would jump to the card's box the moment you
   hovered it, which is exactly when you click. */
const VideoLightbox = ({ id, title, onClose }: { id: string; title: string; onClose: () => void }) => {
    useEffect(() => {
        const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", esc);
        // the page behind must not scroll while the player is up
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", esc);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    return createPortal(
        <div role="dialog" aria-modal="true" aria-label={title}
            onClick={onClose}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">

            {/* The red dither is the frame: .dither-strip fills its own box, so the
                padding around the player is what you see of it. Content needs its
                own stacking level — the strip's grain pseudos are absolute inset-0
                and would otherwise paint straight over the iframe. */}
            <div onClick={e => e.stopPropagation()}
                className="dither-strip w-full max-w-[64rem] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.5)] sm:p-4"
                style={{ "--accent": "#E11D2E", "--dx": "-43px", "--dy": "-37px" } as React.CSSProperties}>

                {/* No title bar, no close button — Escape closes it (clicking the
                    backdrop does too). `title` still feeds the dialog's aria-label
                    and the iframe's, so it's announced without being drawn. */}
                <div className="relative z-10">
                    <div className="aspect-video w-full overflow-hidden bg-black">
                        <iframe
                            className="h-full w-full"
                            src={youtubeEmbed(id, true)}
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default VideoLightbox;
