import { useEffect, useState, type ReactElement } from "react";
import { InstagramIcon, RedditIcon, TwitterIcon, WebIcon, WebPageDisplay, YoutubeIcon } from "../icons/particularIcons";
import { DeleteIcon, RedirectIcon, ShareIcon } from "../icons/commonIcons";
import Tag from "./tags";
import { ButtonEl } from "./button";
import { AnimatePresence, motion } from "framer-motion";
import { minEndingIndex } from "../utils/minEndingIndex"
import { usePopUpAtom, usePopUpMessage } from "../recoil/clientStates"; 
import React from "react";
import { useDeleteID } from "../recoil/deleteId";
import { redditScriptLoader } from "../scriptLoader";

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
}


const typeIcon: { [key: string]: ReactElement } = {
    'TWITTER': <TwitterIcon dim="45" />,
    'YOUTUBE': <YoutubeIcon dim="60" />,
    'REDDIT': <RedditIcon dim="50" />,
    'INSTAGRAM': <InstagramIcon dim="50" />,
    'WEB': <WebIcon diml="60" dimb="50" />
}


interface layoutCard extends cardProp {
    deleteCard: () => void;
    deletClicked: Boolean;
    setDeleteClicked: React.Dispatch<React.SetStateAction<Boolean>>;
    shareClicked: (link: string) => void;
}

export const CardElement = React.memo(({ title, collectionId, shared, cardType, layout, id, note, tags, createdAt, link }: cardProp) => {

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
        setPopUpMessage("Link coppied to clipboard!!");
        navigator.clipboard.writeText(link);
        setPopUpLive?.((prev) => !prev);
    }

    return layout === "grid" ?
        <GridStyle shared={shared} collectionId={collectionId} title={title} deleteCard={deleteCard} cardType={cardType} note={note} tags={tags} createdAt={formattedDate} link={link} layout={"grid"} deletClicked={deletClicked} setDeleteClicked={setDeleteClicked} id={id} shareClicked={shareClicked} />
        :
        <ListStyle shared={shared} title={title} deleteCard={deleteCard} collectionId={collectionId} cardType={cardType} note={note} tags={tags} createdAt={formattedDate} id={id} link={link} layout={"list"} deletClicked={deletClicked} setDeleteClicked={setDeleteClicked} shareClicked={shareClicked} />

})



