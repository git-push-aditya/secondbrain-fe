import { useEffect, useState } from "react";
import { Dasboard, DropdownIcon, DropUpIcon, PlusIcon } from "../icons/commonIcons";
import { CollectionIcon, ChatbotIcon, CommunityIcon, InstagramIcon, LogoIcon, RedditIcon, TwitterIcon, WebIcon, YoutubeIcon } from "../icons/particularIcons";
import { ButtonEl } from "./button";
import { useLogOutQuery } from "../api/auth/mutate";
import { useNavigate } from "react-router-dom";
import { useTabAtom } from "../recoil/clientStates";
import { useGetListQuery } from "../api/user/query"; 
import React from "react";
import type { AuthUser } from "../App";
import type { ModalType } from "../pages/dashboard";
import { user, useUserProfile } from "../recoil/user";

const headingStyle: string = "text-4xl font-[600]  font-head text-secondBrainHeading";

interface sideBarTypes {
    setModalNeededBy : React.Dispatch<React.SetStateAction<ModalType>>;
    setUser : React.Dispatch<React.SetStateAction<AuthUser | null>>;
}



const SideBar = ({ setModalNeededBy, setUser }: sideBarTypes) => {

    const navigate = useNavigate(); 
    const [logOutButton, setLogoutHidden] = useState<boolean>(false)

    const [collectionClicked, setCollectionClicked] = useState<boolean>(false);
    const [communityClicked, setcommunityClicked] = useState<boolean>(false);

    const [tab, setTab] = useTabAtom();

    const [user,setUserInsidebar] = useUserProfile();

    const { isSuccess: listSuccess, isError, data: lists, refetch: listFetch } = useGetListQuery();

    useEffect(() => {
        listFetch();
    }, [])


    const { mutateAsync } = useLogOutQuery();
    const handleAsyncLogout = async () => {
        try {
            await mutateAsync(undefined,
                {
                    onSuccess : () => {
                        setUser?.(null); 
                    }
                }
            );            
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(()=>{
        if(user === null){
            setTab('dashboard');
            navigate('/');
        }
    },[user])
 

    return <div className="w-[18%] border-r-2 border-slate-300 bg-sidebarBg h-[90.9%] overflow-y-scroll overflow-x-hidden scrollbarSB relative z-10 scroll-smooth">
        <div className="flex justify-start gap-2 cursor-pointer items-center  px-2 left-0 top-0 sticky z-10 bg-sidebarBg">
            <LogoIcon dim="90" />
            <div>
                <div className={headingStyle}>Second</div>
                <div className={headingStyle}>Brain App</div>
            </div>
        </div>

        <ButtonEl onClickHandler={() => setTab('chatbot')} startIcon={<ChatbotIcon dim='40' style="ml-2" />} particularStyle=" font-cardTitleHeading   mx-auto mt-5.5 pt-1 hover:bg-slate-300  h-15 text-3xl   w-full pl-4" buttonType="" placeholder="DeepDive"></ButtonEl>

        <div >
            <div>
                <ButtonEl onClickHandler={() => setTab('dashboard')} startIcon={<Dasboard dim="35" style=" ml-2 " />} particularStyle="  h-8 gap-6" buttonType="sidebar" placeholder="Dashboard" />
                <ButtonEl onClickHandler={() => setTab('dashboard-YOUTUBE')} startIcon={<YoutubeIcon dim="40" style=" mx-2 " />} particularStyle="  h-8 gap-3" buttonType="sidebar" placeholder="YouTube" />
                <ButtonEl onClickHandler={() => setTab('dashboard-TWITTER')} startIcon={<TwitterIcon dim="35" />} particularStyle="  gap-7 pl-6 h-10 " buttonType="sidebar" placeholder="X" />
                <ButtonEl onClickHandler={() => setTab('dashboard-REDDIT')} startIcon={<RedditIcon dim="40" />} particularStyle=" text-2xl gap-5 pl-6 h-10  " buttonType="sidebar" placeholder="Reddit" />
                <ButtonEl onClickHandler={() => setTab('dashboard-INSTAGRAM')} startIcon={<InstagramIcon dim="40" />} particularStyle=" pl-6 text-2xl h-10 py-3 " buttonType="sidebar" placeholder="Instagram" />
                <ButtonEl onClickHandler={() => setTab('dashboard-WEB')} startIcon={<WebIcon diml="40" dimb="40" />} particularStyle="  pl-7 text-2xl h-10 " buttonType="sidebar" placeholder="Webpage" />
            </div>

            <div >
                <ButtonEl onClickHandler={() => setCollectionClicked((prev) => !prev)} particularStyle={` hover:bg-gray-200  ${collectionClicked ? "bg-gray-300 " : " "}`} buttonType="dropDown" placeholder="Collections " endIcon={!collectionClicked ? <DropdownIcon dim="40" /> : <DropUpIcon dim="40" />} />
                <div className={`transition-transform delay-[20ms]  duration-190 origin-top   ${collectionClicked ? 'scale-y-100' : 'scale-y-0'} transition-opacity ${collectionClicked ? " opacity-100 " : " opacity-0 "}  `}>
                    {
                        collectionClicked && (
                            <>
                                <ButtonEl onClickHandler={() => setModalNeededBy("addCollection")} placeholder="Add Collection" particularStyle=" pl-7" buttonType="sidebar" startIcon={<PlusIcon dim={"40"} />} />
                                {
                                    listSuccess && Array.isArray(lists?.data?.payload?.collectionList) && lists.data.payload.collectionList.filter((collection: { id: number, name: string }) => collection.name !== 'dashboard').map((collection: { id: number, name: string }) => (<ButtonEl onClickHandler={() => setTab("collection-" + collection.id.toString())} placeholder={collection.name} particularStyle=" pl-7 truncate " buttonType="sidebar" startIcon={<CollectionIcon dim={"40"} />} />))
                                }
                            </>
                        )
                    }
                </div>
            </div>
            <div className="mb-4">
                <ButtonEl onClickHandler={() => setcommunityClicked((prev) => !prev)} particularStyle={` hover:bg-gray-200  ${communityClicked ? "bg-gray-300 " : " "}`} buttonType="dropDown" placeholder="community " endIcon={!communityClicked ? <DropdownIcon dim="40" /> : <DropUpIcon dim="40" />} />
                <div className={`transition-transform origin-top delay-30 duration-150 transform ${communityClicked ? "scale-y-100" : "scale-y-0"}`}>
                    {
                        communityClicked && (
                            <>
                                <ButtonEl onClickHandler={() => setModalNeededBy("addCommunity")} placeholder="start a Community" particularStyle=" pl-7" buttonType="sidebar" startIcon={<PlusIcon dim={"40"} />} />
                                <ButtonEl onClickHandler={() => setModalNeededBy("joinCommunity")} placeholder="join a Community" particularStyle=" pl-7" buttonType="sidebar" startIcon={<PlusIcon dim={"40"} />} />

                                {
                                    listSuccess && Array.isArray(lists?.data?.payload?.allCommunities) && lists.data.payload.allCommunities.map((collection: { id: number, name: string }) => (<ButtonEl onClickHandler={() => setTab("community-" + collection.id.toString())} placeholder={collection.name} particularStyle=" pl-7 truncate " buttonType="sidebar" startIcon={<CommunityIcon dim={"40"} />} />))
                                }
                            </>)
                    }
                </div>
            </div>

        </div>
        <div className="fixed bottom-0 h-[9.3%] w-[18%] z-20 bg-sidebarBg  border-r-2 border-slate-300 "> 
            <div className={`fixed -translate-y-13 text-2xl w-50 text-center ml-16 border-white font-roboto hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer bg-slate-300 rounded-3xl h-10 flex items-center justify-center border-3 ${logOutButton ? " block" : " hidden"} font-[520]`} onClick={() => handleAsyncLogout()}>log out </div>
            <div onClick={() => setLogoutHidden((prev) => !prev)} className="flex p-2 rounded-[2.5rem] justify-between cursor-pointer mx-6 mr-9 items-center hover:bg-slate-300 transition-hover duration-300  max-h-[90%]">
                <img src={user?.profilePic} className="rounded-[4rem] size-15 " />
                <div className="text-3xl font-[600] font-cardTitleHeading truncate mr-2   w-full text-center" > 
                    {user?.userName}
                </div>
            </div>
        </div>

    </div>
}

export default React.memo(SideBar)