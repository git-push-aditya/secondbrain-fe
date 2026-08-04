import { youtubeEmbed } from "../utils/youtube";
import { Lightbox } from "./ui/lightbox";

/* Full-size player, opened from a card's poster frame. */
const VideoLightbox = ({ id, title, onClose }: { id: string; title: string; onClose: () => void }) => (
    /* No title bar, no close button — Escape closes it (clicking the backdrop
       does too). `title` still feeds the dialog's aria-label and the iframe's,
       so it's announced without being drawn. */
    <Lightbox label={title} accent="#E11D2E" dx={-43} dy={-37} onClose={onClose}>
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
    </Lightbox>
);

export default VideoLightbox;
