import { useEffect, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

/* Shared overlay shell for the video player and the web glance.
   Portalled to document.body on purpose: PaperCard has a hover translate, and a
   transform makes the element a containing block for `fixed` descendants — an
   overlay rendered inside the card would jump to the card's box the moment you
   hovered it, which is exactly when you click. */
export const Lightbox = ({ label, accent, dx, dy, width = "max-w-[64rem]", onClose, children }: {
    label: string;
    accent: string;
    dx: number;
    dy: number;
    width?: string;
    onClose: () => void;
    children: ReactNode;
}) => {
    useEffect(() => {
        const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", esc);
        // the page behind must not scroll while the overlay is up
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", esc);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    return createPortal(
        <div role="dialog" aria-modal="true" aria-label={label}
            onClick={onClose}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">

            {/* The dither is the frame: .dither-strip fills its own box, so the
                padding around the content is what you see of it. Content needs its
                own stacking level — the strip's grain pseudos are absolute inset-0
                and would otherwise paint straight over the iframe. */}
            <div onClick={e => e.stopPropagation()}
                className={`dither-strip w-full ${width} p-3 shadow-[0_24px_60px_rgba(0,0,0,0.5)] sm:p-4`}
                style={{ "--accent": accent, "--dx": `${dx}px`, "--dy": `${dy}px` } as CSSProperties}>
                <div className="relative z-10">{children}</div>
            </div>
        </div>,
        document.body
    );
};