const GridStyle = ({ title, shared, deletClicked, deleteCard, setDeleteClicked, shareClicked, cardType, note, tags, createdAt, link }: layoutCard) => { 

    const defaultStyle: string = `${!shared ? " w-85 " : " w-85 overflow-x-hidden "}   ${cardType == 'REDDIT' ? " hover:border-orange-600 " : cardType == "TWITTER" ? " hover:border-blue-800" : cardType == "YOUTUBE" ? " hover:border-red-700 " : cardType == "INSTAGRAM" ? " hover:border-[#bc1888] " : " hover:border-slate-500"} font-source  transition-hover duration-300 h-115  bg-cardBackground border-2 border-slate-300 rounded-3xl shadow-md scrollbar-hidden`;

    const [newLink, setNewLink] = useState<string>(link);
    const extractVideoId = (videoUrl : string) => {
        const regex = /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
        const match = videoUrl.match(regex);
        return match ? match[1] : null;
    };
    
    useEffect(()=>{
        if(cardType === "YOUTUBE"){
            const id = extractVideoId(link);
            setNewLink(`https://www.youtube.com/embed/${id}`);
        }
    },[setNewLink])

    useEffect(() => {
        if(cardType === "TWITTER" ){
            if ( window.twttr?.widgets) {
            window.twttr.widgets.load();
            }
        }else if(cardType === "REDDIT"){
            redditScriptLoader();
        }
    }, []);

    return <motion.div
        key={"listCard"}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`${shared ? " hover:scale-101 transition-hover duration-150 ease-in-out hover:sahdow-lg" : " "} scrollbar-hidden`}
    ><div className={defaultStyle}>
            <div className="flex justify-between gap-2 px-6 mt-1 pt-1 h-[15%] " >
                <div className="flex justify-around gap-2 items-center">
                    {typeIcon[cardType]}
                    <div className="font-[550] line-clamp-2 cursor-default text-cardTitle text-xl font-cardTitleHeading ">{title}</div>
                </div>
                <div className="flex justify-around gap-4 items-center">
                    <ShareIcon style="size-7 hover:-translate-y-0.5 transition-translate duration-300 ease-in-out" onClickHandler={() => shareClicked(link)} />
                    {!shared && <DeleteIcon onClickHandler={() => setDeleteClicked((prev) => !prev)} style={`size-7.5 transition-translate duration-300 ease-in-out hover:-translate-y-0.5 ${deletClicked ? " text-red-600 " : " "}`} />}
                </div>
            </div>
            <div className=" flex flex-col justify-between h-[85%]">
                <div className="px-2 max-h-[321px] overflow-y-auto scrollbar-hidden scroll-smooth overscroll-auto relative ">
                    <AnimatePresence mode="wait"> {deletClicked ?
                        <motion.div key="deletePopUp"
                            initial={{ y: -40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -40, opacity: 0 }}
                            transition={{ duration: 0.1, ease: "linear" }} className="mt-1">
                            <div className="px-5 cursor-pointer bg-red-100 rounded-2xl border-1 border-red-100 h-[62px] text-red-700 px-3 pb-1 pt-1 text-center text-sm font-medium hover:border-red-300 hover:border-1 mb-3 transition-hover duration-200 ease-in-out sticky left-0 top-0 shadow-md ">
                                <b >Are you sure</b> you want to delete this link?
                                <div className=" flex items-center justify-center gap-4 ">
                                    <ButtonEl onClickHandler={() => setDeleteClicked((prev) => !prev)} placeholder="Cancel" buttonType={"cardButton"} particularStyle=" bg-green-400 text-white w-23 h-7 " />
                                    <ButtonEl onClickHandler={deleteCard} placeholder="Delete" buttonType={"cardButton"} particularStyle=" text-white bg-red-400  w-23 h-7 " />
                                </div>
                            </div>
                        </motion.div>
                        : null}</AnimatePresence>

                    {cardType === "YOUTUBE" && <iframe className="w-[99%] mx-auto h-50 mt-2 rounded-lg  " title="YouTube video player" src={newLink} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>}

                    {cardType === 'TWITTER' && <div className="w-full mb-[-10px] mt-[-1px] mx-auto">
                        <blockquote className="twitter-tweet w-full max-w-full"  >
                            <a href={link.replace('x.com', 'twitter.com')} target="_blank" rel="noopener noreferrer" > </a>
                        </blockquote>
                    </div>}

                    {cardType === 'REDDIT' && <>
                        <div className=" mt-2 " >
                            <blockquote className="reddit-embed-bq">
                                <a href={link}></a>
                            </blockquote>
                        </div>
                    </>}

                    {cardType === 'INSTAGRAM' &&
                        <div className="flex justify-center mt-2 overflow-hidden rounded-2xl  border-1 border-slate-200 mb-[-8px]">
                            <blockquote className="instagram-media w-full max-w-full " data-instgrm-permalink={link} data-instgrm-version="14">
                                <a href={!link.includes('embed&amp;utm_campaign=loading') ? link.replace('web_copy_link', 'embed&amp;utm_campaign=loading') : link}></a>
                            </blockquote>
                        </div>
                    }

                    {
                        cardType === 'WEB' &&
                        <div className="flex justify-center">
                            <a href={link} target="_blank">
                                {<iframe className="w-[99%] mx-auto h-50 mt-2 rounded-lg  " src={link}   referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>}
                                <div className="text-center text-mon0 text-xl text-primaryButtonBlue mt-[-30px]">
                                    {link.substring(link.indexOf('www'), minEndingIndex(link)).split('https://')[1]}
                                </div>
                            </a>
                        </div>
                    }

                    {note && <div className="px-2 mt-4 cursor-default font-sans font-[440] text-slate-500 text-xl text-justify ">
                        {note}
                    </div>}


                    {!shared && <div className="px-3 my-2 cursor-default text-lg font-[500] text-slate-500">Added on {createdAt}</div>}
                </div>

                <div className="flex items-center gap-2 justify-start mt-0 mb-4 mx-3 overflow-x-auto scrollbar-hidden">
                    {tags?.length != 0 ? tags?.map((tag, idx) => (
                        <Tag key={idx} name={tag.tag.title} id={tag.tag.id.toString()} />
                    )) : <Tag key={666} name={cardType.toLowerCase()} id={cardType.toLowerCase()} />}
                </div>
            </div>

        </div>
    </motion.div>
}

 









