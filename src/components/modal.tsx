import { CopyIcon, CrossIcon, LeftIcon, Loader } from "../icons/commonIcons";
import { ButtonEl } from "./button";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import Tag from "./tags";
import { useAddContentQuery, useCreateCollection, useCreateCommunity, useJoinCommunity, useShareBrain } from "../api/user/mutate";
import { useQueryClient } from "@tanstack/react-query";
import { type AxiosResponse } from 'axios';
import { usePopUpAtom, useTabAtom } from "../recoil/clientStates";
import { useGetListQuery } from "../api/user/query";
import type { SetterOrUpdater } from "recoil";

export type type = 'WEB' | 'YOUTUBE' | 'REDDIT' | 'TWITTER' | 'INSTAGRAM';

type CollectionType = { id: number; name: string };
type CommunityType = { id: number; name: string; isFounder: boolean }

export type GetListResponse = {
    status: string;
    payload: {
        collectionList: CollectionType[];
        allCommunities: CommunityType[];
        tagsList: { title: string }[];
        message: string;
    };
};

interface props {
    cause: "addContent" | "shareBrain" | "logout" | "addCollection" | "addCommunity" | "joinCommunity" | "close";
    closeModal: () => void;
    collectionName?: string;
}

interface cardComponent {
    setPopUpLive?: SetterOrUpdater<boolean>;
    closeCard: () => void;
    cause?: "addContent" | "shareBrain" | "logout" | "addCollection" | "addCommunity" | "joinCommunity" | "close";
}

const clicked = () => {
    alert("clicked");
}


const Modal = ({ cause, closeModal }: props) => {

    const [popUpLive, setPopUpLive] = usePopUpAtom();

    return <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'circIn' }}
        className="h-screen w-screen  backdrop-blur-xs bg-[rgba(0,0,0,0.5)] fixed z-300 top-0 left-0 flex justify-center items-center" >
        {cause == "addContent" && <AddContent closeCard={closeModal} />}
        {cause == "shareBrain" && <ShareBrain setPopUpLive={setPopUpLive} cause={cause} closeCard={closeModal} />}
        {cause == "logout" && <Logout closeCard={closeModal} />}
        {cause == "addCommunity" && <StartCommunity closeCard={closeModal} />}
        {cause == "addCollection" && <AddCollection closeCard={closeModal} />}
        {cause == "joinCommunity" && <JoinCommunity closeCard={closeModal} />}
    </motion.div>
}




