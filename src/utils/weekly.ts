export type Weekly = { counts: number[]; labels: string[] };

/** Buckets ISO dates into the last `weeks` seven-day windows, oldest first.
 *  `now` is a parameter so the caller — and weekly.check.ts — fixes the window
 *  instead of the clock deciding. Dates outside the window (and future ones)
 *  are dropped. */
export const bucketByWeek = (dates: string[], now: number, weeks = 10): Weekly => {
    const WEEK = 7 * 864e5;

    const counts = Array<number>(weeks).fill(0);
    for (const d of dates) {
        const t = new Date(d).getTime();
        if (Number.isNaN(t)) continue;
        const i = weeks - 1 - Math.floor((now - t) / WEEK);
        if (i >= 0 && i < weeks) counts[i]++;
    }

    const labels = Array.from({ length: weeks }, (_, i) => {
        const d = new Date(now - (weeks - 1 - i) * WEEK);
        return `${d.getDate()}/${d.getMonth() + 1}`;
    });

    return { counts, labels };
};

/** percent change of the newest bucket against the one before it */
export const weekOnWeek = ({ counts }: Weekly): number | null => {
    const [prev, last] = counts.slice(-2);
    if (!prev) return null;                       // no baseline -> no percentage to show
    return Math.round(((last - prev) / prev) * 100);
};
