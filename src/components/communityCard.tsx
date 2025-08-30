import { motion } from "framer-motion";
import { usePopUpAtom, usePopUpMessage } from "../recoil/clientStates";
import type { cardType } from "./card";
import { DownArrow, ShareIcon, UpArrow } from "../icons/commonIcons";
import { minEndingIndex } from "../utils/minEndingIndex";
import { useEffect, useState } from "react";
import { redditScriptLoader } from "../scriptLoader";
import { useUserProfile } from "../recoil/user";
import { useVoteContent } from "../api/user/mutate";
import { getProfilePicPath } from "../utils/profilePhoto";
import React from "react";

interface communityCard {
    createdAt: string;
    title: string;
    link: string;
    layout: 'grid' | 'list';
    communityId: number;
    id: number;
    note: string;
    cardType: cardType; 
    posterName: string;
    isOwner: boolean;
    upVoteCount: number;
    downVoteCount: number;
    usersVote ?: vote; 
    profilePic : 'b1' | 'b2' | 'b3' | 'g1' | 'g2' | 'g3';
}

export type vote = 'upVote' | 'downVote' | 'NONE';

interface layoutType extends communityCard {
    shareClicked: (link: string) => void;
    profilePhoto: string;
    voteCount: { upVotes: number, downVotes: number };
    upVoteDownVote: (vote: vote) => void;
    usersPrevVote : vote;
}

const CommunityCard = ({ createdAt, title, link, layout, communityId, id, note, cardType, posterName, isOwner, upVoteCount, downVoteCount, usersVote,profilePic }: communityCard) => {

    const [popUpMessage, setPopUpMessage] = usePopUpMessage();
    const [profilePhoto, setProfilePhoto] = useState<string>("");
    const [user, setUser] = useUserProfile();
    useEffect(() => {
        if (isOwner) {
            setProfilePhoto(user?.profilePic!);
        } else {
            setProfilePhoto(getProfilePicPath(profilePic ?? "b1"));
        }
    }, []);

    

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

    const [voteCount, setVoteCount] = useState<{ upVotes: number, downVotes: number }>({ upVotes: upVoteCount, downVotes: downVoteCount });
    const { mutate: voteContent } = useVoteContent();
    const [usersPrevVote, setUsersVote] = useState<vote>(usersVote ?? 'NONE');
    const upVoteDownVote = (vote: vote) => {
        try {
            voteContent({ vote, contentId: id, communityId });
            if (usersPrevVote === 'NONE') {
                if (vote === 'upVote') {
                    setVoteCount((prev) => ({ upVotes: prev.upVotes + 1, downVotes: prev.downVotes }));
                    setUsersVote('upVote');
                } else {
                    setVoteCount((prev) => ({ upVotes: prev.upVotes, downVotes: prev.downVotes + 1 }));
                    setUsersVote('downVote');
                }
            } else if (usersPrevVote === 'upVote') {
                if (vote === 'upVote') {
                    setVoteCount((prev) => ({ upVotes: prev.upVotes - 1, downVotes: prev.downVotes }));
                    setUsersVote('NONE');
                } else {
                    setVoteCount((prev) => ({ upVotes: prev.upVotes - 1, downVotes: prev.downVotes += 1 }));
                    setUsersVote('downVote');
                }
            } else {
                if (vote === 'upVote') {
                    setVoteCount((prev) => ({ upVotes: prev.upVotes + 1, downVotes: prev.downVotes - 1 }));
                    setUsersVote('upVote');
                } else {
                    setVoteCount((prev) => ({ upVotes: prev.upVotes , downVotes: prev.downVotes - 1 }));
                    setUsersVote('NONE');
                }
            } 

        } catch (e) {
            console.error(e)
        }
    }

    return layout === "grid" ?
        <GridStyle profilePhoto={profilePhoto} upVoteCount={upVoteCount} communityId={communityId} title={title} cardType={cardType} note={note} createdAt={formattedDate} link={link} layout={"grid"} id={id} shareClicked={shareClicked} posterName={posterName} isOwner={isOwner} downVoteCount={downVoteCount} voteCount={voteCount} usersPrevVote={usersPrevVote} upVoteDownVote={upVoteDownVote} profilePic={profilePic} />
        :
        <ListStyle profilePhoto={profilePhoto} upVoteCount={upVoteCount} title={title} posterName={posterName} isOwner={isOwner} communityId={communityId} cardType={cardType} note={note} createdAt={formattedDate} id={id} link={link} layout={"list"} shareClicked={shareClicked} downVoteCount={downVoteCount} voteCount={voteCount} usersPrevVote={usersPrevVote} upVoteDownVote={upVoteDownVote} profilePic={profilePic}  />

}


