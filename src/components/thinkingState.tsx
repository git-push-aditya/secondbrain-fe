import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────
 * THINKING — expandable trace above an assistant answer.
 *
 * Shimmering "Thinking" while the request is in flight, then settles to
 * "Thought for Ns" and stays expandable. Steps tick over on a timer and
 * all check off once the answer lands.
 *
 * ponytail: only the Steps variant of the reference is here. Search, Coding
 * and Reasoning need a web-search trace, a tool log and streamed reasoning —
 * the /chat endpoint returns { message, content } and nothing else, so those
 * three would be pure theatre with no data to hang on. Add a variant when the
 * backend starts sending its trace.
 * ───────────────────────────────────────────────────────── */

// Fixed copy, not a real trace — the backend sends no step events, so these
// describe what the request is doing rather than reporting it.
const STEPS = [
    "Reading your question",
    "Searching your saved notes",
    "Ranking matched cards",
    "Writing the answer",
];

const STEP_MS = 900;

const INK = "#141418";
const INK_2 = "#52525B";
const INK_3 = "#A1A1AA";

const ThinkingState = ({ working }: { working: boolean }) => {
    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState<number | null>(null);
    const [visible, setVisible] = useState(1);
    const [manualExpanded, setManualExpanded] = useState<boolean | null>(null);

    const traceRef = useRef<HTMLDivElement>(null);
    const [lineHeight, setLineHeight] = useState(0);

    // Start the clock the first time we're told work is happening, and freeze it
    // when that stops. A message restored from localStorage never reports work,
    // so startedAt stays null and the trace renders nothing at all.
    useEffect(() => {
        if (working && startedAt === null) setStartedAt(Date.now());
        if (!working && startedAt !== null && elapsed === null) setElapsed(Date.now() - startedAt);
    }, [working, startedAt, elapsed]);

    // hold the last step back until the answer actually arrives
    useEffect(() => {
        if (!working || visible >= STEPS.length - 1) return;
        const t = setTimeout(() => setVisible(v => v + 1), STEP_MS);
        return () => clearTimeout(t);
    }, [working, visible]);

    const settled = !working && elapsed !== null;
    const shown = settled ? STEPS.length : visible;
    const expanded = manualExpanded ?? working;

    useLayoutEffect(() => {
        if (traceRef.current) setLineHeight(traceRef.current.offsetHeight);
    }, [shown, expanded]);

    if (startedAt === null) return null;

    return <div className="mb-2 flex w-full max-w-[24rem] flex-col">
        <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setManualExpanded(current => !(current ?? working))}
            className="-mx-1.5 flex w-fit cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 transition-colors duration-100 hover:bg-[var(--wash)]">

            <svg width="15" height="15" viewBox="0 0 24 24" fill={working ? INK_2 : INK_3}>
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
            </svg>

            {working
                ? <span
                    className="bg-clip-text text-[13px] font-[600] whitespace-nowrap text-transparent"
                    style={{
                        backgroundImage: `linear-gradient(90deg, ${INK_3} 35%, ${INK} 50%, ${INK_3} 65%)`,
                        backgroundSize: "200% 100%",
                        animation: "shimmer-text 1.4s linear infinite",
                    }}>
                    Thinking
                </span>
                : <span className="text-[13px] font-[600] whitespace-nowrap text-[#52525B]"
                    style={{ animation: "fade-in 350ms ease-out both" }}>
                    Thought for {Math.max(1, Math.round((elapsed ?? 0) / 1000))}s
                </span>}

            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={INK_3} strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform duration-300"
                style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)" }}>
                <path d="M6 9l6 6 6-6" />
            </svg>
        </button>

        {/* 0fr -> 1fr so the trace animates open without measuring its content */}
        <div className="grid transition-[grid-template-rows,opacity] duration-[400ms]"
            style={{
                gridTemplateRows: expanded ? "1fr" : "0fr",
                opacity: expanded ? 1 : 0,
                transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
            }}>
            <div className="overflow-hidden">
                <div className="relative mt-1 ml-[5px] pl-4">
                    <span aria-hidden className="absolute left-[3px] w-px bg-[var(--rule)]"
                        style={{
                            top: -8,
                            height: lineHeight ? lineHeight - 2 : 0,
                            transition: "height 500ms cubic-bezier(0.23,1,0.32,1)",
                        }} />

                    <div ref={traceRef} className="flex flex-col gap-1 py-1">
                        {STEPS.slice(0, shown).map((step, i) => (
                            <div key={step}
                                className="flex min-h-7 w-full items-center gap-2 rounded-[6px] px-1.5 py-0.5 text-left"
                                style={{ animation: `fade-up 320ms cubic-bezier(0.23,1,0.32,1) ${i * 120}ms both` }}>

                                {i < shown - 1 || settled
                                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={INK_3}
                                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                    : <span className="size-3 shrink-0 rounded-full border-[1.5px] border-[var(--rule)] border-t-[#52525B]"
                                        style={{ animation: "trace-spin 700ms linear infinite" }} />}

                                <span className="min-w-0 truncate text-[12.5px] font-[500] text-[#141418]">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default ThinkingState;
