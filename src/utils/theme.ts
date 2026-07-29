export type profilePicId = 'b1' | 'b2' | 'b3' | 'g1' | 'g2' | 'g3';

export const hexRgb = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];

// One dither theme per avatar: `bg` is the base the waves sit on, `wave` the
// highlight they crest into. The shader mixes bg -> wave, so `bg` is the
// darkest pixel you'll see — light themes keep it mid-tone, the two black ones
// (b3, g3) sit on true black with neutral grey crests, no hue at all.
export const THEMES: Record<profilePicId, { bg: string; wave: string }> = {
    b1: { bg: "#3B82F6", wave: "#BFDBFE" }, // sky
    b2: { bg: "#0EA5E9", wave: "#BAE6FD" }, // azure
    b3: { bg: "#000000", wave: "#52525B" }, // black — smoke
    g1: { bg: "#06B6D4", wave: "#A5F3FC" }, // teal-blue
    g2: { bg: "#2563EB", wave: "#C7DDFF" }, // cobalt
    g3: { bg: "#000000", wave: "#A1A1AA" }  // black — silver
};

// the light blue everything falls back to when no avatar is known
export const DEFAULT_THEME_ID: profilePicId = "b1";

// Accepts either a bare id ("g2") or the stored path ("/dp/g2.png"), so it works
// straight off AuthUser.profilePic. Anything unrecognised -> the default blue.
export const themeFor = (profilePic?: string | null) => {
    const id = profilePic?.match(/\b(b[123]|g[123])\b/)?.[1] as profilePicId | undefined;
    return THEMES[id ?? DEFAULT_THEME_ID];
};