const GridStyle = ({ createdAt, title, link, communityId, id, note, cardType, shareClicked, posterName, isOwner, profilePhoto, voteCount, upVoteDownVote, usersPrevVote }: layoutType) => {

    const defaultStyle: string = `  w-85 overflow-x-hidden  ${cardType == 'REDDIT' ? " hover:border-orange-600 " : cardType == "TWITTER" ? " hover:border-blue-800" : cardType == "YOUTUBE" ? " hover:border-red-700 " : cardType == "INSTAGRAM" ? " hover:border-[#bc1888] " : " hover:border-slate-500"} font-source  transition-hover duration-300 h-115  bg-cardBackground border-2  rounded-3xl shadow-md scrollbar-hidden ${isOwner ? " border-slate-400" : " border-slate-300 "} group/card overflow-y-auto`;

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
        console.log(profilePhoto)
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
        animate={{ y: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="scrollbar-hidden relative flex flex-col "
    > <div className={defaultStyle} >
            <div className="h-[15%] mt-2 flex justify-between py-2 mx-4 items-center relative z-1 ">
                <div className="flex items-center gap-2 text-cardTitleHeading text-xl font-[500]">
                    <img src={profilePhoto} className={"rounded-3xl h-12 w-12 cursor-pointer"} />
                    <div>by {isOwner ? "you" : posterName}</div>
                </div>

                <div className="mr-3 scale-95 opacity-0 group-hover/card:opacity-100 group-hover/card:scale-100 transition-all duration-300">
                    <div className="flex justify-between ">
                        <div className="relative group/upVote" onClick={() => upVoteDownVote('upVote')}>
                            <UpArrow
                                dim="10"
                                style={` hover:bg-green-100 transition duration-200 hover:text-green-500 cursor-pointer h-11 rounded-l-xl w-10 p-1 border-2 hover:border-green-400 ${usersPrevVote === 'upVote' ? " text-green-500 border-green-400 bg-green-100" : " border-slate-200 text-slate-900 bg-slate-200"}`}
                            />
                            <div className="absolute whitespace-nowrap px-3 -translate-x-2 mx-auto translate-y-2 py-1 bg-green-600/80 text-white text-sm hover:opacity-0 rounded-lg opacity-0 group-hover/upVote:opacity-100 transition-opacity duration-300 z-30">
                                {voteCount.upVotes} upvotes
                            </div>
                        </div>
                        <div className="relative group/downVote" onClick={() => upVoteDownVote('downVote')}>
                            <DownArrow
                                dim="10"
                                style={`hover:bg-red-100 transition duration-200 hover:text-red-500 cursor-pointer h-11 rounded-r-xl w-10 p-1 border-2 hover:border-red-400 ${usersPrevVote === 'downVote' ? " bg-red-100 text-red-500 border-red-400" : " bg-slate-200 text-slate-900 border-slate-200 "}`}
                            />
                            <div className="absolute whitespace-nowrap px-3 py-1 mx-auto translate-y-2  bg-red-600/80 text-white text-sm hover:opacity-0 rounded-lg opacity-0 group-hover/downVote:opacity-100 transition-opacity duration-300 z-30 -translate-x-14">
                                {voteCount.downVotes} downvotes
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="font-[550] line-clamp-2 cursor-default text-cardTitle text-2xl font-cardTitleHeading mx-4 mb-4 ">{title}</div>
            <div className="mx-4">
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
                            {<iframe className="w-[99%] mx-auto h-50 mt-2 rounded-lg  " src={link} referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>}
                            <div className="text-center text-mon0 text-xl text-primaryButtonBlue mt-[-30px]">
                                {link.substring(link.indexOf('www'), minEndingIndex(link)).split('https://')[1]}
                            </div>
                        </a>
                    </div>
                }

                {note && <div className="px-2 mt-4 cursor-default font-sans font-[440] text-slate-500 text-xl text-justify ">
                    {note}
                </div>}



            </div>
            
        </div>
        <div 
            className="absolute mx-auto bg-cardBackground h-10 px-2 py-2 mb-2 ml-6  bottom-0  cursor-default text-[1.24rem] font-[500] text-slate-500">
                Added on {createdAt}
        </div>         
    </motion.div>
}




const ListStyle = ({ createdAt, title, link, note, cardType, shareClicked, posterName, isOwner, profilePhoto, upVoteDownVote, usersPrevVote }: layoutType) => {
    console.log(usersPrevVote);
    return <motion.div
        key={"listCard"}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`w-[90%] h-[80px] flex items-center mb-4 mx-auto transition-hover cursor-default duration-300  bg-cardBackground border-2 border-slate-300 rounded-3xl shadow-md pl-3  ${cardType == 'REDDIT' ? " hover:border-orange-600 " : cardType == "TWITTER" ? " hover:border-blue-800" : cardType == "YOUTUBE" ? " hover:border-red-700 " : cardType == "INSTAGRAM" ? " hover:border-[#bc1888] " : " hover:border-slate-500"} ${isOwner ? " border-slate-400" : " border-slate-300 "} `}
    >
        <div className="flex  h-full items-center w-[16%] md:w-[7%] justify-center">
            <img src={profilePhoto} className={"rounded-3xl size-13  cursor-pointer"} />
        </div>
        <div className=" md:w-[70%] w-[80%] h-full pl-1 py-2 ">
            <div className={`w-[100%] flex gap-10 items-center ${note !== "" ? "h-[60%] " : "h-full"}`}>
                <div 
                    className="truncate text-2xl font-[500]" 
                    title={`by ${isOwner ? "you" : posterName.trim()} — ${title}`}
                >
                    {`by ${isOwner ? "you" : posterName.trim()} — ${title}`}
                </div>
            </div>

            <div className={`w-[100%] h-[40%] truncate font-sans font-[440]  text-slate-600  text-md  ${note !== "" ? "block" : "hidden"}`}>
                {note}
            </div>
        </div>
        <div 
            className=" cursor-default w-[10%] xl:text-md text-[0.8rem] hidden lg:block text-center text-clamp-2 font-[500] text-slate-500">
            Added on {createdAt}
        </div>
        <div className="flex justify-between items-center gap-4 mx-3">
            <ShareIcon layout={"list"} style="size-7 hover:-translate-y-0.5 transition-translate duration-300 ease-in-out" onClickHandler={() => shareClicked(link)} />
            <div className="md:flex md:justify-between mr-3 hidden ">
                <div onClick={() => upVoteDownVote('upVote')}>
                   <UpArrow
                        dim="10"
                        style={`transition-hover duration-200 hover:text-green-500 hover:cursor-pointer h-11 rounded-l-xl w-10 p-1 border-2 hover:bg-green-100 hover:border-green-400 ${usersPrevVote === 'upVote' ? 'text-green-500 border-green-400 bg-green-100' : ' bg-slate-200 text-slate-900 border-slate-200 '}`}
                    />
                </div>
                <div onClick={() => upVoteDownVote('downVote')}>
                    <DownArrow 
                        dim="10" 
                        style={`hover:bg-red-100 transition-hover duration-200  hover:text-red-500 hover:cursor-pointer h-11 rounded-r-xl w-10 p-1 hover:border-2 hover:border-red-400 border-2 ${usersPrevVote === 'downVote' ? " bg-red-100 text-red-500 border-red-400" : " bg-slate-200 text-slate-900 border-slate-200 "}`} />
                </div>
            </div>
        </div>
    </motion.div>
}


export default React.memo(CommunityCard);