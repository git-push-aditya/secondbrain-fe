import { useState, type ReactElement } from "react";
import { InstagramIcon, RedditIcon, TwitterIcon, WebIcon, WebPageDisplay, YoutubeIcon } from "../icons/particularIcons";
import { DeleteIcon, RedirectIcon, ShareIcon } from "../icons/commonIcons";
import Tag from "./tags";
import { ButtonEl } from "./button";
import { AnimatePresence, motion } from "framer-motion";
import { minEndingIndex } from "../utils"


export interface cardProp {
    title: string;
    cardType: "youtube" | "web" | "twitter" | "reddit" | "instagram";
    note?: string;
    tags?: { title: string, id: number }[];
    createdAt?: string;
    link: string;
    setPopUpLive?: React.Dispatch<React.SetStateAction<Boolean>>;
    layout : "grid" | "list";
}


const clicked = () => {
    alert("clikced");
}

const typeIcon: { [key: string]: ReactElement } = {
    'twitter': <TwitterIcon dim="45" />,
    'youtube': <YoutubeIcon dim="60" />,
    'web': <WebIcon diml="60" dimb="50" />,
    'reddit': <RedditIcon dim="50" />,
    'instagram': <InstagramIcon dim="50" />
}

interface layoutCard extends cardProp{
    deletClicked : Boolean;
    setDeleteClicked : React.Dispatch<React.SetStateAction<Boolean>>;
    shareClicked : (link:string) => void;
}


const defaultStyle: string = "w-88 font-source hover:border-slate-500  transition-hover duration-300 max-h-145  bg-cardBackground border-2 border-slate-300 rounded-3xl shadow-md ";

export const CardElement = ({ title, cardType, layout,note, setPopUpLive, tags, createdAt, link }: cardProp) => {

    const [deletClicked, setDeleteClicked] = useState<Boolean>(false);
    const shareClicked = (link: string) => {
        navigator.clipboard.writeText(link);
        setPopUpLive?.((prev) => !prev);
    }

    return layout === "grid" ? 
        <GridStyle title={title} cardType={cardType} note={note} setPopUpLive={setPopUpLive} tags={tags} createdAt={createdAt} link={link} layout={"grid"} deletClicked={deletClicked} setDeleteClicked={setDeleteClicked} shareClicked={shareClicked} /> 
            : 
        <AnimatePresence> <ListStyle title={title} cardType={cardType} note={note} setPopUpLive={setPopUpLive} tags={tags} createdAt={createdAt} link={link} layout={"list"} deletClicked={deletClicked} setDeleteClicked={setDeleteClicked} shareClicked={shareClicked} /></AnimatePresence> 

}



