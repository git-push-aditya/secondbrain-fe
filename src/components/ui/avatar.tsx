import { themeFor } from "../../utils/theme";

/* The avatar PNGs are tall transparent busts (aspect 0.56–0.75), so a bare
   <img> in a square box squashes the face and leaves nothing behind the
   cut-out. Every avatar goes through here: cover-crop from the top so the
   head fills the tile, on a wash of that avatar's own dither theme. */
export const Avatar = ({ src, alt = "", className = "" }: { src?: string | null; alt?: string; className?: string }) => (
    <span
        style={{ backgroundColor: `${themeFor(src).bg}1f` }}
        className={`grid shrink-0 place-items-center overflow-hidden ${className}`}
    >
        <img src={src ?? undefined} alt={alt} draggable={false}
            className="h-full w-full object-cover object-top" />
    </span>
);
