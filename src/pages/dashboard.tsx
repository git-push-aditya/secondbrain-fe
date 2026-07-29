import { useEffect, useState, type CSSProperties } from "react";
import MainBlock from "../components/mainBlock";
import SideBar from "../components/sideBar";
import Modal from "../components/modal";
import { AnimatePresence, motion } from "framer-motion";
import type { AuthUser } from "../App";
import { ChatBot } from "../components/Chatbot";
import { useSideBarAtom, useTabAtom } from "../recoil/clientStates";
import { CloseSideBar, OpenSideBar, ShareIcon } from "../icons/commonIcons";
import { LatticeMark } from "../components/sideBar";
import Dither from "../components/Dither";
import { THEMES, hexRgb, themeFor } from "../utils/theme";

export type ModalType = "addContent" | "shareBrain" | "addCollection" | "addCommunity" | "joinCommunity" | "close";


export interface ChildProps {
    setModalNeededBy: React.Dispatch<React.SetStateAction<ModalType>>;
    setPopUpLive?: React.Dispatch<React.SetStateAction<Boolean>>;
    popUpLive?: Boolean;
    layout?: "grid" | "list";
    setLayout?: React.Dispatch<React.SetStateAction<"grid" | "list">>;
    user: AuthUser | null;
    setUser?: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

/* Chrome runs the same shader as the auth and shared pages, on a navy base with
   the b1 blue as the crest — dark enough for white type to sit on it. */
const CHROME = { bg: "#0A1B33", wave: THEMES.b1.bg };

const vars = {
    "--accent": "#1D4ED8",       // blue that still reads on paper
    "--wash": "#1D4ED814",
    "--rule": "#E4E2DA",
} as CSSProperties;

/* Dithered chrome buttons. Black base — the header sits on a light-blue dither
   crest, and a tinted button on a tinted bar had no separation. The avatar theme
   survives as the rim colour (--rim), so it still follows the palette. */
const BTN_BLACK = "#0B0B0F";
const chromeBtn = "dither-btn flex h-9 cursor-pointer items-center gap-2 rounded-full px-3.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white transition-transform duration-200 hover:-translate-y-px";

const Dashboard = ({ user, setUser, layout, setLayout }: { user: AuthUser | null, layout: "grid" | "list", setLayout: React.Dispatch<React.SetStateAction<"grid" | "list">>, setUser: React.Dispatch<React.SetStateAction<AuthUser | null>> }) => {

    const [modalNeeded, setModalNeededBy] = useState<ModalType>("close");

    const [sidebar, setSideBar] = useSideBarAtom();
    const [tab] = useTabAtom();

    // reuses the auth page's per-avatar palette for the chrome buttons
    const btn = themeFor(user?.profilePic);

    useEffect(() => {
        const handleResize = () => {
            const isLarge = window.innerWidth >= 1024;

            setSideBar(prev => {
                if ((isLarge && prev) || (!isLarge && !prev)) {
                    return prev;
                }
                return isLarge;
            });
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setSideBar]);

    const toggleSideBar = () => setSideBar(prev => !prev)

    useEffect(() => { setLayout('grid') }, [])
    const closeModal = () => setModalNeededBy("close");

    // "dashboard-YOUTUBE" -> filter chip "youtube"
    const filter = tab.startsWith("dashboard") ? tab.split("-")[1] : undefined;

    return <div style={vars} className="relative flex h-screen w-screen flex-col overflow-hidden font-jakarta">

        {/* One dithered canvas behind everything; the paper panel masks all but
            the header and the rail. */}
        <div className="fixed inset-0 bg-[#0A1B33]">
            <Dither
                bgColor={hexRgb(CHROME.bg)}
                waveColor={hexRgb(CHROME.wave)}
                waveSpeed={0.025}
                waveFrequency={3}
                waveAmplitude={0.28}
                colorNum={4}
                pixelSize={2}
                enableMouseInteraction={false}
                mouseRadius={0.4}
            />
        </div>

        {/* Blur band over the dither at the top. z-30 puts it above the content
            panel (z-20) but under the chrome bar (z-40), so the bar itself stays
            untouched. The mask fades the blur out downward — a hard-edged blur
            strip would just read as a seam across the page. */}
        <div aria-hidden
            className="top-blur pointer-events-none fixed inset-x-0 top-0 z-30 h-24" />

        <AnimatePresence mode="wait">
            {modalNeeded !== "close" && <Modal cause={modalNeeded} closeModal={closeModal} />}
        </AnimatePresence>

        {/* ---- chrome bar ---- */}
        <header className="relative z-40 flex h-14 shrink-0 items-center gap-3 border-b border-white/10 px-3 sm:px-5">
            {sidebar
                ? <CloseSideBar dim="20" onClickHandler={toggleSideBar} style="shrink-0 cursor-pointer text-white/60 hover:text-white transition-colors" />
                : <OpenSideBar dim="20" onClickHandler={toggleSideBar} style="shrink-0 cursor-pointer text-white/60 hover:text-white transition-colors" />
            }

            {/* Brand, not the page title — the page already names itself in the
                sticky heading below. font-welcome is Bricolage Grotesque Bold,
                already shipped in public/fonts; its @font-face carries no
                font-weight descriptor, so it registers as `normal` and asking for
                font-bold would make the browser synthesise fake bold on top of an
                already-bold face and smear the strokes. */}
            <h1 className="flex min-w-0 items-center gap-2.5">
                <LatticeMark size={26} light />
                <span className="chrome-title truncate font-welcome text-[1.3rem] leading-none tracking-[-0.015em] text-white">Lattice</span>
                {filter && <span className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/50">/ {filter.toLowerCase()}</span>}
            </h1>

            <div className="ml-auto flex shrink-0 items-center gap-2">
                {!tab.startsWith("community") && tab !== "chatbot" &&
                    <button onClick={() => setModalNeededBy("shareBrain")}
                        style={{ "--btn": BTN_BLACK, "--rim": btn.bg + "6E", "--grain": 0.5 } as CSSProperties}
                        className={chromeBtn}>
                        <ShareIcon style="size-3.5" />
                        <span className="hidden sm:inline">share brain</span>
                    </button>
                }
            </div>
        </header>

        <div className="relative z-20 flex min-h-0 flex-1">
            {/* closed on a wide screen leaves the icon rail; on mobile it leaves nothing */}
            {!sidebar &&
                <div className="hidden shrink-0 lg:block">
                    <SideBar collapsed onToggle={toggleSideBar} setModalNeededBy={setModalNeededBy} setUser={setUser} />
                </div>
            }

            <AnimatePresence>
                {sidebar && <motion.aside
                    key="SideBar"
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -40, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 900, damping: 30 }}
                    className="absolute inset-y-0 left-0 z-30 shrink-0 lg:static">
                    <SideBar onToggle={toggleSideBar} setModalNeededBy={setModalNeededBy} setUser={setUser} />
                </motion.aside>}
            </AnimatePresence>

            {/* tapping the paper closes the overlay rail on small screens */}
            {sidebar && <div onClick={toggleSideBar} className="absolute inset-0 z-20 bg-black/20 lg:hidden" />}

            <main className="relative min-w-0 flex-1 overflow-y-auto bg-[#FBFBF9] scrollbarMC">
                {tab === 'chatbot' ? <ChatBot /> : <MainBlock setModalNeededBy={setModalNeededBy} user={user} layout={layout} setLayout={setLayout} />}
            </main>
        </div>
    </div>
}

export default Dashboard;