const GridStyle =({ title,deletClicked,setDeleteClicked,shareClicked ,cardType, note, setPopUpLive, tags, createdAt, link }: layoutCard) => { 

    return <div className={defaultStyle}>
        <div className="flex justify-between gap-2 px-6 pt-1" >
            <div className="flex justify-around gap-2 items-center">
                {typeIcon[cardType]}
                <div className="font-[650] cursor-default text-cardTitle text-xl font-cardTitleHeading ">{title}</div>
            </div>
            <div className="flex justify-around gap-4 items-center">
                <ShareIcon style="size-7 hover:-translate-y-0.5 transition-translate duration-300 ease-in-out" onClickHandler={() => shareClicked(link)} />
                <DeleteIcon onClickHandler={() => setDeleteClicked((prev) => !prev)} style={`size-7.5 transition-translate duration-300 ease-in-out hover:-translate-y-0.5 ${deletClicked ? " text-red-600 " : " "}`} />
            </div>
        </div>
        <div >
            <div className="px-2 max-h-[321px] overflow-y-auto scrollbar-hidden scroll-smooth overscroll-auto relative">
                {deletClicked ? <AnimatePresence>
                    <motion.div key="deletePopUp"
                        initial={{ y: -40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        transition={{ duration: 0.1, ease: "linear" }} className="mt-1">
                        <div className="px-5 cursor-pointer bg-red-100 rounded-2xl border-1 border-red-100 h-[62px] text-red-700 px-3 pb-1 pt-1 text-center text-sm font-medium hover:border-red-300 hover:border-1 mb-3 transition-hover duration-200 ease-in-out sticky left-0 top-0 shadow-md ">
                            <b >Are you sure</b> you want to delete this link?
                            <div className=" flex items-center justify-center gap-4 ">
                                <ButtonEl onClickHandler={() => setDeleteClicked((prev) => !prev)} placeholder="Cancel" buttonType={"cardButton"} particularStyle=" bg-green-400 text-white w-23 h-7 " />
                                <ButtonEl onClickHandler={clicked} placeholder="Delete" buttonType={"cardButton"} particularStyle=" text-white bg-red-400  w-23 h-7 " />
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence> : null}

                {cardType === "youtube" && <iframe className="w-[99%] mx-auto h-50  rounded-lg  " title="YouTube video player" src={link.includes('youtu.be') ? link.replace('youtu.be', 'youtube.com/embed') : link} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>}

                {cardType === 'twitter' && <div className="w-full mb-[-10px] mt-[-1px] mx-auto">
                    <blockquote className="twitter-tweet w-full max-w-full"  >
                        <a href={link.replace('x.com', 'twitter.com')} target="_blank" rel="noopener noreferrer" > </a>
                    </blockquote>
                </div>}

                {cardType === 'reddit' && <>
                    <div className="" >
                        <blockquote className="reddit-embed-bq">
                            <a href={link}></a>
                        </blockquote>
                    </div>
                </>}

                {cardType === 'instagram' &&
                    <div className="flex justify-center mb-[-8px]">
                        <blockquote className="instagram-media w-full max-w-full " data-instgrm-permalink={link} data-instgrm-version="14">
                            <a href={!link.includes('embed&amp;utm_campaign=loading') ? link.replace('web_copy_link', 'embed&amp;utm_campaign=loading') : link}></a>
                        </blockquote>
                    </div>
                }

                {
                    cardType === 'web' &&
                    <div className="flex justify-center">
                        <a href={link} target="_blank">
                            {<WebPageDisplay />}
                            <div className="text-center text-mon0 text-xl text-primaryButtonBlue mt-[-30px]">
                                {link.substring(link.indexOf('www'), minEndingIndex(link)).split('https://')[1]}
                            </div>
                        </a>
                    </div>
                }

                {note && <div className="px-2 cursor-default font-sans font-[440] text-slate-700 text-xl pt-4 px-3 text-justify">
                    {note}
                </div>}

            </div>
            <div className="flex items-center gap-2 justify-center my-3">
                <Tag name="science" id="hehe" />
                <Tag name="science and technology" id="hehe" />
                <Tag name="..." id="hehe" />
            </div>
            <div className="px-6 mb-4 cursor-default text-lg font-[400] text-slate-500">Added on {createdAt}</div>
        </div>
    </div>
}





const ListStyle =({ title,deletClicked,setDeleteClicked,shareClicked ,cardType, note, setPopUpLive, tags, createdAt, link }:layoutCard ) => {
    return <motion.div 
            key={"listCard"}    
            initial={{y:8, opacity:0}}
            animate={{y:0,x:0,opacity: 1}}
            exit={{x:-10, opacity:0}}
            transition={{duration:0.4, ease:"easeInOut"}}
            className="w-[94%] h-[80px] flex gap-3 items-center mt-4 mx-auto hover:border-slate-500 transition-hover cursor-default duration-300 bg-cardBackground border-2 border-slate-300 rounded-3xl shadow-md pl-3"

        >
            <div className="flex items-center w-[6%] justify-center">
                {typeIcon[cardType]}
            </div>
            <div className=" w-[70%] h-full ">
                <div className="w-[50%]  pt-2 font-cardTitleHeading truncate h-[60%] flex items-center text-2xl text-cardTitle font-[500] ">
                    {title}
                </div>
                <div className="w-[90%]  truncate">
                    {note}
                </div>
            </div>
            <div className=" flex w-[20%] justify-around items-center h-full gap-2">
                {<ShareIcon style="size-8 hover:-translate-y-0.5 transition-translate duration-300 ease-in-out" onClickHandler={() => shareClicked(link)} />}
                {<DeleteIcon onClickHandler={() => setDeleteClicked((prev) => !prev)} style={`size-8.5 transition-translate duration-300 ease-in-out hover:-translate-y-0.5 ${deletClicked ? " text-red-600 " : " "}`} />}
                {<RedirectIcon style="size-8 hover:-translate-y-0.5 transition-translate duration-300 ease-in-out" link={link} />}
            </div>
        </motion.div> 
}