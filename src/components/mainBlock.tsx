import { useState, useEffect, Fragment, useRef, useLayoutEffect } from "react";
import { ButtonEl } from "./button"
import { CardElement } from "./card";
import { DeleteIcon, GridIcon, ListIcon, Loader, PlusIcon, ShareIcon, BlockIcon } from "../icons/commonIcons";
import type { ChildProps } from "../pages/dashboard";
import { useCardCountAtom, useCurrentCollection, useCurrentCommunity, usePopUpAtom, usePopUpMessage, useTabAtom } from "../recoil/clientStates";
import { useFetchQueryCollection, useFetchQueryCommunity, useGetListQuery } from "../api/user/query";
import { useDeletecardQuery, useDeleteCollectionQuery, useGetCommunityMembers, useRemoveShareQuery, useShareCommunityLogin } from "../api/user/mutate";
import { useDeleteID } from "../recoil/deleteId";
import { CommunityCard } from "./communityCard";
import { CardsLoaderSkeleton } from "../icons/skeleton";
import { CommunityIcon } from "../icons/particularIcons";
import { RenderMembers } from "./membersList";

const MainBlock = ({ setModalNeededBy, layout, setLayout, user }: ChildProps) => {
    const containerRef = useRef<HTMLDivElement>(null);



    const [tab, setTab] = useTabAtom();
    const { data: listData, isFetched, isSuccess: isListSuccess } = useGetListQuery();
    const [popUp, setPopUp] = usePopUpAtom();
    const [popUpMessage, setPopupMessage] = usePopUpMessage();

    let collectionList: { name: string, id: number, shared: boolean }[];
    let allCommunities: { name: string, id: number }[];

    const [currentCollection1, setCurrentCollection1] = useCurrentCollection();
    const [currentCommunity1, setCurrentCommunity1] = useCurrentCommunity();

    const [cardsCount, setCardCount] = useCardCountAtom();


    if (isFetched) {
        collectionList = listData?.data?.payload.collectionList;
        allCommunities = listData?.data?.payload.allCommunities;
    }






    useEffect(() => {
        if (!isListSuccess) return;

        if (tab.startsWith('dashboard')) {
            setCurrentCollection1({ name: "dashboard", id: collectionList.find((coll) => coll.name === 'dashboard')?.id ?? -1 })
            setCurrentCommunity1({ name: "", id: -1 });
        } else if (tab.startsWith('collection')) {
            const tabId = parseInt(tab.split('-')[1]);
            const matched = collectionList.find((coll) => coll.id === tabId);

            setCurrentCollection1({ name: matched?.name ?? "dashboard", id: tabId });
            setCurrentCommunity1({ name: "", id: -1 });
        } else {
            const tabId = parseInt(tab.split('-')[1]);
            const matched = allCommunities.find((comm) => comm.id === tabId);
            setCurrentCommunity1({ name: matched?.name ?? "", id: tabId });
            setCurrentCollection1({ name: "", id: -1 });
        }
        setMembersList(false);
    }, [tab, listData, isListSuccess]);

    const [deleteId] = useDeleteID();
    const { mutate } = useDeletecardQuery();
    useEffect(() => {
        if (deleteId !== -1) {
            mutate({ contentId: deleteId, collectionId: currentCollection1.id });
        }
    }, [deleteId])

    //getting the memebers of a community
    const [membersList, setMembersList] = useState<boolean>(false)
    const { isPending: membersListPending, mutateAsync: getCommunityMembers, data: membersData } = useGetCommunityMembers();

    const getMembers = async () => {
        if (membersList) {
            console.log("closed");
            setMembersList(false);
            return;
        }

        console.log("opened");
        setMembersList(true);
        await getCommunityMembers({ communityId: currentCommunity1.id });

    }


    //getting paginated data for collections
    const { data: pagesData, isLoading: contentLoading, hasNextPage, fetchNextPage } = useFetchQueryCollection({ collectionId: currentCollection1.id });

    useEffect(() => {
        if (!contentLoading) {
            const totalCards = pagesData?.pages
                ?.map((page) => page.group?.payload?.content?.length ?? 0)
                .reduce((a, b) => a + b, 0);

            setCardCount(totalCards);
        }
    }, [pagesData, contentLoading]);


    //getting paginated data for coommunity
    const { data: communityPagesData, isLoading: communityDataLoading, hasNextPage: communityNextPage, fetchNextPage: fetchCommunityNextPage } = useFetchQueryCommunity({ communityId: currentCommunity1.id });

    useEffect(() => {
        if (!communityDataLoading) {
            const totalCards = communityPagesData?.pages
                ?.map((page) => page.group?.payload?.content?.length ?? 0)
                .reduce((a, b) => a + b, 0);

            setCardCount(totalCards);
        }
    }, [communityPagesData, communityDataLoading]);



    const { mutateAsync: shareLogin, isPending: shareLoginPending, error: shareError } = useShareCommunityLogin();
    const handleShareCommunityCred = async () => {
        try {
            const data = await shareLogin({ communityId: currentCommunity1.id });
            setPopupMessage("Community credentials coppied!!");
            setPopUp(true)
            navigator.clipboard.writeText(data.payload.message);
        } catch (e) {
            console.error("error occured :\n", shareError)
        }
    }





    //habdling deletion of a collection 
    const [deleting, setDeleting] = useState<boolean>(false);
    const { mutateAsync: deleteCollectionFn } = useDeleteCollectionQuery();
    const deleteCollection = async () => {
        try {
            setDeleting(true);
            await deleteCollectionFn({ collectionId: currentCollection1.id });
            setTab('dashboard');
        } catch (err) {
        } finally {
            setDeleting(false);
        }
    }


    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handler = () => console.log("scrollTop:", el.scrollTop);
        el.addEventListener("scroll", handler);

        return () => el.removeEventListener("scroll", handler);
    }, []);


    //handling unshare
    const [removingShare, setRemovingShare] = useState<boolean>(false);
    const { mutateAsync: removerShare } = useRemoveShareQuery();
    const handleRemoveShare = async () => {
        try {
            setRemovingShare(true);
            await removerShare({ collectionId: currentCollection1.id });
        } catch (err) {
            console.log("errororooorooo");
        } finally {
            setRemovingShare(false);
            setPopupMessage('Collection is no longer shared!!');
            setPopUp(true);
        }
    }

    const layoutStyle = "hover:text-white hover:bg-[#6056AA]/60 text-black transition-hover duration-150 ease-in-out rounded-lg p-2  cursor-pointer ";

    return <div ref={containerRef} className="bg-mainComponentBg z-10 flex-1 pb-20 relative h-screen overflow-y-auto scrollbarMC">


        <div className="flex justify-between bg-mainComponentBg border-b-2 border-slate-300 gap-1  left-0 top-0 sticky z-10 items-center py-6 2xl:pr-6">
            <div 
                className="xl:text-[2.7rem] 2xl:text-[3.2rem] lg:text-[2.3rem] text-[2.5rem] translate-x-6 lg:translate-x-0 font-welcome cursor-default truncate ml-8 text-gradient  ">
                Welcome, {user?.userName}
            </div>
            <div className="lg:flex justify-around xl:gap-6 gap-3 hidden 2xl:scale-100 md:scale-84 scale-100 ">
                {!tab.startsWith('community') ? <ButtonEl
                    onClickHandler={() => setModalNeededBy("shareBrain")}
                    particularStyle=" h-14 gap-0 scale-98"
                    buttonType="secondary"
                    placeholder="Share Brain"
                    startIcon={<ShareIcon style="size-8.5 " />} /> : null
                }
                <ButtonEl onClickHandler={() => setModalNeededBy("addContent")}
                    buttonType="primary"
                    placeholder="Add Content"
                    particularStyle="scale-98"
                    startIcon={<PlusIcon style="size-8.5 " />}
                />
            </div>
        </div>
        <div className="md:flex md:justify-between md:items-center static mt-4 ">
            <div className="flex items-center justify-start">
                <div className="flex items-center justify-around ml-6 w-26 gap-2 rounded-lg  ">
                    <GridIcon 
                        dim="50" 
                        onClickHandler={() => setLayout?.("grid")} 
                        style={layoutStyle + (layout === "grid" ? " text-white bg-[#6056AA]/60 " : " bg-slate-300 ") + " scale-90 lg:scale-100 "} 
                    />
                    <ListIcon 
                        dim="50" 
                        onClickHandler={() => setLayout?.("list")} 
                        style={layoutStyle + (layout === "list" ? " text-white bg-[#6056AA]/60 " : " bg-slate-300 ") + " scale-90 lg:scale-100 "} 
                    />
                </div>
                <div 
                    className=" text-clamp lg:text-3xl text-[1.7rem] font-welcome text-[#51488C] mx-4"> 
                        {tab.startsWith("community") ? <>
                            {`Community : ${currentCommunity1.name}`} </> : 
                            <>{`Collection :  ${currentCollection1.name}`} 
                        </>} 
                </div>
            </div> 
            <div className="flex items-center justify-around"> 
                <div className="flex items-center justify-around mr-6 gap-2 rounded-lg">
                    {
                        !tab.startsWith("community") ? (
                            <><br className="block md:hidden" />
                            <br className="block md:hidden" />
                            <br className="block md:hidden" />
                             <div className="scale-90 lg:scale-100 flex gap-2 ">
                                {
                                    !tab.startsWith("dashboard") && (
                                        <ButtonEl
                                            onClickHandler={deleteCollection}
                                            buttonType="rightTopbar"
                                            particularStyle={`bg-red-300 hover:bg-red-400 w-52 ${deleting ? ' bg-red-400 ' : ""}`}
                                            startIcon={!deleting ? <DeleteIcon style="size-6 m-0 p-0" /> : null}
                                            placeholder={!deleting ? "Delete collection" : ""}
                                            endIcon={deleting ? <Loader style="block size-14  text-white" dimh="10" dimw="20" /> : null}
                                        />
                                    )
                                }{
                                    <ButtonEl
                                        onClickHandler={() => handleRemoveShare()}
                                        buttonType="rightTopbar"
                                        particularStyle={`bg-red-300 hover:bg-red-400 ${removingShare ? " bg-red-400" : ""}`}
                                        startIcon={!removingShare ? <BlockIcon style="size-7 m-0 p-0" /> : null}
                                        placeholder={!removingShare ? "Stop Sharing" : ""}
                                        endIcon={removingShare ? <Loader style="block size-14 text-white" dimh="10" dimw="20" /> : null}
                                    />
                                }</div>
                            </>
                        ) : (
                            <>  <br className="block lg:hidden" />
                            <br className="block lg:hidden" />
                            <br className="block lg:hidden" />
                                <ButtonEl
                                    startIcon={<CommunityIcon dim="45" style="text-white" />}
                                    onClickHandler={getMembers}
                                    buttonType={"rightTopbar"}
                                    placeholder="All members"
                                    particularStyle={`bg-yellow-300  cursor-pointer hover:bg-yellow-400`} />
                                <ButtonEl
                                    placeholder="Share Login"
                                    startIcon={<ShareIcon style=" size-6 text-white" />}
                                    onClickHandler={() => handleShareCommunityCred()} 
                                    disabled={shareLoginPending} 
                                    buttonType={"rightTopbar"} 
                                    particularStyle={`bg-green-300 hover:bg-green-400 ${removingShare ? " bg-red-400" : ""} ${shareLoginPending ? "animate-pulse cursor-not-allowed" : ""} `} 
                                />
                                {
                                    membersList ? <div className="absolute z-2 top-51 right-53 w-60 flex justify-center items-center translate-y-12 -translate-x-4 lg:translate-y-0 lg:-translate-x-0">
                                        {
                                            membersListPending ?
                                                <div className="bg-slate-200 border-1 w-full animate-pulse text-xl flex justify-center  items-center rounded-lg">loading...</div>
                                                : <div className=" relative top-0 max-h-[400px] scrollbar-hidden w-65">
                                                    <RenderMembers membersList={membersData.payload.usersList} />
                                                </div>
                                        }
                                    </div>
                                        :
                                        <></>
                                }
                            </>
                        )
                    }
                </div>


            </div>

        </div>
        <div className=" mt-6  w-full flex justify-around px-4 ">

            {   contentLoading || communityDataLoading ? <CardsLoaderSkeleton /> :
                <div className={` ${layout === "grid" ? " grid fourCards:grid-cols-4 1_5xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-6 " : " w-full "}`}>

                    {currentCollection1.id !== -1 ? <>
                        {pagesData?.pages.map((group, pageIndex) => {
                            const filteredCards = group.payload.content.filter((cardData: any) => {
                                const [, typeFilter] = tab.split("-");
                                if (tab.startsWith("collection") || !typeFilter) return true;
                                return typeFilter === cardData.content.type;
                            });

                            return (
                                <Fragment key={pageIndex}>
                                    {filteredCards.map((cardData: any) => (
                                        <CardElement
                                            key={cardData.content.id}
                                            id={cardData.content.id}
                                            collectionId={group.payload.content.collectionId}
                                            title={cardData.content.title}
                                            cardType={cardData.content.type}
                                            link={cardData.content.hyperlink}
                                            note={cardData.content.note}
                                            tags={cardData.content.tags}
                                            createdAt={cardData.content.createdAt}
                                            layout={layout}
                                            shared={false}
                                        />
                                    ))}
                                </Fragment>
                            );
                        })}


                    </> : (<>
                        {
                            communityPagesData?.pages.map((group, i) => (
                                <Fragment key={i}>
                                    {
                                        group.payload.content.map((cardData: any) => (

                                            <CommunityCard
                                                key={cardData.content.id}
                                                createdAt={cardData.content.createdAt}
                                                title={cardData.content.title}
                                                link={cardData.content.hyperlink}
                                                layout={layout!}
                                                communityId={currentCommunity1.id}
                                                id={cardData.content.id}
                                                note={cardData.content.note}
                                                cardType={cardData.content.type}
                                                posterName={cardData.content.user.userName}
                                                isOwner={cardData.isOwner}
                                                upVoteCount={cardData.upVotes}
                                                downVoteCount={cardData.downVotes}
                                                usersVote={cardData.usersVote}
                                                profilePic={cardData.content.user.profilePic}
                                            />
                                        ))
                                    }
                                </Fragment>

                            ))
                        }
                    </>)
                    }
                </div>}

        </div>
        <div className="mt-14">
            <ButtonEl 
                onClickHandler={currentCommunity1.id === -1 ? () => fetchNextPage() : () => fetchCommunityNextPage()} 
                disabled={currentCommunity1.id === -1 ? !hasNextPage : !communityNextPage} placeholder="Load more..." 
                particularStyle={`${hasNextPage ? " hover:scale-105 " : " border-slate-300 bg-slate-100  text-slate-400 "} `} 
                buttonType={"loadMore"} 
                
            />
        </div>
    </div>
}


export default MainBlock;