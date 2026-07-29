/** Video id out of any of the URL shapes YouTube hands out. */
export const youtubeId = (url: string): string | null => {
    const m = url.match(/(?:youtube\.com\/(?:.*[?&]v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
};

/** Poster frame. hqdefault exists for every video, unlike maxresdefault. */
export const youtubeThumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export const youtubeEmbed = (id: string, autoplay = false) =>
    `https://www.youtube-nocookie.com/embed/${id}${autoplay ? "?autoplay=1" : ""}`;
