import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatBot } from "./Chatbot";
import ChatHistoryPanel from "./chatHistoryPanel";
import { OpenSideBar, CloseSideBar } from "../icons/commonIcons";

/* DeepDive gets its own history rail + toggle, independent of the app's main
   nav sidebar — same overlay pattern as dashboard.tsx's SideBar, just scoped
   to this pane so it only ever affects the chatbot tab. */
export const DeepDivePane = () => {
    const [historyOpen, setHistoryOpen] = useState(false);

    return (
        <div className="relative flex h-full min-h-0">
            <div className="hidden w-[220px] shrink-0 border-r border-[#EAEAEA] bg-white lg:block">
                <ChatHistoryPanel />
            </div>

            <button
                onClick={() => setHistoryOpen(true)}
                aria-label="Chat history"
                className="absolute top-3 left-3 z-10 grid size-8 cursor-pointer place-items-center rounded-md border border-[#E7E7E9] bg-white text-[#52525B] shadow-sm transition-colors hover:bg-[#FAFAFA] lg:hidden">
                <OpenSideBar dim="16" style="" />
            </button>

            <AnimatePresence>
                {historyOpen && <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setHistoryOpen(false)}
                        className="absolute inset-0 z-20 bg-black/20 lg:hidden" />
                    <motion.div
                        initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 900, damping: 30 }}
                        className="absolute inset-y-0 left-0 z-30 w-[240px] border-r border-[#EAEAEA] bg-white lg:hidden">
                        <div className="flex items-center justify-between border-b border-[#F0F0F0] p-2.5">
                            <span className="px-1 text-[0.62rem] font-[500] uppercase tracking-[0.09em] text-[#A1A1AA]">DeepDive history</span>
                            <button onClick={() => setHistoryOpen(false)} aria-label="Close history"
                                className="grid size-7 cursor-pointer place-items-center rounded-md text-[#71717A] hover:bg-[#FAFAFA]">
                                <CloseSideBar dim="16" style="" />
                            </button>
                        </div>
                        <div className="h-[calc(100%-49px)]">
                            <ChatHistoryPanel onNavigate={() => setHistoryOpen(false)} />
                        </div>
                    </motion.div>
                </>}
            </AnimatePresence>

            <div className="min-w-0 flex-1">
                <ChatBot />
            </div>
        </div>
    );
};
