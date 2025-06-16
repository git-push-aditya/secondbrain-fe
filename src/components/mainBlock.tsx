import { useState, useEffect, Fragment } from "react"; 
import { ButtonEl } from "./button"
import { CardElement } from "./card";
import { GridIcon, ListIcon, PlusIcon, ShareIcon } from "../icons/commonIcons";
import type { ChildProps } from "../pages/dashboard";
import { useCardCountAtom, useTabAtom } from "../recoil/clientStates"; 
import { useFetchQuery, useGetListQuery } from "../api/user/query";
import { useDeleteID } from "../recoil/deleteId";
import { useDeletecardQuery } from "../api/user/mutate";


const MainBlock = ({ setModalNeededBy, layout, setLayout, user }: ChildProps) => {



    const [tab] = useTabAtom();
    const { data: listData, isFetched, isSuccess: isListSuccess } = useGetListQuery()

    let collectionList: { name: string, id: number }[];
    if (isFetched) {
        collectionList = listData?.data?.payload.collectionList;
    }

    const [currentCollection, setCurrentCollection] = useState<string>('dashboard');
    const [currentCollectionId, setCurrentCollectionId] = useState<number>(-1);
    const [cardsCount, setCardCount] = useCardCountAtom();

    useEffect(() => {
        if (!isListSuccess) return;

        if (tab.startsWith('dashboard')) {
            setCurrentCollection("dashboard");
            setCurrentCollectionId(collectionList.find((coll) => coll.name === 'dashboard')?.id ?? -1);
        } else {
            const tabId = parseInt(tab.split('-')[1]);
            const matched = collectionList.find((coll) => coll.id === tabId);
            setCurrentCollection(matched?.name ?? "dashboard");
            setCurrentCollectionId(tabId);
        }
    }, [tab, listData, isListSuccess]);


    const { data: pagesData, isLoading: contentLoading, hasNextPage, fetchNextPage } = useFetchQuery({ collectionId: currentCollectionId });

    const [deleteId] = useDeleteID();
    const { mutate, isSuccess: deletedCard } = useDeletecardQuery();
    useEffect(() => {
        mutate({ contentId: deleteId, collectionId: currentCollectionId });
    }, [deleteId])


    useEffect(() => {
        if (!contentLoading) {
            const totalCards = pagesData?.pages
                ?.map((page) => page.group?.payload?.content?.length ?? 0)
                .reduce((a, b) => a + b, 0);

            setCardCount(totalCards);
        }
    }, [pagesData, contentLoading])




    const layoutStyle = "hover:text-white hover:bg-[#6056AA]/60 text-black transition-hover duration-150 ease-in-out rounded-lg p-2  cursor-pointer bg-slate-300";

    return <div className="bg-mainComponentBg z-10 flex-1 pb-20 relative h-full overflow-y-auto scrollbarMC">


        <div className="flex justify-between bg-mainComponentBg border-b-2 border-slate-300 gap-4 p-6 left-0 top-0 sticky z-10 items-center">
            <div className="xl:text-5xl md:text-3xl text-xl  font-dashboardHeading font-extrabold cursor-default line-colaps-2 text-4xl font-bold text-gradient  py-2 ">Welcome, {user?.userName}</div>
            <div className="flex justify-around gap-6">
                <ButtonEl onClickHandler={() => setModalNeededBy("shareBrain")} placeholder="Share Brain" particularStyle=" h-14 " buttonType="secondary" startIcon={<ShareIcon style="size-8.5 " />}></ButtonEl>
                <ButtonEl onClickHandler={() => setModalNeededBy("addContent")} placeholder="Add Content" buttonType="primary" startIcon={<PlusIcon style="size-8.5 " />}></ButtonEl>

            </div>
        </div>
        <div className="flex justify-start items-center mt-4 ml-5">

            <div className="flex items-center justify-around ml-6 w-26 gap-2 rounded-lg ">
                <GridIcon dim="50" onClickHandler={() => setLayout?.("grid")} style={layoutStyle + (layout === "grid" ? " border-2  hover:border-0" : "")} />
                <ListIcon dim="50" onClickHandler={() => setLayout?.("list")} style={layoutStyle + (layout === "list" ? " border-2 hover:border-0" : "")} />
            </div>
            <div className="w-[600px] text-clamp text-3xl font-[450] font-cardTitleHeading text-[#51488C] ml-4">Collection : {currentCollection}</div>
        </div>
        <div className=" mt-6  w-full flex justify-center ">

            <div className={` ${layout === "grid" ? " grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:gap-6  lg:gap-4 gap-2 gap-y-6 " : " w-full "}`}>
                {    
                    pagesData?.pages.map((group, i) => (
                        <Fragment key={i}>
                            {
                                group.payload.content.map((cardData: any, idx: number) =>
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
                    ))

                }
            </div>
        </div>
        <div className="mt-14"><ButtonEl onClickHandler={() => fetchNextPage()} disabled={!hasNextPage} placeholder="Load more..." particularStyle={`${hasNextPage ? " hover:scale-105 " : " border-slate-300 bg-slate-100 text-slate-400 "} `} buttonType={"loadMore"} /></div>
    </div>
}



export default MainBlock;