const AddContent = ({ closeCard }: cardComponent) => {
    const queryClient = useQueryClient();

    const listData = queryClient.getQueryData<AxiosResponse<GetListResponse>>(['getList']);
    const collectionList = listData?.data?.payload?.collectionList || [];

    const [tab, setTab] = useTabAtom()


    let collectionId, communityId;
    let linkType: type;
    const [currentTag, setCurrentTag] = useState<string>("");

    const [tagsList, setTagsList] = useState<string[]>([]);

    const [hyperLink, setHyperLink] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [note, setNote] = useState<string>('');


    const tagsKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const trimmed = currentTag.trim();
            if (trimmed !== '') {
                setTagsList((prev) => [...prev, trimmed]);
            }
            setCurrentTag("");
        }
    }

    const deleteTag = useCallback((tag: string) => {
        setTagsList((prev) => prev.filter((given) => given != tag));
    }, [])

    const renderedTags = useMemo(() => {
        return tagsList.map((tag) => (
            <Tag
                key={tag}
                name={tag}
                id={tag}
                onClickHandler={() => deleteTag(tag)}
                endIcon={<CrossIcon dim="15" />}
            />
        ));
    }, [tagsList]);

    const { mutateAsync, isPending, isSuccess, isError } = useAddContentQuery();

    const addContentHandler = async () => {
        console.log(tab)
        if (hyperLink.trim() === "" || title.trim() === "") return;

        //collection id /\ community id
        if (tab.startsWith('dashboard')) {
            collectionId = collectionList.find((coll) => coll.name === 'dashboard')?.id ?? -1;
            communityId = -1;
        } else if (tab.startsWith('collection')) {
            const tabId = parseInt(tab.split('-')[1]);
            collectionId = tabId;
            communityId = -1;
        } else {
            const tabId = parseInt(tab.split('-')[1]);
            communityId = tabId;
            collectionId = -1;
        }


        //tags list handled
        const allTags = listData?.data?.payload.tagsList || [];
        const modAllTags = allTags.map((tag) => { return tag.title.toLowerCase() });

        let existingTags: string[] = [];
        let newTags: string[] = [];


        tagsList.forEach((tag) => {
            let lowerTag = tag.toLowerCase();
            if (modAllTags.includes(lowerTag)) {
                existingTags.push(lowerTag);
            } else {
                newTags.push(lowerTag);
            }
        })

        //linktype handled
        if (hyperLink.includes('x.com')) {
            linkType = 'TWITTER';
        } else if (hyperLink.includes('reddit.com')) {
            linkType = 'REDDIT';
        } else if (hyperLink.includes('instagram.com')) {
            linkType = 'INSTAGRAM';
        } else if (hyperLink.includes('youtube.com') || hyperLink.includes('youtu.be')) {
            linkType = 'YOUTUBE';
        } else {
            linkType = 'WEB'
        }


        mutateAsync({ title: title.trim(), hyperlink: hyperLink.trim(), note: note.trim(), type: linkType, collectionId, communityId, existingTags: existingTags, newTags: newTags });
        console.log(tab);
        closeCard();
    }

    return <motion.div initial={{ y: 8, scale: 0.99 }} animate={{ y: 0, scale: 1 }} exit={{ y: 8, opacity: 0 }} transition={{ duration: 0.1 }} className={` max-h-[800px]  w-[80%] xl:w-[48%] md:w-[60%] rounded-3xl bg-modalCard  cursor-default scrollbarSB  pb-8`} >
        <div className="flex justify-between items-center mx-8 md:mx-10 xl:mx-12 mt-10">
            <div className="font-[650]  text-4xl text-modalHead font-inter ">Save a New Link</div>
            <ButtonEl buttonType="" onClickHandler={closeCard} startIcon={<CrossIcon dim="50" style="text-gray hover:bg-gray-300/60 transition-hover duration-150 ease-in-out rounded-xl p-2" />} />
        </div>
        <div className="mt-3 text-center text-xl mx-12  font-[450] text-gray-500">
            Paste a link you want to save or share with your Second Brain.
        </div>
        <div className="text-center mt-2">

            <input type="text" placeholder="Paste link here" className="w-[90%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-xl font-cardTitleHeading border-2 border-gray-500 rounded-md hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-600 focus:outline-none" value={hyperLink} onChange={(e) => setHyperLink(e.target.value)} />

            <input type="text" placeholder="Enter title" className="w-[90%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-xl font-cardTitleHeading border-2 border-gray-500 rounded-md hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-600 focus:outline-none" value={title} onChange={(e) => setTitle(e.target.value)} />

            <textarea placeholder="Note..." className="w-[90%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-xl font-cardTitleHeading border-2 border-gray-500 rounded-md hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-600 focus:outline-none overflow-y-auto scrollbarSB" value={note} onChange={(e) => setNote(e.target.value)} />

            {!tab.startsWith('community') && <>         <input type="text" placeholder="Enter tags for this post" className="w-[90%] mt-2 cursor-pointer py-1 pl-4 md:py-2 text-xl font-cardTitleHeading border-2 border-gray-500 rounded-md hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-600 focus:outline-none" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={(e) => tagsKeyDownHandler(e)} />

                <div className="mt-2 flex flex-wrap mx-12 gap-2 w-[90%] overflow-y-auto scrollbarSB max-h-[48px]">
                    {renderedTags}
                </div></>
            }
            <ButtonEl buttonType="primary" onClickHandler={() => addContentHandler()} particularStyle={`w-[80%] xl:w-[90%]  font-inter mt-4 h-16 mx-auto font-[550] font-inter ${isPending ? "animate-pulse" : ""} `} placeholder="Add Link" />


        </div>
    </motion.div>
}

