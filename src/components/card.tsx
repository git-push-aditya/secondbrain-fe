import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { InstagramIcon, RedditIcon, TwitterIcon, WebIcon, WebPageDisplay, YoutubeIcon } from "../icons/particularIcons";
import { RedirectIcon } from "../icons/commonIcons";
import Tag from "./tags";
import ButtonEl from "./button";
import { AnimatePresence, motion } from "framer-motion";
import { usePopUpAtom, usePopUpMessage } from "../recoil/clientStates";
import React from "react";
import { useDeleteID } from "../recoil/deleteId";
import { redditScriptLoader } from "../scriptLoader";
import VideoLightbox from "./videoLightbox";
import WebGlance from "./webGlance";
import { LinkChip } from "./ui/linkChip";
import { Button01 } from "./ui/nextjsshop-button";
import { youtubeId, youtubeThumb } from "../utils/youtube";

export type cardType = "YOUTUBE" | "WEB" | "TWITTER" | "REDDIT" | "INSTAGRAM";

export interface cardProp {
    title: string;
    cardType: cardType;
    note?: string;
    tags?: { tag: { title: string, id: number } }[];
    createdAt: string;
    link: string;
    id: number;
    layout?: "grid" | "list";
    shared: boolean;
    collectionId: number;
    /** community cards: poster line and vote buttons, which replace the tag row */
    extra?: { byline: ReactNode; votes: ReactNode };
}


const typeIcon: { [key: string]: ReactElement } = {
    'TWITTER': <TwitterIcon dim="45" />,
    'YOUTUBE': <YoutubeIcon dim="60" />,
    'REDDIT': <RedditIcon dim="50" />,
    'INSTAGRAM': <InstagramIcon dim="50" />,
    'WEB': <WebIcon diml="60" dimb="50" />
}

// grid cards are ~272px wide now, the list-sized icons above swamp them
const typeIconSm: { [key: string]: ReactElement } = {
    'TWITTER': <TwitterIcon dim="15" />,
    'YOUTUBE': <YoutubeIcon dim="19" />,
    'REDDIT': <RedditIcon dim="18" />,
    'INSTAGRAM': <InstagramIcon dim="17" />,
    'WEB': <WebIcon diml="17" dimb="17" />
}


/* One overflow menu instead of two exposed icon buttons. Delete still routes
   through the inline confirm rather than firing straight from the menu — it's the
   destructive one, and a menu item is easier to hit by accident than a dedicated
   button was. Used by both the grid card and the list row so they stay in step. */
const CardMenu = ({ onShare, onDelete, showDelete }:
    { onShare: () => void; onDelete: () => void; showDelete: boolean }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
        const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("mousedown", away);
        document.addEventListener("keydown", esc);
        return () => {
            document.removeEventListener("mousedown", away);
            document.removeEventListener("keydown", esc);
        };
    }, [open]);

    const item = "flex w-full cursor-pointer items-center gap-2 px-2.5 py-1.5 text-left font-mono text-[0.58rem] uppercase tracking-[0.14em] transition-colors";

    return (
        <div ref={ref} className="relative shrink-0">
            <button type="button" onClick={() => setOpen(o => !o)}
                aria-haspopup="menu" aria-expanded={open} aria-label="More actions"
                className="grid size-6 cursor-pointer place-items-center rounded-full text-[#71717A] transition-colors hover:bg-[var(--wash)] hover:text-[#141418]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <circle cx="12" cy="5" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="12" cy="19" r="1.9" />
                </svg>
            </button>

            {open &&
                <div role="menu"
                    className="absolute right-0 top-full z-40 mt-1 w-[7.5rem] border border-[var(--rule)] bg-[#FBFBF9] py-1 shadow-[0_8px_20px_rgba(10,27,51,0.14)]">
                    <button role="menuitem" onClick={() => { setOpen(false); onShare(); }}
                        className={`${item} text-[#3F3F46] hover:bg-[var(--wash)]`}>
                        share
                    </button>
                    {showDelete &&
                        <button role="menuitem" onClick={() => { setOpen(false); onDelete(); }}
                            className={`${item} text-[#B91C1C] hover:bg-[#FEF2F2]`}>
                            delete
                        </button>
                    }
                </div>
            }
        </div>
    );
};

