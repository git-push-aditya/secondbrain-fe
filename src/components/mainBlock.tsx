import { useState, useEffect, useMemo} from "react"; 
import type { cardProp, cardType } from "./card";
import { ButtonEl } from "./button"
import { CardElement } from "./card";
import { GridIcon, ListIcon, PlusIcon ,ShareIcon} from "../icons/commonIcons";   
import type { ChildProps } from "../pages/dashboard";
import { useTabAtom } from "../recoil/tab";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { GetListResponse } from "./modal";
import { useFetchQuery } from "../api/user/query";
import { useLimitAtom, usePageAtom } from "../recoil/pageLimit";


/* 
<div className="text-center font-head font-[500] p-4">
                 //NOTE: fixed placing to adjust placement of component irrerspective of other component and along with this using z value to maintain who stays on top of whom when times call for it 
                 //at initial fietch req with paginationlimitonl10 cards at a timee; you also get a complete list of all tags prev.used by user and at time of add content browser compares orignal list for old tags and new tags; db only stores tags for specific user(if its toomuch than make user id to tags as array and try n manage) 
                 //optimize / cache the twitter reddit so that is stays on unmount or something</div>
*/


const MainBlock = ({setModalNeededBy, setPopUpLive, layout,setLayout, user} : ChildProps) => {

    const [tab] = useTabAtom(); 
    const { data: listData, isSuccess: isListSuccess } = useQuery<AxiosResponse<GetListResponse>>({
        queryKey: ['getList']
    });

    const collectionList = useMemo(
        () => listData?.data?.payload?.collectionList || [],
        [listData]
    );

    useEffect(() => {
        if (!isListSuccess) return;
        
        if (tab.startsWith('dashboard')) {
            setCurrentCollection("Dashboard");
            setCurrentCollectionId(collectionList.find((coll) => coll.name === 'dashboard')?.id ?? -1);
        } else {
            const tabId = parseInt(tab.split('-')[1]);
            const matched = collectionList.find((coll) => coll.id === tabId);
            setCurrentCollection(matched?.name ?? "Dashboard");
            setCurrentCollectionId(tabId);
        }
    }, [tab, listData,isListSuccess]);

    const  [currentCollection, setCurrentCollection] = useState<string>('Dashboard');
    const  [currentCollectionId, setCurrentCollectionId] = useState<number>(-1);

    const [page,setPage] = usePageAtom();
    const [limit] = useLimitAtom();

    useEffect(()=>{
        setPage(1);
    },[currentCollectionId])

    const {refetch, data: cardData, isSuccess} = useFetchQuery({collectionId:currentCollectionId, page,limit});

    useEffect(()=>{
        refetch().then(({ data }) => {
            console.log(data); 
        });
    },[page,currentCollectionId])
    
    const layoutStyle = "hover:text-white hover:bg-[#6056AA]/60 text-black transition-hover duration-150 ease-in-out rounded-lg p-2  cursor-pointer bg-slate-300";
    
    return<div className="bg-mainComponentBg z-10 flex-1 pb-20 relative h-full overflow-y-auto scrollbarMC">
        
                
        <div className="flex justify-between bg-mainComponentBg border-b-2 border-slate-300 gap-4 p-6 left-0 top-0 sticky z-10 items-center">
            <div className="xl:text-5xl md:text-3xl text-xl  font-dashboardHeading font-extrabold cursor-default line-colaps-2 text-4xl font-bold text-gradient  ">Welcome, {user?.userName}</div>
            <div className="flex justify-around gap-6">
                <ButtonEl onClickHandler={() => setModalNeededBy("shareBrain")} placeholder="Share Brain" particularStyle=" h-14 " buttonType="secondary" startIcon={<ShareIcon style="size-8.5 " />}></ButtonEl>
                <ButtonEl onClickHandler={() => setModalNeededBy("addContent")} placeholder="Add Content" buttonType="primary" startIcon={<PlusIcon style="size-8.5 " />}></ButtonEl>
                
            </div>
        </div> 
        <div  className="flex justify-start items-center mt-4 ml-5">
            
            <div className="flex items-center justify-around ml-6 w-26 gap-2 rounded-lg "> 
                <GridIcon dim="50" onClickHandler={() => setLayout?.("grid")} style={layoutStyle + (layout === "grid" ? " border-2  hover:border-0" : "")}/>
                <ListIcon dim="50" onClickHandler={() => setLayout?.("list")} style={layoutStyle + (layout === "list" ? " border-2 hover:border-0" : "")}/>
            </div>
            <div className="w-[600px] text-clamp text-3xl font-[450] font-cardTitleHeading text-[#51488C] ml-4">Collection : {currentCollection}</div>
        </div>
        <div className=" mt-6  w-full flex justify-center ">

            <div className={` ${layout === "grid" ? " grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:gap-6  lg:gap-4 gap-2 gap-y-6 " : " w-full " }`}> 
                {
                    tab.startsWith('dashboard')  ? <>{ isSuccess && cardData?.payload?.content.map((element: { content: { title: string; type: string; hyperlink: string; note: string | undefined; tags: { title: string; id: number; }[] | undefined; createdAt: string | undefined; }; }) => {

                        return <CardElement title={element.content.title} cardType={element.content.type.toLowerCase() as cardType} link={element.content.hyperlink} note={element.content.note} tags={element.content.tags} createdAt={element.content.createdAt} layout={layout} shared={false} /> }) } </> : <div></div>
                
                }
            </div> 
        </div>
        <div><ButtonEl onClickHandler={() => setPage((page) => page +1) } placeholder="Load more..." buttonType={"loadMore"} /></div>
    </div>
}  



export default MainBlock;
