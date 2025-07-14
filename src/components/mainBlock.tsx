import { useState, useEffect, Fragment } from "react";
import { ButtonEl } from "./button"
import { CardElement } from "./card";
import { DeleteIcon, GridIcon, ListIcon, Loader, PlusIcon, ShareIcon } from "../icons/commonIcons";
import type { ChildProps } from "../pages/dashboard";
import { useCardCountAtom, useCurrentCollection, useCurrentCommunity, usePopUpAtom, usePopUpMessage, useTabAtom } from "../recoil/clientStates";
import { useFetchQueryCollection, useFetchQueryCommunity, useGetListQuery } from "../api/user/query";
import { useDeletecardQuery, useDeleteCollectionQuery, useRemoveShareQuery, useShareCommunityLogin } from "../api/user/mutate";
import { useDeleteID } from "../recoil/deleteId";
import { CommunityCard } from "./communityCard";


const MainBlock = ({ setModalNeededBy, layout, setLayout, user }: ChildProps) => {


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
    }, [tab, listData, isListSuccess]);

    const [deleteId] = useDeleteID();
    const { mutate} = useDeletecardQuery();
    useEffect(() => {
        if (deleteId !== -1) {
            mutate({ contentId: deleteId, collectionId: currentCollection1.id });
        }
    }, [deleteId])

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
    }, [pagesData, contentLoading]);
    

    const { mutateAsync: shareLogin, isPending: shareLoginPending, error: shareError} = useShareCommunityLogin();
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
        }
    }

    const layoutStyle = "hover:text-white hover:bg-[#6056AA]/60 text-black transition-hover duration-150 ease-in-out rounded-lg p-2  cursor-pointer bg-slate-300";

    return <div className="bg-mainComponentBg z-10 flex-1 pb-20 relative h-full overflow-y-auto scrollbarMC">


        <div className="flex justify-between bg-mainComponentBg border-b-2 border-slate-300 gap-4 p-6 left-0 top-0 sticky z-10 items-center">
            <div className="xl:text-5xl md:text-3xl text-xl  font-dashboardHeading font-extrabold cursor-default line-colaps-2 text-4xl font-bold text-gradient  py-2 ">Welcome, {user?.userName}</div>
            <div className="flex justify-around gap-6">
                <ButtonEl onClickHandler={() => setModalNeededBy("shareBrain")} placeholder="Share Brain" particularStyle=" h-14 " buttonType="secondary" startIcon={<ShareIcon style="size-8.5 " />}></ButtonEl>
                <ButtonEl onClickHandler={() => setModalNeededBy("addContent")} placeholder="Add Content" buttonType="primary" startIcon={<PlusIcon style="size-8.5 " />}></ButtonEl>
            </div>
        </div>
        <div className="flex justify-between items-center mt-4 ml-7">
            <div className="flex items-center justify-around">
                <div className="flex items-center justify-around ml-6 w-26 gap-2 rounded-lg ">
                    <GridIcon dim="50" onClickHandler={() => setLayout?.("grid")} style={layoutStyle + (layout === "grid" ? " border-2  hover:border-0" : "")} />
                    <ListIcon dim="50" onClickHandler={() => setLayout?.("list")} style={layoutStyle + (layout === "list" ? " border-2 hover:border-0" : "")} />
                </div>
                <div className="w-[600px] text-clamp text-3xl font-[450] font-cardTitleHeading text-[#51488C] ml-4"> {tab.startsWith("community") ? <>{`Community : ${currentCommunity1.name}`} </> : <>{`Collection :  ${currentCollection1.name}`} </>} </div>
            </div>
            <div className="flex items-center justify-around">
                <div className="flex items-center justify-around mr-6 gap-2 rounded-lg">
                    {
                        !tab.startsWith("community") ? (
                            <>
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
                                        onClickHandler={handleRemoveShare}
                                        buttonType="rightTopbar"
                                        particularStyle={`bg-red-300 hover:bg-red-400 ${removingShare ? " bg-red-400" : ""}`}
                                        startIcon={!removingShare ? <DeleteIcon style="size-6 m-0 p-0" /> : null}
                                        placeholder={!removingShare ? "Stop Sharing" : ""}
                                        endIcon={removingShare ? <Loader style="block size-14 text-white" dimh="10" dimw="20" /> : null}
                                    />
                                }
                            </>
                        ) : (
                            <ButtonEl placeholder="Share Login" onClickHandler={() => handleShareCommunityCred()} disabled={shareLoginPending} buttonType={"rightTopbar"} particularStyle={`bg-green-300 hover:bg-green-400 ${removingShare ? " bg-red-400" : ""} ${shareLoginPending ? "animate-pulse cursor-not-allowed" : ""} `} />
                        )
                    }
                </div>

            </div>
        </div>
        <div className=" mt-6  w-full flex justify-center ">

            <div className={` ${layout === "grid" ? " grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:gap-6  lg:gap-4 gap-2 gap-y-6 " : " w-full "}`}>
                {currentCollection1.id !== -1 ?
                    <>
                        {pagesData?.pages.map((group, i) => (
                            <Fragment key={i}>
                                {
                                    group.payload.content.map((cardData: any ) =>
                                        tab.split('-')[0] === 'collection' || !tab.split('-')[1] ? (
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
                                        ) : (
                                            tab.split('-')[1] === cardData.content.type && <CardElement
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
                                        )
                                    )
                                }
                            </Fragment>
                        ))}

                    </> : (<>
                        

                        {
                            communityPagesData?.pages.map((group,i) => (
                                <Fragment key={i}>
                                    {
                                        group.payload.content.map((cardData :any) => (
                                            
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
                                            />
                                        ))
                                    }
                                </Fragment>
                            ))
                        }
                        <CommunityCard createdAt={""} title={"wassup"} link={"https://youtu.be/JoJ8Sw5Yb4c?si=MrQspFY59ubK0l3f"} layout={layout!} communityId={1} id={20} note={"we are going through shit and we will overcome this by fighting tooth and nail"} cardType={"YOUTUBE"} posterName={"abhi"} isOwner={true} upVoteCount={10} ></CommunityCard>
                        <CommunityCard createdAt={""} title={"wassup"} link={"https://x.com/AdityaDtwt/status/1929479477618229264"} layout={layout!} communityId={1} id={20} note={"we are going through shit and we will overcome this by fighting tooth and nail"} cardType={"TWITTER"} posterName={"abhi"} isOwner={false} upVoteCount={120} ></CommunityCard></>
                    )
                }
            </div>
        </div>
        <div className="mt-14"><ButtonEl onClickHandler={currentCommunity1.id === -1 ? () => fetchNextPage() : ()=>fetchCommunityNextPage()} disabled={currentCommunity1.id === -1 ? !hasNextPage: !communityNextPage} placeholder="Load more..." particularStyle={`${hasNextPage ? " hover:scale-105 " : " border-slate-300 bg-slate-100 text-slate-400 "} `} buttonType={"loadMore"} /></div>
    </div>
}



export default MainBlock;