const ListStyle = ({ title, shared, deletClicked, setDeleteClicked, shareClicked, cardType, note, tags, createdAt, link, deleteCard }: layoutCard) => {
    return <motion.div
        key={"listCard"}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`${shared ? " w-[100%] " : " w-[96%] "} h-[80px] flex items-center mb-4 mx-auto transition-hover cursor-default duration-300  bg-cardBackground border-2 border-slate-300 rounded-3xl shadow-md pl-3 ${shared ? " hover:scale-101 transition-hover duration-150 ease-in-out hover:sahdow-lg" : " "}  ${cardType == 'REDDIT' ? " hover:border-orange-600 " : cardType == "TWITTER" ? " hover:border-blue-800" : cardType == "YOUTUBE" ? " hover:border-red-700 " : cardType == "INSTAGRAM" ? " hover:border-[#bc1888] " : " hover:border-slate-500"}`}

    >
        <div className="flex  items-center w-[5%] justify-center">
            {typeIcon[cardType]}
        </div>
        <div className=" w-[70%] h-full pl-1 py-2">
            <div className={`w-[100%] flex gap-10 items-center ${note !== "" ? "h-[60%] " : "h-full"}`}>
                <div className="max-w-[50%] font-cardTitleHeading h-[100%] flex items-center text-2xl text-cardTitle font-[500] ">
                    <span className="truncate w-full">{title}</span>
                </div>
                <div className="max-w-[50%] overflow-x-auto scrollbar-hidden flex gap-2 items-center">
                    {tags?.map((tag, idx) => (
                        <Tag key={idx} style=" h-7 " name={tag.tag.title} id={tag.tag.id.toString()} />
                    ))}
                </div>
            </div>

            <div className={`w-[100%] h-[40%] truncate font-sans font-[440]  text-slate-600  text-md  ${note !== "" ? "block" : "hidden"}`}>
                {note}
            </div>
        </div>
        <div className=" cursor-default w-[10%] text-md text-center text-clamp-2 font-[500] text-slate-500">
            Added on {createdAt}
        </div>
        <AnimatePresence mode="wait">
            {deletClicked ? <motion.div key="deletePopUp"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }} className=" w-[15%] h-full"><div className=" cursor-pointer bg-red-100 rounded-2xl w-full border-1 border-red-100 h-full text-red-700 text-center text-sm hover:border-red-300 hover:border-1  transition-hover duration-200 ease-in-out  shadow-md font[300]">
                    <b >Are you sure</b> you want to delete this link?
                    <div className=" flex items-center justify-center gap-4 ">
                        <ButtonEl onClickHandler={() => setDeleteClicked((prev) => !prev)} placeholder="Cancel" buttonType={"cardButton"} particularStyle=" bg-green-400 text-white w-20 h-6 text-sm " />
                        <ButtonEl onClickHandler={deleteCard} placeholder="Delete" buttonType={"cardButton"} particularStyle=" text-white bg-red-400 text-sm w-20 h-6 " />
                    </div>
                </div>  </motion.div>
                :
                <motion.div
                    key="icons"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex w-[15%] ${!shared ? " justify-around" : " justify-center gap-12"} items-center h-full`}
                >
                    <ShareIcon
                        layout={"list"} style="size-8 hover:-translate-y-0.5 transition-translate duration-300 ease-in-out" onClickHandler={() => shareClicked(link)} />
                    {!shared && <DeleteIcon
                        layout={"list"} onClickHandler={() => setDeleteClicked((prev) => !prev)} style={`size-8.5 transition-translate duration-300 ease-in-out hover:-translate-y-0.5 ${deletClicked ? " text-red-600 " : " "}`} />}
                    <RedirectIcon
                        layout={"list"} style="size-8 hover:-translate-y-0.5 transition-translate duration-300 ease-in-out" link={link} />
                </motion.div>
            }
        </AnimatePresence>
    </motion.div>
}