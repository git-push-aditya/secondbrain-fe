import { useEffect, useState } from "react";
import { Dasboard, DropdownIcon, DropUpIcon, PlusIcon } from "../icons/commonIcons";
import { CollectionIcon, ChatbotIcon, CommunityIcon, InstagramIcon, LogoIcon, RedditIcon, TwitterIcon, WebIcon, YoutubeIcon } from "../icons/particularIcons";
import { ButtonEl } from "./button";
import type { ChildProps } from "../pages/dashboard";
import { useLogOutQuery } from "../api/auth/mutate";
import { useNavigate } from "react-router-dom";
import { useTabAtom } from "../recoil/tab";
import { useGetListQuery } from "../api/user/query";

const headingStyle :string = "text-4xl font-[600]  font-head text-secondBrainHeading";


const SideBar = ({setModalNeededBy,setUser} : ChildProps) => {

    const navigate= useNavigate();



    const [collectionClicked,setCollectionClicked] = useState<boolean>(false);
    const [communityClicked,setcommunityClicked] = useState<boolean>(false);

    const [tab, setTab] = useTabAtom();

    useEffect(()=>{console.log(tab)},[tab]);

    const {isSuccess : listSuccess, isError,data:lists, refetch : listFetch} = useGetListQuery();

    useEffect(() => {
        listFetch();
    },[])
 

    const { mutateAsync } = useLogOutQuery();
    const handleAsyncLogout = async () => {
        try{
            await mutateAsync();
            setUser?.(null);
            navigate('/');
        }catch(e){
            console.error(e)
        }
    } 

    const clicked = () => {
        alert("clikced");
    }


    return <div className="w-[18%] border-r-2 border-slate-300 bg-sidebarBg h-[90.9%] overflow-y-scroll overflow-x-hidden scrollbarSB relative z-10 scroll-smooth"> 
        <div className="flex justify-start gap-2 cursor-pointer items-center  px-2 left-0 top-0 sticky z-10 bg-sidebarBg">
            <LogoIcon dim="90" />
            <div>
                <div className={headingStyle}>Second</div> 
                <div className={headingStyle}>Brain App</div>
            </div>
        </div>
        
        <ButtonEl onClickHandler={() => setTab('chatbot')} startIcon={ <ChatbotIcon dim='40' style="ml-2" />} particularStyle=" font-cardTitleHeading   mx-auto mt-5.5 pt-1 hover:bg-slate-300  h-15 text-3xl   w-full pl-4" buttonType="" placeholder="DeepDive"></ButtonEl> 
        
        <div >
            <div>
                <ButtonEl onClickHandler={() => setTab('dashboard')} startIcon={<Dasboard dim="35" style=" ml-2 " />} particularStyle="  h-8 gap-6" buttonType="sidebar" placeholder="Dashboard"/>
                <ButtonEl onClickHandler={() => setTab('dashboard-youtube')} startIcon={<YoutubeIcon dim="40" style=" mx-2 " />} particularStyle="  h-8 gap-3" buttonType="sidebar" placeholder="YouTube"/>
                <ButtonEl onClickHandler={() => setTab('dashboard-twitter')} startIcon={<TwitterIcon  dim="35" />} particularStyle="  gap-7 pl-6 h-10 " buttonType="sidebar" placeholder="X"/>
                <ButtonEl onClickHandler={() => setTab('dashboard-reddit')} startIcon={<RedditIcon dim="40" />} particularStyle=" text-2xl gap-5 pl-6 h-10  " buttonType="sidebar" placeholder="Reddit"/>
                <ButtonEl onClickHandler={() => setTab('dashboard-instagram')} startIcon={<InstagramIcon dim="40" />} particularStyle=" pl-6 text-2xl h-10 py-3 " buttonType="sidebar" placeholder="Instagram"/>
                <ButtonEl onClickHandler={() => setTab('dashboard-web')} startIcon={<WebIcon diml="40" dimb="40" />} particularStyle="  pl-7 text-2xl h-10 " buttonType="sidebar" placeholder="Webpage"/>
            </div>  
            
                <div >
                    <ButtonEl onClickHandler={() => setCollectionClicked((prev) => !prev)}   particularStyle={` hover:bg-gray-200  ${collectionClicked ? "bg-gray-300 " : " "}`} buttonType="dropDown" placeholder="Collections " endIcon={!collectionClicked ?  <DropdownIcon dim="40"  /> : <DropUpIcon dim="40" /> }/> 
                        <div className={`transition-transform delay-[20ms]  duration-190 origin-top   ${collectionClicked ? 'scale-y-100' : 'scale-y-0'} transition-opacity ${collectionClicked ? " opacity-100 " : " opacity-0 " }  `}>
                        {
                            collectionClicked && (
                                <>
                                    <ButtonEl onClickHandler={() => setModalNeededBy("addCollection")} placeholder="Add Collection" particularStyle=" pl-7" buttonType="sidebar" startIcon={<PlusIcon dim={"40"} />} />
                                    {   
                                        listSuccess && Array.isArray(lists?.data?.payload?.collectionList) &&     lists.data.payload.collectionList.filter((collection: {id :number, name : string} ) => collection.name !== 'dashboard').map((collection: {id :number, name : string} ) => (<ButtonEl onClickHandler={() => setTab("collection-" + collection.id.toString())} placeholder={collection.name} particularStyle=" pl-7 truncate " buttonType="sidebar" startIcon={<CollectionIcon dim={"40"} />} />))
                                    }
                                </>
                            )
                        }
                </div>
                </div>
                <div >
                    <ButtonEl onClickHandler={ () => setcommunityClicked((prev) => !prev)}   particularStyle={` hover:bg-gray-200  ${communityClicked ? "bg-gray-300 " : " "}`} buttonType="dropDown" placeholder="community " endIcon={!communityClicked ?  <DropdownIcon dim="40"  /> : <DropUpIcon dim="40" /> }/> 
                        <div className={`transition-transform origin-top delay-30 duration-150 transform ${communityClicked ? "scale-y-100" : "scale-y-0"}`}>
                        {
                            communityClicked && (
                            <>
                            <ButtonEl onClickHandler={() => setModalNeededBy("addCommunity")} placeholder="start a Community" particularStyle=" pl-7" buttonType="sidebar" startIcon={<PlusIcon dim={"40"} />} />
                            <ButtonEl onClickHandler={() => setModalNeededBy("joinCommunity")} placeholder="join a Community" particularStyle=" pl-7" buttonType="sidebar" startIcon={<PlusIcon dim={"40"} />} />
                              
                               {/* { communityList.map((community) =>( <ButtonEl onClickHandler={clicked} placeholder={community} particularStyle=" pl-7" buttonType="sidebar" startIcon={<CommunityIcon dim={"40"} />} />))} */}
                            </>)
                        }
                        </div>
                </div>
            
        </div>
        <div className=" fixed left-right bottom-0 w-[18%] py-4 z-20 bg-sidebarBg  border-r-2 border-slate-300 ">
            <ButtonEl onClickHandler={() => handleAsyncLogout()}   particularStyle="  h-10 mx-auto " buttonType="primary" placeholder="User Profile"/>           
        </div>

    </div>
}

export default SideBar;