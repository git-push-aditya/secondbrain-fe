import { AnimatePresence, motion } from "framer-motion"
import { usePopUpMessage, useTabAtom } from "../recoil/clientStates"

/* Toast for "link copied", "link saved", and friends.
   Paper card + hairline + mono label, matching the chrome elsewhere. The accent
   is hardcoded rather than var(--accent): this renders in App, outside the
   dashboard subtree that defines the theme vars, so the var wouldn't resolve. */
const ACCENT = "#1D4ED8";

export const PopUp = ({ particularStyle }: { particularStyle?: string }) => {
    const [tab] = useTabAtom();
    const [popUpMessage] = usePopUpMessage();

    return <AnimatePresence>
        <motion.div key="popup"
            initial={{ y: 16, opacity: 0, scale: 0.96 }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            className={`pointer-events-none fixed right-0 left-0 z-400 cursor-default ${tab !== "chatbot" ? "bottom-18" : "top-25"}`}
            transition={{ duration: 0.2, ease: "easeInOut" }}>

            {/* w-fit, not a fixed w-92: the old box was 23rem wide whatever the
                message said, so short ones sat in a half-empty slab. */}
            <div className={`mx-auto flex w-fit max-w-[92vw] items-center gap-2.5 border border-[#E4E2DA] bg-[#FBFBF9] px-4 py-2.5 shadow-[0_10px_28px_rgba(10,27,51,0.14)] ${particularStyle ?? ""}`}>
                <span className="grid size-[15px] shrink-0 place-items-center rounded-full" style={{ backgroundColor: ACCENT }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </span>
                <span className="font-mono text-[0.62rem] whitespace-nowrap uppercase tracking-[0.14em] text-[#141418]">
                    {popUpMessage}
                </span>
            </div>
        </motion.div>
    </AnimatePresence>
}