const ShareBrain = ({ closeCard, setPopUpLive }: cardComponent) => {

    const [tab] = useTabAtom();
    const { data: listData, isFetched, isSuccess: isListSuccess } = useGetListQuery()

    let collectionList: { name: string, id: number }[];
    if (isFetched) {
        collectionList = listData?.data?.payload.collectionList;
    }

    const [currentCollectionId, setCurrentCollectionId] = useState<number>(-1);

    useEffect(() => {
        if (!isListSuccess) return;

        if (tab.startsWith('dashboard')) {
            setCurrentCollectionId(collectionList.find((coll) => coll.name === 'dashboard')?.id ?? -1);
        } else {
            const tabId = parseInt(tab.split('-')[1]);
            setCurrentCollectionId(tabId);
        }
    }, [tab, listData, isListSuccess]);

    const { mutateAsync, isPending, data, isSuccess, error } = useShareBrain({ collectionId: currentCollectionId })

    const copyLink = () => {
        navigator.clipboard.writeText(data?.payload?.generatedLink ?? "SoS");
        setPopUpLive?.((prev) => !prev);
    }

    const handleShareBrain = async () => {
        try {
            await mutateAsync({ collectionId: currentCollectionId });
            console.log("generated link");
        } catch (e) {
            console.error("Issue with creating a sharacble link", error);
        }
    }

    return <motion.div 
        initial={{ y: 8, scale: 0.99 }} 
        animate={{ y: 0, scale: 1 }} 
        transition={{ duration: 0.2 }} 
        className={` max-h-[500px] w-[70%] xl:w-[40%] md:w-[50%]  rounded-3xl bg-modalCard  cursor-default overflow-y-hidden scrollbarSB pb-10`} 
        >
        <div 
            className="flex justify-between items-center mx-8 md:mx-10 xl:mx-12 mt-8">
            <div 
                className="font-[650]  text-3xl text-modalHead font-inter ">Share your Second Brain</div>
                <ButtonEl 
                    buttonType="" 
                    onClickHandler={closeCard} 
                    startIcon={<CrossIcon dim="50" style="text-gray hover:bg-gray-300/60 transition-hover duration-150 ease-in-out rounded-xl p-2" />} 
                />
        </div>
        <div 
            className="  mt-6 xl:mt-5 md:mt-6  xl:text-xl text-justify  text-xl mx-12  font-[450] text-gray-500">
                Share your entire collection of posts, blogs, tweets, and videos with others. They'll be able to import your content into their own Second Brain.
        </div>
        <div 
            className="mt-2 xl:text-xl md:text-md mx-12 text-center font-[400] text-gray-600">
            You can stop sharing your secondbrain at any time.
        </div>
        {
            isPending ? <div 
                className="w-[80%] xl:w-[88%] mt-6 h-16 mx-auto  bg-primaryButtonBlue rounded-xl h-14 flex justify-center items-center hover:bg-hover1">
                    <Loader 
                        dimh="30" dimw="60" 
                        style="" />
                </div> : 
            !isSuccess ? <ButtonEl 
                buttonType="primary" 
                onClickHandler={() => handleShareBrain()} 
                particularStyle={`w-[80%] xl:w-[88%] gap-5 mt-6 h-16 mx-auto font-[550] font-inter `} placeholder="Generate sharable link" 
                startIcon={<CopyIcon 
                    dim="40" 
                    style="color-white" />} />
                : <div 
                    className=" flex xl:max-w-[88%] max-w-[95%] bg-gray-200 justify-between items-center mx-auto h-18 mt-3 rounded-[3.5rem] border-2 border-gray-800 p-1">
                    <div 
                        className="max-w-[80%] line-clamp-1 pl-3 text-[1.48rem] font-cardTitleHeading">     
                            {data?.payload?.generatedLink ?? "server issue, no link generated"}
                    </div>
                    <div 
                        className="cursor-pointer justify-center flex items-center h-full rounded-[3.5rem] bg-[#8F96C0] hover:bg-[#AAB1DA] w-[20%] shadow-2xl text-[1.43rem] font-[480] transition-hover duration-150" 
                        onClick={() => copyLink()}>
                            Copy link
                    </div>
                </div>
        }
    </motion.div>
}


const Logout = ({ closeCard }: cardComponent) => {

    return <div className="h-[50%] w-[60%] bg-modalCard py-4">
        <button onClick={() => closeCard()}>closeModal</button>
        <h1 className="text-center">Logout</h1>
    </div>
}