interface layoutCard extends cardProp {
    deleteCard: () => void;
    deletClicked: Boolean;
    setDeleteClicked: React.Dispatch<React.SetStateAction<Boolean>>;
    shareClicked: (link: string) => void;
}

export const CardElement = React.memo(({ title, collectionId, shared, cardType, layout, id, note, tags, createdAt, link, extra }: cardProp) => {

    const [deleteId, setDeleteId] = useDeleteID();
    const [popUpMessage, setPopUpMessage] = usePopUpMessage();


    const deleteCard = async () => {
        setDeleteId(id);
    }

    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const [popUpLive, setPopUpLive] = usePopUpAtom();
    const [deletClicked, setDeleteClicked] = useState<Boolean>(false);
    const shareClicked = (link: string) => {
        setPopUpMessage("Link copied to clipboard!!");
        navigator.clipboard.writeText(link);
        setPopUpLive?.((prev) => !prev);
    }

    return layout === "grid" ?
        <GridStyle shared={shared} collectionId={collectionId} title={title} deleteCard={deleteCard} cardType={cardType} note={note} tags={tags} createdAt={formattedDate} link={link} extra={extra} layout={"grid"} deletClicked={deletClicked} setDeleteClicked={setDeleteClicked} id={id} shareClicked={shareClicked} />
        :
        <ListStyle shared={shared} title={title} deleteCard={deleteCard} collectionId={collectionId} cardType={cardType} note={note} tags={tags} createdAt={formattedDate} id={id} link={link} extra={extra} layout={"list"} deletClicked={deletClicked} setDeleteClicked={setDeleteClicked} shareClicked={shareClicked} />

})



