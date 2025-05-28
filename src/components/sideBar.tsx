import { useState } from "react";
import { Dasboard, DropdownIcon, DropUpIcon, PlusIcon } from "../icons/commonIcons";
import { CollectionIcon, ChatbotIcon, CommunityIcon, InstagramIcon, LogoIcon, RedditIcon, TwitterIcon, WebIcon, YoutubeIcon } from "../icons/particularIcons";
import { ButtonEl } from "./button";
import type { ChildProps } from "../pages/dashboard";

const headingStyle :string = "text-4xl font-[560]  font-head text-secondBrainHeading";

const CollectionList = ["Food Blogs", "Dev blogs","politics blogs"];
const communityList = ["Titans project","Titans project","Titans project","Titans project"]

const SideBar = ({setModalNeededBy} : ChildProps) => {

    const [collectionClicked,setCollectionClicked] = useState<boolean>(false);
    const [communityClicked,setcommunityClicked] = useState<boolean>(false);

    const clicked = () => {
        alert("clikced");
    }


    return <div className="w-[18%] border-r-2 border-slate-300 bg-sidebarBg h-[90.8%] overflow-y-scroll scrollbarSB relative z-10 scroll-smooth"> 
        <div className="flex justify-start gap-2 cursor-pointer items-center  px-2 pt-6 left-0 top-0 sticky z-10 bg-sidebarBg  ">
            <LogoIcon dim="40" />
            <div>
                <div className={headingStyle}>Second</div> 
                <div className={headingStyle}>Brain App</div>
            </div>
        </div>
        
        <ButtonEl onClickHandler={clicked} startIcon={ <ChatbotIcon dim='40' style="ml-2" />} particularStyle=" font-cardTitleHeading   mx-auto mt-5.5 pt-1 hover:bg-slate-300  h-15 text-3xl   w-full pl-4" buttonType="" placeholder="DeepDive"></ButtonEl> 
        
        <div >
            <div>
                <ButtonEl onClickHandler={clicked} startIcon={<Dasboard dim="35" style=" ml-2 " />} particularStyle=" h-8 gap-6" buttonType="sidebar" placeholder="Dashboard"/>
                <ButtonEl onClickHandler={clicked} startIcon={<YoutubeIcon dim="40" style=" m-0 " />} particularStyle=" h-8 gap-3" buttonType="sidebar" placeholder="YouTube"/>
                <ButtonEl onClickHandler={clicked} startIcon={<TwitterIcon  dim="35" />} particularStyle=" gap-7 h-10 " buttonType="sidebar" placeholder="X"/>
                <ButtonEl onClickHandler={clicked} startIcon={<RedditIcon dim="40" />} particularStyle=" text-2xl gap-5 h-10  " buttonType="sidebar" placeholder="Reddit"/>
                <ButtonEl onClickHandler={clicked} startIcon={<InstagramIcon dim="40" />} particularStyle=" text-2xl h-10 py-3 " buttonType="sidebar" placeholder="Instagram"/>
                <ButtonEl onClickHandler={clicked} startIcon={<WebIcon diml="55" dimb="40" />} particularStyle="  text-2xl h-10 " buttonType="sidebar" placeholder="Webpage"/>
            </div>  
            
                <div >
                    <ButtonEl onClickHandler={() => setCollectionClicked((prev) => !prev)}   particularStyle={` hover:bg-gray-200  ${collectionClicked ? "bg-gray-300 " : " "}`} buttonType="dropDown" placeholder="Collections " endIcon={!collectionClicked ?  <DropdownIcon dim="40"  /> : <DropUpIcon dim="40" /> }/> 
                        <div className={`transition-transform delay-[20ms]  duration-190 origin-top   ${collectionClicked ? 'scale-y-100' : 'scale-y-0'} transition-opacity ${collectionClicked ? " opacity-100 " : " opacity-0 " }  `}>
                        {
                            collectionClicked && (
                                <>
                                    <ButtonEl onClickHandler={() => setModalNeededBy("addCollection")} placeholder="Add Collection" particularStyle=" pl-7" buttonType="sidebar" startIcon={<PlusIcon dim={"40"} />} />
                                    {
                                        CollectionList.map((collection) => (<ButtonEl onClickHandler={clicked} placeholder={collection} particularStyle=" pl-7" buttonType="sidebar" startIcon={<CollectionIcon dim={"40"} />} />))
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
                              
                               { communityList.map((community) =>( <ButtonEl onClickHandler={clicked} placeholder={community} particularStyle=" pl-7" buttonType="sidebar" startIcon={<CommunityIcon dim={"40"} />} />))}
                            </>)
                        }
                        </div>
                </div>
            
        </div>
        <div className=" fixed left-right bottom-0 w-[18%] py-4 z-20 bg-sidebarBg  border-r-2 border-slate-300">
            <ButtonEl onClickHandler={() => setModalNeededBy("logout")}   particularStyle="  h-10 mx-auto " buttonType="primary" placeholder="User Profile"/>           
        </div>

    </div>
}

export default SideBar;