const AddCollection = ({ closeCard }: cardComponent) => {
    const [collectionName, setCollectionName] = useState<string>("");
    const [collectionDesc, setCollectionDesc] = useState<string>("");
    const { mutateAsync, isPending, error } = useCreateCollection();

    const handleAddCollection = async () => {
        if (collectionName.trim() === "" || collectionDesc.trim() === "") return;
        try {
            mutateAsync({ collectionName, collectionDesc });
        } catch (e) {
            console.log('errro occured', error)
        } finally {
            closeCard();
        }
    }

    return <motion.div initial={{ y: 8, scale: 0.99 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.3 }} className={`h-[65%] md:h-[57%] xl:h-[48%] w-[70%] xl:w-[38%] md:w-[50%]  rounded-3xl bg-modalCard  cursor-default overflow-y-hidden scrollbarSB `} >
        <div className="flex justify-between items-center mx-8 nd:mx-10 xl:mx-12 mt-8">
            <div className="font-[650]  text-3xl text-modalHead font-inter ">Start a new collection</div>
            <ButtonEl buttonType="" onClickHandler={closeCard} startIcon={<CrossIcon dim="50" style="text-gray hover:bg-gray-300/60 transition-hover duration-150 ease-in-out rounded-xl p-2" />} />
        </div>
        <div className="  mt-6 text-lg mx-12  font-[450] text-gray-500">
            Organize related links under one collection. Perfect for keeping your research or ideas grouped together.
        </div>
        <div className="text-center mt-3">
            <input type="text" placeholder="Name your collection" className="w-[90%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-xl font-cardTitleHeading border-2 border-gray-500 rounded-xl hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-700 focus:outline-none" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
            <textarea placeholder="A brief description shown when this collection is shared." className="w-[90%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-xl font-cardTitleHeading scrollbarSB border-2 border-gray-500 rounded-xl hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-700 focus:outline-none" value={collectionDesc} onChange={(e) => setCollectionDesc(e.target.value)} />
        </div>
        <ButtonEl buttonType="primary" onClickHandler={() => handleAddCollection()} particularStyle="w-[90%]  font-inter mt-2 h-12 mx-auto text-2xl font-[550] font-inter " placeholder="Create new collection" />
        {isPending && <div className="animate-pulse text-lg text-center mt-1 font[600]">Creating collection {collectionName}</div>}
    </motion.div>
}

