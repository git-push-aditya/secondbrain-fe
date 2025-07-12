import { motion } from "framer-motion";
import { usePopUpAtom, usePopUpMessage } from "../recoil/clientStates";
import type { cardType } from "./card"; 
import { DownArrow, ShareIcon, UpArrow } from "../icons/commonIcons";
import { minEndingIndex } from "../utils";
import Tag from "./tags";

interface communityCard {
    createdAt : string;
    title : string;
    link : string;
    layout : 'grid' | 'list';
    communityId : number;
    id : number;
    note : string;
    cardType : cardType;
    tags?: { tag: { title: string, id: number } }[];
    posterId : number;
    isOwner : boolean;
    upVoteCount : number;
    
}

interface layoutType extends communityCard {
    shareClicked : (link : string) => void;
}

export const CommunityCard = ({createdAt,title,link,layout,communityId,id,note,cardType,tags,posterId,isOwner,upVoteCount} : communityCard) => {
    
    const [popUpMessage, setPopUpMessage] = usePopUpMessage();
    

    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const [popUpLive, setPopUpLive] = usePopUpAtom(); 
    const shareClicked = (link: string) => {
        setPopUpMessage("Link coppied to clipboard!!");
        navigator.clipboard.writeText(link);
        setPopUpLive?.((prev) => !prev);
    }

    return layout === "grid" ?
        <GridStyle upVoteCount={upVoteCount} communityId={communityId} title={title} cardType={cardType} note={note} tags={tags} createdAt={formattedDate} link={link} layout={"grid"} id={id} shareClicked={shareClicked}  posterId={posterId} isOwner={isOwner}/>
        :
        <ListStyle upVoteCount={upVoteCount} title={title} posterId={posterId} isOwner={isOwner} communityId={communityId} cardType={cardType} note={note} tags={tags} createdAt={formattedDate} id={id} link={link} layout={"list"} shareClicked={shareClicked} />

} 


const GridStyle = ({createdAt,title,link,layout,communityId,id,note, upVoteCount,cardType,tags,shareClicked,posterId ,isOwner} : layoutType) => {
    const defaultStyle: string = `  w-85 overflow-x-hidden  ${cardType == 'REDDIT' ? " hover:border-orange-600 " : cardType == "TWITTER" ? " hover:border-blue-800" : cardType == "YOUTUBE" ? " hover:border-red-700 " : cardType == "INSTAGRAM" ? " hover:border-[#bc1888] " : " hover:border-slate-500"} font-source  transition-hover duration-300 h-115  bg-cardBackground border-2  rounded-3xl shadow-md scrollbar-hidden ${isOwner ? " border-slate-400" : " border-slate-300 "}`;


    return <motion.div
        key={"listCard"}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="scrollbar-hidden"
    ><div className={defaultStyle}>
        <div className="h-[17%] flex justify-between py-2 mx-4 items-center sticky z-20 top-0 bg-cardBackground"> 
            <div className="flex justify-between mr-3">
                <UpArrow dim="10" style="bg-slate-200 hover:bg-green-100 transition-hover duration-200 text-slate-900 hover:text-green-500 hover:cursor-pointer h-11 rounded-l-xl w-10 p-1 hover:border-2 hover:border-green-400 border-2 border-slate-200" />
               <DownArrow dim="10" style="bg-slate-200 hover:bg-red-100 transition-hover duration-200 text-slate-900 hover:text-red-500 hover:cursor-pointer h-11 rounded-r-xl w-10 p-1 hover:border-2 hover:border-red-400 border-2 border-slate-200" />
            </div>
        </div>
        <div className="font-[550] line-clamp-2 cursor-default text-cardTitle text-2xl font-cardTitleHeading mx-4 mb-4 ">{title}</div>
        <div className="mx-4">
            {cardType === "YOUTUBE" && <iframe className="w-[99%] mx-auto h-50 mt-2 rounded-lg  " title="YouTube video player" src={link.includes('youtu.be') ? link.replace('youtu.be', 'youtube.com/embed') : link} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>}
        
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


            <div className="px-3 my-2 cursor-default text-lg font-[500] text-slate-500">Added on {createdAt}</div>
        </div>
        <div className="flex items-center gap-2 justify-start mt-0 mb-4 mx-3 overflow-x-auto scrollbar-hidden">
                    {tags?.length != 0 ? tags?.map((tag, idx) => (
                        <Tag key={idx} name={tag.tag.title} id={tag.tag.id.toString()} />
                    )) : <Tag key={666} name={cardType.toLowerCase()} id={cardType.toLowerCase()} />}
                </div>
    </div>
    </motion.div>
}


const ListStyle = ({createdAt,title,link,layout,communityId,id,note,cardType,tags,shareClicked,posterId ,isOwner} : layoutType) => {
    return <motion.div
        key={"listCard"}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`w-[90%] h-[80px] flex items-center mb-4 mx-auto transition-hover cursor-default duration-300  bg-cardBackground border-2 border-slate-300 rounded-3xl shadow-md pl-3  ${cardType == 'REDDIT' ? " hover:border-orange-600 " : cardType == "TWITTER" ? " hover:border-blue-800" : cardType == "YOUTUBE" ? " hover:border-red-700 " : cardType == "INSTAGRAM" ? " hover:border-[#bc1888] " : " hover:border-slate-500"} ${isOwner ? " border-slate-400" : " border-slate-300 "} `}

    >
        <div className="flex  items-center w-[7%] justify-center">
            display picture
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
        <div className="flex justify-between items-center gap-4 mx-3">
            <ShareIcon layout={"list"} style="size-8 hover:-translate-y-0.5 transition-translate duration-300 ease-in-out" onClickHandler={() => shareClicked(link)} />
            <div className="flex justify-between mr-3">
                <UpArrow dim="10" style="bg-slate-200 hover:bg-green-100 transition-hover duration-200 text-slate-900 hover:text-green-500 hover:cursor-pointer h-11 rounded-l-xl w-10 p-1 hover:border-2 hover:border-green-400 border-2 border-slate-200" />
               <DownArrow dim="10" style="bg-slate-200 hover:bg-red-100 transition-hover duration-200 text-slate-900 hover:text-red-500 hover:cursor-pointer h-11 rounded-r-xl w-10 p-1 hover:border-2 hover:border-red-400 border-2 border-slate-200" />
            </div>
        </div>
    </motion.div>
}