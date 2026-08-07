import { useState } from "react";
import { useAddContentQuery } from "../api/user/mutate";
import { usePopUpAtom, usePopUpMessage } from "../recoil/clientStates";
import { linkMeta } from "../utils/linkMeta";

/** Inline link field. Same silver rim as the DeepDive composer. */
const QuickAdd = ({ collectionId, communityId }: { collectionId: number; communityId: number }) => {
    const [value, setValue] = useState("");
    const [bad, setBad] = useState(false);
    const { mutateAsync, isPending } = useAddContentQuery();
    const [, setPopUp] = usePopUpAtom();
    const [, setMessage] = usePopUpMessage();

    const submit = async () => {
        if (isPending) return;

        const meta = linkMeta(value);
        if (!meta) {
            setBad(true);
            return;
        }
        setBad(false);

        const hyperlink = value.trim();
        setValue("");

        try {
            await mutateAsync({
                title: meta.title,
                hyperlink,
                note: "",
                type: meta.type,
                collectionId,
                communityId,
                existingTags: [],
                newTags: [],
            });
            setMessage("Link saved to your brain!!");
            setPopUp(p => !p);
        } catch (err) {
            console.error(err);
            setValue(hyperlink);
            setMessage("Couldn't save that link — try again.");
            setPopUp(p => !p);
        }
    };

    return (
        <div className="min-w-0 flex-1">
            <div className={`silver-rim rounded-[2rem] shadow-sm transition-shadow focus-within:shadow-md ${bad ? "ring-2 ring-red-400/60" : ""}`}>
                <div className="flex items-center gap-2 p-1.5 pl-5">
                    <input
                        value={value}
                        onChange={e => { setValue(e.target.value); if (bad) setBad(false); }}
                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); submit(); } }}
                        placeholder="Paste a link to save it…"
                        aria-label="Paste a link to save it"
                        className="min-w-0 flex-1 bg-transparent py-2 text-[0.9rem] text-[#141418] outline-none placeholder:text-[#9A9A9A]"
                    />

                    <button
                        onClick={submit}
                        disabled={isPending}
                        aria-label="Save link"
                        style={{ "--btn": "#0B0B0F", "--grain": 0.9 } as React.CSSProperties}
                        className="dither-btn grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-white transition-transform duration-200 hover:-translate-y-px disabled:opacity-60">
                        {isPending
                            ? <span className="size-3.5 rounded-full border-[1.5px] border-white/40 border-t-white"
                                style={{ animation: "trace-spin 700ms linear infinite" }} />
                            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>}
                    </button>
                </div>
            </div>

            {bad && <p className="mt-1.5 pl-5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-red-500">
                that isn't a valid http link
            </p>}
        </div>
    );
};

export default QuickAdd;