const StartCommunity = ({ closeCard }: cardComponent) => {
    const [allowPost, setAllowPost] = useState<boolean>(false);
    const [communityName, setcommunityName] = useState<string>("");
    const [communityDesc, setcommunityDesc] = useState<string>("");
    const [emailLead, setemailLead] = useState<string>("");
    const [password, setpassword] = useState<string>("");


    const [inValidInput, setInvalidInput] = useState<Boolean>(false)
    const [startClicked, setStartClicked] = useState<Boolean>(true);

    const onStart = () => {
        if (!communityName.trim() || !communityDesc.trim()) {
            setInvalidInput(true);
        } else {
            setInvalidInput(false);
            setStartClicked(false);
        }
    }

    const { mutateAsync, data, isPending, error } = useCreateCommunity();

    const handleCreateCommunity = async () => {
        try {
            await mutateAsync({ name: communityName.trim(), descp: communityDesc.trim(), password: password.trim(), emailLead: emailLead.trim(), membersCanPost: allowPost });
            if (!isPending && !error) {
                console.log("successfully community created");
                console.log(data)
            }
        } catch (e) {
            console.log(error);
            alert("some server issue in createing community")
        }
        closeCard();
    }

    const checkboxDivStyle = "flex items-center mt-2 pl-16 text-2xl font-cardTitleHeading font-[400] text-slate-700 "
    const checkboxInputStyle = "size-6 mr-4 cursor-pointer accent-[#6056AA] hover:scale-120 hover:inset-ring-2 hover:inset-ring-[#6056AA]/30 border-slate-600   transition-hover duration-200 ease-in-out";
    const inputStyle = "w-[85%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-2xl font-cardTitleHeading border-2 border-gray-500 rounded-xl hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-700 focus:outline-none";

    return <motion.div initial={{ y: 8, scale: 0.99 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.2 }} className={`h-[65%] md:h-[57%] xl:min-h-[30%] w-[70%] xl:w-[45%] md:w-[50%]  rounded-3xl bg-modalCard  cursor-default overflow-y-hidden scrollbarSB overflow-x-hidden`} >
        <div className="flex justify-between items-center mx-8 nd:mx-10 xl:mx-16 mt-8">
            <div className="font-[650]  text-3xl text-modalHead font-inter">Start your Community!!</div>
            <ButtonEl buttonType="" onClickHandler={closeCard} startIcon={<CrossIcon dim="50" style="text-gray hover:bg-gray-300/60 transition-hover duration-150 ease-in-out rounded-xl p-2" />} />
        </div>
        <AnimatePresence>
            {startClicked ? <motion.div key="sliding-box1"
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}>
                <div className="mt-5 text-[1.3rem] mx-16 text-center tracking-[0.05rem]  font-[550] text-gray-500">
                    Passionate about something? Build a space where others can explore it with you.
                </div>

                <div className="text-center mt-4">
                    <input type="text" onChange={(e) => setcommunityName(e.target.value)} value={communityName} placeholder="Name your community" className={inputStyle + ""} />

                    <textarea placeholder="Describe you community.." value={communityDesc} onChange={(e) => setcommunityDesc(e.target.value)} className={inputStyle} />
                </div>

                <div className={checkboxDivStyle + " mt-4"}>
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={allowPost} onChange={() => { setAllowPost((prev) => !prev) }} className={checkboxInputStyle} ></input>Allow members to post
                    </label>
                </div>

                {inValidInput && <div className="text-center text-red-600 font-[500] mt-2">Invalid input-Community name and description field are necessary field</div>}
                <ButtonEl buttonType="primary" onClickHandler={onStart} particularStyle="w-[85%] gap-5 font-inter mt-6 h-16 mx-auto font-[550] font-inter " placeholder="Start your Community" />
            </motion.div> : <motion.div key="sliding-box2"
                initial={{ x: 250, y: 0, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{ x: 200, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}>

                <ButtonEl onClickHandler={() => setStartClicked(true)} startIcon={<LeftIcon dim="20" />} buttonType={"back"} placeholder="Back"
                    particularStyle=" ml-16 my-2 " />
                <div className="text-center">
                    <input type="text" onChange={(e) => setemailLead(e.target.value)} placeholder="Enter Email-id(lead)" className={inputStyle + ""} />
                    <input type="text" onChange={(e) => setpassword(e.target.value)} placeholder="Enter password for access" className={inputStyle + ""} />
                </div>
                <div className="text-lg text-justify my-3 text-red-600 mx-17">
                    <u>Note:</u>
                    <ul className="list-disc pl-7">
                        <li>This password is used by new members to join the community.                            </li>
                        <li>It can be changed later if needed.                            </li>
                        <li>Do not use anything personal, as the password is shared.                            </li>
                        <li>Group settings can be managed lead</li>
                    </ul>
                </div>
                <ButtonEl buttonType="primary" onClickHandler={handleCreateCommunity} particularStyle="w-[85%] gap-5 font-inter mt-6 h-16 mx-auto font-[550] font-inter " placeholder="Final Submission" />
            </motion.div>}
        </AnimatePresence>
    </motion.div>
}


const JoinCommunity = ({ closeCard }: cardComponent) => {

    const { mutateAsync, data, isPending, error } = useJoinCommunity();
    const [communityId, setCommunityId] = useState<string>('');
    const [inValidInput, setInvalidInput] = useState<boolean>(false);

    const handleJoinCommunity = async () => {
        const communityIdTrimmed = communityId.trim();
        if (!communityIdTrimmed) {
            setInvalidInput(true);
        } else {
            try {
                await mutateAsync({ communityId: communityIdTrimmed });
                closeCard();
            } catch (e) {
                console.log("Error happened \n\n");
                console.log(error)
            }
        }
    }


    const inputStyle = "w-[85%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-2xl font-cardTitleHeading border-2 border-gray-500 rounded-xl hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-600 focus:outline-none";


    return <motion.div initial={{ y: 8, scale: 0.99 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.2 }} className={`h-[65%] md:h-[57%] xl:h-[37%] w-[70%] xl:w-[40%] md:w-[50%]  rounded-3xl bg-modalCard  cursor-default overflow-y-hidden scrollbarSB `} >
        <div className="flex justify-between items-center mx-8 nd:mx-10 xl:mx-15 mt-8">
            <div className="font-[650]  text-3xl text-modalHead font-inter ">Join a Community!!</div>
            <ButtonEl buttonType="" onClickHandler={closeCard} startIcon={<CrossIcon dim="50" style="text-gray hover:bg-gray-300/60 transition-hover duration-150 ease-in-out rounded-xl p-2" />} />
        </div>
        <div className="mt-5 text-center text-xl mx-12  font-[450] text-gray-500">
            Discover and share the best content with like-minded people.
        </div>
        <div className="text-center mt-3">
            <input type="text" placeholder="Paste community link" value={communityId} onChange={(e) => setCommunityId(e.target.value)} className={inputStyle + " h-14"} />
        </div>
        {inValidInput && <div className="text-center text-red-600 font-[500] mt-2">Invalid input-Community Id password field are necessary.</div>}
        <ButtonEl buttonType="primary" onClickHandler={handleJoinCommunity} particularStyle="w-[85%] gap-5 font-inter mt-6 h-16 mx-auto font-[550] font-inter " placeholder="Join Community" />
    </motion.div>
}



export default Modal; 