const GridStyle = ({ title, shared, deletClicked, deleteCard, setDeleteClicked, shareClicked, cardType, note, tags, createdAt, link, extra }: layoutCard) => {

    // The PaperCard frame outside owns the border and background, so nothing here
    // carries chrome of its own.
    const defaultStyle: string = " w-[15rem] h-[12rem] overflow-x-hidden font-source scrollbar-hidden ";

    /* ponytail: Reddit and Instagram embeds have a ~326px minimum width baked in
       by their own scripts, wider than the card — scale them to fit rather than
       clip them. Tweets go down to 220px on their own.
       0.72 * 326 = 235px, which is the widest that still clears a 240px card. */
    const squeeze = "origin-top-left scale-[0.72] w-[326px]";

    const videoId = cardType === "YOUTUBE" ? youtubeId(link) : null;
    const [playing, setPlaying] = useState(false);
    const [glancing, setGlancing] = useState(false);

    useEffect(() => {
        if (cardType === "TWITTER") {
            if (window.twttr?.widgets) {
                window.twttr.widgets.load();
            }
        } else if (cardType === "REDDIT") {
            redditScriptLoader();
        }
    }, []);

    return <motion.div
        key={"listCard"}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="scrollbar-hidden"
    ><div className={defaultStyle}>
            <div className="flex justify-between gap-1.5 px-3 pt-1.5 h-[17%] " >
                <div className="flex min-w-0 gap-1.5 items-center">
                    <span className="shrink-0">{typeIconSm[cardType]}</span>
                    <div
                        className="font-[600] line-clamp-2 cursor-default text-cardTitle text-[0.86rem] leading-[1.1rem] font-cardTitleHeading ">
                            {title}
                    </div>
                </div>
                <div className="flex shrink-0 items-start">
                    <CardMenu showDelete={!shared}
                        onShare={() => shareClicked(link)}
                        onDelete={() => setDeleteClicked((prev) => !prev)} />
                </div>
            </div>
            <div className=" flex flex-col justify-between h-[83%]">
                <div className="px-1.5 overflow-y-auto scrollbar-hidden scroll-smooth relative ">
                    <AnimatePresence mode="wait"> 
                        {deletClicked ?
                        <motion.div key="deletePopUp"
                            initial={{ y: -40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -40, opacity: 0 }}
                            transition={{ duration: 0.1, ease: "linear" }} className="mt-1">
                            {/* Mono/bracket chrome to match the rest of the app, and a
                                clear default: "keep" is the quiet one, "delete" the
                                only filled button. The old version paired a green
                                Cancel with a red Delete, which read as two equal
                                choices in traffic-light colours. */}
                            <div className="sticky left-0 top-0 z-10 mb-2 border border-[#FCA5A5] bg-[#FEF2F2] px-2.5 py-2 shadow-sm">
                                <p className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-[#B91C1C]">[ delete link ]</p>
                                <p className="mt-1 text-[0.68rem] leading-[0.9rem] text-[#7F1D1D]">This can't be undone.</p>
                                <div className="mt-2 flex gap-1.5">
                                    <button onClick={() => setDeleteClicked((prev) => !prev)}
                                        className="flex-1 cursor-pointer border border-[#E4E2DA] bg-white px-2 py-1 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#52525B] transition-colors hover:bg-[#FAFAFA]">
                                        keep
                                    </button>
                                    <button onClick={deleteCard}
                                        className="flex-1 cursor-pointer border border-[#B91C1C] bg-[#B91C1C] px-2 py-1 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#991B1B]">
                                        delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                        : null}</AnimatePresence>

                    {/* Poster, not a live player: at 112px tall the embed was too
                        small to watch, and every card on the page was mounting its
                        own YouTube iframe. Click opens the full-size lightbox. */}
                    {cardType === "YOUTUBE" && videoId &&
                        <button type="button" onClick={() => setPlaying(true)}
                            aria-label={`Play ${title}`}
                            className="group/play relative mx-auto mt-1.5 block w-[98%] cursor-pointer overflow-hidden rounded-md bg-black">
                            <img src={youtubeThumb(videoId)} alt=""
                                className="h-28 w-full object-cover transition-transform duration-300 group-hover/play:scale-[1.04]" />
                            <span className="absolute inset-0 grid place-items-center">
                                <span className="grid h-8 w-11 place-items-center rounded-md bg-[#E11D2E] shadow-md transition-transform duration-200 group-hover/play:scale-110">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                                </span>
                            </span>
                        </button>
                    }

                    {playing && videoId &&
                        <VideoLightbox id={videoId} title={title} onClose={() => setPlaying(false)} />
                    }

                    {cardType === 'TWITTER' && <div className="w-full mb-[-10px] mt-[-1px] mx-auto">
                        <blockquote className="twitter-tweet w-full max-w-full"  >
                            <a href={link.replace('x.com', 'twitter.com')} 
                                target="_blank" 
                                rel="noopener noreferrer" > 
                            </a>
                        </blockquote>
                    </div>}

                    {cardType === 'REDDIT' && <>
                        <div className={`mt-1.5 ${squeeze}`} >
                            <blockquote className="reddit-embed-bq">
                                <a href={link}></a>
                            </blockquote>
                        </div>
                    </>}

                    {cardType === 'INSTAGRAM' &&
                        <div className={`flex justify-center mt-1.5 overflow-hidden rounded-xl border-1 border-slate-200 ${squeeze}`}>
                            <blockquote className="instagram-media w-full max-w-full " data-instgrm-permalink={link} data-instgrm-version="14">
                                <a href={!link.includes('embed&amp;utm_campaign=loading') ? link.replace('web_copy_link', 'embed&amp;utm_campaign=loading') : link}></a>
                            </blockquote>
                        </div>
                    }

                    {
                        cardType === 'WEB' &&
                        <div className="flex justify-center">
                            {/* The preview iframe is a thumbnail, not a usable page:
                                pointer-events-none so clicks land on the button and
                                open the glance instead of being swallowed by the
                                embedded document. */}
                            <div className="mt-1.5 w-full">
                                <LinkChip link={link} />
                                <div className="mt-2 flex justify-center">
                                    <Button01 label="open" size="sm" onClick={() => setGlancing(true)} />
                                </div>
                            </div>
                        </div>
                    }

                    {glancing &&
                        <WebGlance link={link} title={title} onClose={() => setGlancing(false)} />
                    }

                    {note && <div
                        className="px-1.5 mt-2 cursor-default font-sans font-[440] text-slate-500 text-[0.76rem] leading-[1.05rem] text-justify ">
                        {note}
                    </div>}


                </div>

                {/* Fixed footer: date + tags always visible. Both used to live in
                    the scrolling area above, so on a card with an embed they were
                    pushed past the bottom edge. */}
                <div className="shrink-0 px-2 pb-2">
                    {(!shared || extra) &&
                        <div className="cursor-default pb-1 text-[0.6rem] font-[500] text-slate-400">
                            Added on {createdAt}
                        </div>
                    }
                    {extra ? <div className="flex items-center justify-between gap-2">{extra.byline}{extra.votes}</div> :
                    <div className="flex items-center gap-1.5 justify-start overflow-x-auto scrollbar-hidden">
                    {tags?.length != 0 ? tags?.map((tag, idx) => (
                        <Tag key={idx}
                            name={tag.tag.title}
                            id={tag.tag.id.toString()}
                            style="text-[0.66rem] px-2 py-[0.15rem]"
                        />
                        )) : <Tag
                            key={666}
                            name={cardType.toLowerCase()}
                            id={cardType.toLowerCase()}
                            style="text-[0.66rem] px-2 py-[0.15rem]"
                        />}
                    </div>}
                </div>
            </div>

        </div>
    </motion.div>
}











const ListStyle = ({ title, shared, deletClicked, setDeleteClicked, shareClicked, cardType, note, tags, createdAt, link, deleteCard, extra }: layoutCard) => {
    const [glancing, setGlancing] = useState(false);

    return <motion.div
        key={"listCard"}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`group/row mb-2 flex w-full items-center gap-3 border border-[var(--rule)] bg-white/70 px-3 py-2.5 transition-colors hover:border-[var(--accent)] hover:bg-[var(--wash)]`}
    >
        {/* Hairline row on paper instead of a shadowed rounded-3xl pill, small
            type icon instead of the 45-60px one, and a single flex line instead of
            5%/80%/10%/15% width buckets — those were what forced the date to wrap
            onto two lines. Row is ~52px now, was a fixed 80px. */}
        <span className="shrink-0">{typeIconSm[cardType]}</span>

        <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
                {extra?.byline}
                <span className="truncate font-cardTitleHeading text-[0.92rem] font-[600] text-[#141418]">{title}</span>
                <div className="hidden shrink-0 items-center gap-1.5 overflow-x-auto scrollbar-hidden sm:flex">
                    {tags?.map((tag, idx) => (
                        <Tag key={idx} style="text-[0.62rem] px-2 py-[0.1rem]" name={tag.tag.title} id={tag.tag.id.toString()} />
                    ))}
                </div>
            </div>
            {note && <p className="mt-0.5 truncate text-[0.74rem] leading-[1rem] text-[#71717A]">{note}</p>}
        </div>

        <span className="hidden shrink-0 font-mono text-[0.58rem] whitespace-nowrap uppercase tracking-[0.14em] text-[#A1A1AA] xl:block">
            {createdAt}
        </span>

        <AnimatePresence mode="wait">
            {deletClicked ? <motion.div key="deletePopUp"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }} className="shrink-0">
                <div className="flex items-center gap-2 border border-[#FCA5A5] bg-[#FEF2F2] px-2.5 py-1.5">
                    <span className="font-mono text-[0.56rem] uppercase tracking-[0.14em] whitespace-nowrap text-[#B91C1C]">delete link?</span>
                    <button onClick={() => setDeleteClicked((prev) => !prev)}
                        className="cursor-pointer border border-[#E4E2DA] bg-white px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[#52525B] transition-colors hover:bg-[#FAFAFA]">
                        keep
                    </button>
                    <button onClick={deleteCard}
                        className="cursor-pointer border border-[#B91C1C] bg-[#B91C1C] px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#991B1B]">
                        delete
                    </button>
                </div>
            </motion.div>
                :
                <motion.div
                    key="icons"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex shrink-0 items-center gap-2.5"
                >
                    {extra?.votes}
                    <CardMenu showDelete={!shared}
                        onShare={() => shareClicked(link)}
                        onDelete={() => setDeleteClicked((prev) => !prev)} />
                    {/* WEB rows glance in place; the other types have no embeddable
                        page worth framing, so they keep the redirect arrow. */}
                    {cardType === 'WEB'
                        ? <Button01 label="open" size="sm" className="hidden md:block" onClick={() => setGlancing(true)} />
                        : <RedirectIcon
                            layout={"list"} style="size-8 lg:scale-90 xl:scale-100 hover:-translate-y-0.5 hidden md:block transition-translate duration-300 ease-in-out" link={link} />
                    }
                </motion.div>
            }
        </AnimatePresence>

        {glancing && <WebGlance link={link} title={title} onClose={() => setGlancing(false)} />}
    </motion.div>
}


export default React.memo(CardElement);