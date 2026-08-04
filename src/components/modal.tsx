import { CopyIcon, CrossIcon, Loader } from "../icons/commonIcons";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Tag from "./tags";
import { useAddContentQuery, useCreateCollection, useCreateCommunity, useJoinCommunity, useShareBrain } from "../api/user/mutate";
import { useQueryClient } from "@tanstack/react-query";
import { type AxiosResponse } from 'axios';
import { usePopUpAtom, useTabAtom } from "../recoil/clientStates";
import { useGetListQuery } from "../api/user/query";
import type { SetterOrUpdater } from "recoil";
import React from "react";

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

type Cause = "addContent" | "shareBrain" | "addCollection" | "addCommunity" | "joinCommunity" | "close";

interface props {
    cause: Cause;
    closeModal: () => void;
    collectionName?: string;
}

interface cardComponent {
    setPopUpLive?: SetterOrUpdater<boolean>;
    closeCard: () => void;
    cause?: Cause;
}

/* One paper vocabulary for every dialog: hairline accent border, dithered cap,
   mono eyebrow, Bitter italic title, square fields. */
const field = "w-full border border-[var(--rule)] bg-white px-3 py-2 text-[0.86rem] text-[#18181B] outline-none transition-colors placeholder:text-[#A1A1AA] hover:border-[#C7C7CB] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15";
const primary = "w-full cursor-pointer border border-[var(--accent)] bg-[var(--accent)] px-4 py-2.5 text-center font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#1E3A8A] disabled:opacity-60";
const ghost = "cursor-pointer border border-[var(--rule)] px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-[#52525B] transition-colors hover:bg-[var(--wash)] hover:text-[var(--accent)]";
const eyebrowCls = "font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--accent)]";
const note = "text-[0.84rem] leading-[1.5] text-[#52525B]";
const invalid = "border-l-2 border-[#B91C1C] bg-[#FEF2F2] px-3 py-2 text-[0.78rem] text-[#B91C1C]";

const Shell = ({ eyebrow, title, sub, onClose, width, children }: {
    eyebrow: string; title: string; sub?: ReactNode; onClose: () => void; width: string; children: ReactNode;
}) => (
    <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={e => e.stopPropagation()}
        className={`max-h-[88vh] w-[92%] cursor-default overflow-y-auto border border-[var(--accent)] bg-[#FBFBF9] scrollbar-hidden ${width}`}>

        <div className="dither-strip h-9" />

        <div className="px-6 pt-5 pb-6 sm:px-8">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className={eyebrowCls}>[ {eyebrow} ]</p>
                    <h2 className="mt-2 font-head text-[1.4rem] leading-tight italic text-[#141418]">{title}</h2>
                </div>
                <button onClick={onClose} aria-label="close"
                    className="shrink-0 cursor-pointer p-1.5 text-[#71717A] transition-colors hover:bg-[var(--wash)] hover:text-[var(--accent)]">
                    <CrossIcon dim="16" />
                </button>
            </div>

            {sub && <p className={`mt-3 ${note}`}>{sub}</p>}

            <div className="mt-5 flex flex-col gap-3">{children}</div>
        </div>
    </motion.div>
);

const Modal = ({ cause, closeModal }: props) => {

    const [popUpLive, setPopUpLive] = usePopUpAtom();

    // esc closes, and so does a click on the backdrop itself
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [closeModal]);

    return <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'circIn' }}
        onClick={closeModal}
        className="fixed top-0 left-0 z-300 flex h-screen w-screen items-center justify-center bg-[#0A1B33]/45 font-jakarta backdrop-blur-sm" >
        {cause == "addContent" && <AddContent closeCard={closeModal} />}
        {cause == "shareBrain" && <ShareBrain setPopUpLive={setPopUpLive} cause={cause} closeCard={closeModal} />}
        {cause == "addCommunity" && <StartCommunity closeCard={closeModal} />}
        {cause == "addCollection" && <AddCollection closeCard={closeModal} />}
        {cause == "joinCommunity" && <JoinCommunity closeCard={closeModal} />}
    </motion.div>
};




