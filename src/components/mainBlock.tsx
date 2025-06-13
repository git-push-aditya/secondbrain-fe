import { useState, useEffect} from "react"; 
import type { cardProp } from "./card";
import { ButtonEl } from "./button"
import { CardElement } from "./card";
import { GridIcon, ListIcon, PlusIcon ,ShareIcon} from "../icons/commonIcons";   
import type { ChildProps } from "../pages/dashboard";
import { useTabAtom } from "../recoil/tab";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { GetListResponse } from "./modal";


/* 
<div className="text-center font-head font-[500] p-4">
                 //NOTE: fixed placing to adjust placement of component irrerspective of other component and along with this using z value to maintain who stays on top of whom when times call for it 
                 //at initial fietch req with paginationlimitonl10 cards at a timee; you also get a complete list of all tags prev.used by user and at time of add content browser compares orignal list for old tags and new tags; db only stores tags for specific user(if its toomuch than make user id to tags as array and try n manage) 
                 //optimize / cache the twitter reddit so that is stays on unmount or something</div>
*/


const MainBlock = ({setModalNeededBy, setPopUpLive, layout,setLayout, user} : ChildProps) => {

    const [tab] = useTabAtom();
    const queryClient = useQueryClient();
    const listData = queryClient.getQueryData<AxiosResponse<GetListResponse>>(['getList']);
    const collectionList = listData?.data?.payload?.collectionList || [];
    
    const  [currentCollection, setCurrentCollection] = useState<string | undefined>('Dashboard');

    useEffect(() => {
        if(tab.startsWith('dashboard')){
            setCurrentCollection("Dashboard");
        }else{
            //@ts-ignore
            setCurrentCollection(collectionList?.find((coll) => coll.id === parseInt(tab.split('-')[1])).name ?? "Dashboard");
        }///fo this for community as well 
    },[tab,setCurrentCollection])
    
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
                    tab.startsWith('dashboard')  
                }
            </div> 
        </div>
    </div>
}  



export default MainBlock;
