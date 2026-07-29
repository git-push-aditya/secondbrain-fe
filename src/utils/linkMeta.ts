export type LinkType = 'WEB' | 'YOUTUBE' | 'REDDIT' | 'TWITTER' | 'INSTAGRAM';

/* Paste-and-go: the modal asks for a title, type and tags, but a URL already
   implies the first two, so quick-add derives them and leaves the rest empty.
   Exported so the derivation can be checked without mounting React. */
export const linkMeta = (raw: string): { type: LinkType; title: string } | null => {
    let u: URL;
    try {
        u = new URL(raw.trim());
    } catch {
        return null;                       // not a URL at all
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;

    const host = u.hostname.replace(/^www\./, "");
    const type: LinkType =
        /(^|\.)(youtube\.com|youtu\.be)$/.test(host) ? "YOUTUBE"
            : /(^|\.)(x\.com|twitter\.com)$/.test(host) ? "TWITTER"
                : /(^|\.)reddit\.com$/.test(host) ? "REDDIT"
                    : /(^|\.)instagram\.com$/.test(host) ? "INSTAGRAM"
                        : "WEB";

    // the last meaningful path segment reads better than a bare hostname
    const seg = u.pathname.split("/").filter(Boolean).pop() ?? "";
    const words = decodeURIComponent(seg)
        .replace(/\.[a-z0-9]{1,5}$/i, "")   // drop a file extension
        .replace(/[-_+]+/g, " ")
        .trim();

    return { type, title: (words.length > 2 ? words : host).slice(0, 120) };
};