const AddContent = ({ closeCard }: cardComponent) => {
    const queryClient = useQueryClient();

    const listData = queryClient.getQueryData<AxiosResponse<GetListResponse>>(['getList']);
    const collectionList = listData?.data?.payload?.collectionList || [];

    const [tab] = useTabAtom()


    let collectionId, communityId;
    let linkType: type;
    const [currentTag, setCurrentTag] = useState<string>("");

    const [tagsList, setTagsList] = useState<string[]>([]);

    const [hyperLink, setHyperLink] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [noteText, setNote] = useState<string>('');


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
                endIcon={<CrossIcon dim="10" style="ml-1.5" />}
                style="text-[0.68rem] px-2 py-[0.2rem]"
            />
        ));
    }, [tagsList]);

    const { mutateAsync, isPending } = useAddContentQuery();

    const addContentHandler = async () => {
        if (hyperLink.trim() === "" || title.trim() === "") return;

        //collection id /\ community id
        if (tab.startsWith('dashboard') || tab === 'stats') {
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


        mutateAsync({ title: title.trim(), hyperlink: hyperLink.trim(), note: noteText.trim(), type: linkType, collectionId, communityId, existingTags: existingTags, newTags: newTags });
        closeCard();
    }

    return <Shell
        eyebrow="new link"
        title="Save a new link"
        sub="Paste a link you want to save or share with your Second Brain."
        onClose={closeCard}
        width="max-w-[520px]">

        <input
            type="text"
            placeholder="Paste link here"
            className={field}
            value={hyperLink}
            onChange={(e) => setHyperLink(e.target.value)}
        />

        <input
            type="text"
            placeholder="Enter title"
            className={field}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
            placeholder="Note..."
            rows={3}
            className={`${field} resize-y`}
            value={noteText}
            onChange={(e) => setNote(e.target.value)}
        />

        {!tab.startsWith('community') && <>
            <input
                type="text"
                placeholder="Enter tags, hit return for each"
                className={field}
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => tagsKeyDownHandler(e)}
            />

            {tagsList.length > 0 &&
                <div className="flex max-h-[64px] flex-wrap gap-1.5 overflow-y-auto scrollbar-hidden">
                    {renderedTags}
                </div>
            }
        </>}

        <button onClick={addContentHandler} disabled={isPending}
            className={`${primary} mt-1 ${isPending ? "animate-pulse" : ""}`}>
            [ add link ]
        </button>
    </Shell>
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

        if (tab.startsWith('dashboard') || tab === 'stats') {
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
        } catch (e) {
            console.error("Issue with creating a sharacble link", error);
        }
    }

    return <Shell
        eyebrow="share"
        title="Share your Second Brain"
        sub="Share your entire collection of posts, blogs, tweets and videos with others. They'll be able to import your content into their own Second Brain."
        onClose={closeCard}
        width="max-w-[520px]">

        <p className="font-mono text-[0.72rem] text-[#71717A]">You can stop sharing at any time.</p>

        {isPending
            ? <div className={`${primary} flex items-center justify-center`}>
                <Loader dimh="16" dimw="44" style="text-white" />
            </div>
            : !isSuccess
                ? <button onClick={handleShareBrain} className={`${primary} flex items-center justify-center gap-3`}>
                    <CopyIcon dim="16" style="size-4" />
                    [ generate sharable link ]
                </button>
                : <div className={`flex items-center gap-2 border border-[var(--rule)] bg-white p-1.5`}>
                    <span className="min-w-0 flex-1 truncate pl-1.5 font-mono text-[0.74rem] text-[#3F3F46]">
                        {data?.payload?.generatedLink ?? "server issue, no link generated"}
                    </span>
                    <button onClick={copyLink}
                        className="shrink-0 cursor-pointer bg-[var(--accent)] px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#1E3A8A]">
                        copy
                    </button>
                </div>
        }
    </Shell>
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
            console.error('errro occured', error)
        } finally {
            closeCard();
        }
    }

    return <Shell
        eyebrow="new workspace"
        title="Start a new workspace"
        sub="Organize related links under one workspace. Perfect for keeping your research or ideas grouped together."
        onClose={closeCard}
        width="max-w-[460px]">

        <input type="text" placeholder="Name your workspace" className={field}
            value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />

        <textarea placeholder="A brief description shown when this workspace is shared." rows={3}
            className={`${field} resize-y`}
            value={collectionDesc} onChange={(e) => setCollectionDesc(e.target.value)} />

        <button onClick={handleAddCollection} disabled={isPending}
            className={`${primary} mt-1 ${isPending ? "animate-pulse" : ""}`}>
            {isPending ? `[ creating ${collectionName} ]` : "[ create collection ]"}
        </button>
    </Shell>
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
                console.log(data)
            }
        } catch (e) {
            console.error(error);
        }
        closeCard();
    }

    return <Shell
        eyebrow={startClicked ? "new community" : "access"}
        title="Start your community"
        sub={startClicked ? "Passionate about something? Build a space where others can explore it with you." : undefined}
        onClose={closeCard}
        width="max-w-[520px]">

        {startClicked ? <motion.div key="sliding-box1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col gap-3">

            <input type="text" placeholder="Name your community" className={field}
                onChange={(e) => setcommunityName(e.target.value)} value={communityName} />

            <textarea placeholder="Describe your community..." rows={3} className={`${field} resize-y`}
                value={communityDesc} onChange={(e) => setcommunityDesc(e.target.value)} />

            <label className="flex cursor-pointer items-center gap-2.5 text-[0.84rem] text-[#3F3F46]">
                <input type="checkbox" checked={allowPost} onChange={() => setAllowPost((prev) => !prev)}
                    className="size-4 cursor-pointer accent-[var(--accent)]" />
                Allow members to post
            </label>

            {inValidInput && <p className={invalid}>Community name and description are both required.</p>}

            <button onClick={onStart} className={`${primary} mt-1`}>[ continue ]</button>
        </motion.div>

            : <motion.div key="sliding-box2"
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 60, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex flex-col gap-3">

                <button onClick={() => setStartClicked(true)} className={`${ghost} self-start`}>[ back ]</button>

                <input type="text" placeholder="Enter email-id (lead)" className={field}
                    value={emailLead} onChange={(e) => setemailLead(e.target.value)} />
                <input type="text" placeholder="Enter password for access" className={field}
                    value={password} onChange={(e) => setpassword(e.target.value)} />

                <div className="border-l-2 border-[var(--accent)] bg-[var(--wash)] px-3 py-2.5">
                    <p className={eyebrowCls}>[ note ]</p>
                    <ul className="mt-2 list-disc pl-4 text-[0.78rem] leading-[1.45] text-[#52525B]">
                        <li>New members use this password to join.</li>
                        <li>It can be changed later if needed.</li>
                        <li>Don't use anything personal — the password gets shared.</li>
                        <li>Group settings are managed by the lead.</li>
                    </ul>
                </div>

                <button onClick={handleCreateCommunity} disabled={isPending}
                    className={`${primary} ${isPending ? "animate-pulse" : ""}`}>
                    [ create community ]
                </button>
            </motion.div>}
    </Shell>
}


const JoinCommunity = ({ closeCard }: cardComponent) => {

    const { mutateAsync, error, isPending } = useJoinCommunity();
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
                console.error(error)
            }
        }
    }

    return <Shell
        eyebrow="join"
        title="Join a community"
        sub="Discover and share the best content with like-minded people."
        onClose={closeCard}
        width="max-w-[440px]">

        <input
            type="text"
            placeholder="Paste community link..."
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleJoinCommunity(); }}
            className={field}
        />

        {inValidInput && <p className={invalid}>A community link is required.</p>}

        <button onClick={handleJoinCommunity} disabled={isPending}
            className={`${primary} mt-1 ${isPending ? "animate-pulse" : ""}`}>
            [ join community ]
        </button>
    </Shell>
}



export default React.memo(Modal);
