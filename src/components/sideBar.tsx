import { useEffect, useState } from "react";
import { Dasboard, DropdownIcon, DropUpIcon, PlusIcon, ShareIcon } from "../icons/commonIcons";
import { CollectionIcon, ChatbotIcon, CommunityIcon, InstagramIcon, LogoIcon, RedditIcon, TwitterIcon, WebIcon, YoutubeIcon } from "../icons/particularIcons";
import ButtonEl from "./button";
import { useLogOutQuery } from "../api/auth/mutate";
import { useNavigate } from "react-router-dom";
import { useSideBarAtom, useTabAtom } from "../recoil/clientStates";
import { useGetListQuery } from "../api/user/query";
import React from "react";
import type { AuthUser } from "../App";
import type { ModalType } from "../pages/dashboard";
import { user, useUserProfile } from "../recoil/user";

const headingStyle: string = " lg:text-[1.8rem] text-[1.7rem] 2xl:text-[1.9rem] font-[600]  font-head text-secondBrainHeading";

interface sideBarTypes {
    setModalNeededBy: React.Dispatch<React.SetStateAction<ModalType>>;
    setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}



const SideBar = ({ setModalNeededBy, setUser }: sideBarTypes) => {

    const navigate = useNavigate();
    const [logOutButton, setLogoutHidden] = useState<boolean>(false)

    const [collectionClicked, setCollectionClicked] = useState<boolean>(false);
    const [communityClicked, setcommunityClicked] = useState<boolean>(false);

    const [tab, setTab] = useTabAtom();

    const [user] = useUserProfile();

    const [sidebar, setSideBar] = useSideBarAtom();

    const { isSuccess: listSuccess, isError, data: lists, refetch: listFetch } = useGetListQuery();

    useEffect(() => {
        listFetch();
    }, [])

    const handleTabChnage = (tab: string) => {
        setTab(tab);
        if (sidebar && window.innerWidth <= 1024) {
            setSideBar(prev => !prev)
        }
    }


    const { mutateAsync } = useLogOutQuery();
    const handleAsyncLogout = async () => {
        try {
            await mutateAsync(undefined,
                {
                    onSuccess: () => {
                        setUser?.(null);
                    }
                }
            );
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (user === null) {
            setTab('dashboard');
            navigate('/');
        }
    }, [user])


    const logOutButtonStyle = "fixed -translate-y-13 text-2xl w-50 text-center ml-16 border-white font-roboto lg:hover:scale-105 hover:scale-90 md:hover:scale-96 transition-all duration-300 ease-in-out cursor-pointer bg-slate-300 rounded-3xl h-10 flex items-center justify-center border-3"



    return <div className="border-r-2 border-slate-300 bg-sidebarBg h-[90.9%] overflow-y-scroll overflow-x-hidden scrollbarSB relative z-10 scroll-smooth">
        <div className="flex justify-start gap-2 cursor-pointer items-center  px-2 left-0 top-0 sticky z-10 bg-sidebarBg">
            <LogoIcon dim="90" style="lg:scale-88 scale-85 2xl:scale-100" />
            <div>
                <div className={headingStyle}>Second</div>
                <div className={headingStyle}>Brain App</div>
            </div>
        </div>
        <div className="mt-2">
            {tab != "chatbot" && <> <ButtonEl onClickHandler={() => setModalNeededBy("addContent")}
                buttonType="optionalButton"
                placeholder="Add Content"
                particularStyle=" lg:hidden block  mb-0 bg-primaryButtonBlue/60 text-white hover:bg-primaryButtonBlue/40 font-[500] text-[1.4rem]"
                startIcon={<PlusIcon style="size-8.5 ml-2 mr-3 " />}
            />
                {
                    !tab.startsWith('community') ? <ButtonEl
                        onClickHandler={() => setModalNeededBy("shareBrain")}
                        particularStyle="  gap-0 lg:hidden font-bold block text-[1.4rem] bg-secondaryButtonBlue  mt-0"
                        buttonType="optionalButton"
                        placeholder="Share Brain"
                        startIcon={<ShareIcon style="size-7 ml-3 mr-4 my-0" />}
                    /> : null
                }</>}

        </div>

        <ButtonEl
            onClickHandler={() => handleTabChnage('chatbot')}
            startIcon={<ChatbotIcon dim='40' style="ml-2 lg:scale-100 scale-95" />}
            particularStyle=" font-cardTitleHeading mx-auto mt-2 lg:mt-5.5 pt-1 hover:bg-slate-300  h-15 lg:text-3xl text-[1.50rem]  w-full pl-4 gap-5 lg:gap-4"
            buttonType=""
            placeholder="DeepDive">
        </ButtonEl>

        <div >
            <div>
                <ButtonEl
                    onClickHandler={() => handleTabChnage('dashboard')}
                    startIcon={<Dasboard dim="35" style=" mx-2 " />}
                    particularStyle="  h-8 gap-3"
                    buttonType="sidebar"
                    placeholder="Dashboard"
                />


                <ButtonEl
                    onClickHandler={() => handleTabChnage('dashboard-YOUTUBE')}
                    startIcon={<YoutubeIcon dim="40" style=" mx-2 " />}
                    particularStyle="  h-8 gap-3"
                    buttonType="sidebar"
                    placeholder="YouTube"
                />
                <ButtonEl
                    onClickHandler={() => handleTabChnage('dashboard-TWITTER')}
                    startIcon={<TwitterIcon dim="35" />}
                    particularStyle="  gap-7 pl-6 h-10 "
                    buttonType="sidebar"
                    placeholder="X"
                />
                <ButtonEl
                    onClickHandler={() => handleTabChnage('dashboard-REDDIT')}
                    startIcon={<RedditIcon dim="40" />}
                    particularStyle=" text-2xl gap-5 pl-6 h-10  "
                    buttonType="sidebar"
                    placeholder="Reddit"
                />
                <ButtonEl
                    onClickHandler={() => handleTabChnage('dashboard-INSTAGRAM')}
                    startIcon={<InstagramIcon dim="40" />}
                    particularStyle=" pl-6 text-2xl h-10 py-3 "
                    buttonType="sidebar"
                    placeholder="Instagram"
                />
                <ButtonEl
                    onClickHandler={() => handleTabChnage('dashboard-WEB')}
                    startIcon={<WebIcon diml="40" dimb="40" />}
                    particularStyle="  pl-7 text-2xl h-10 "
                    buttonType="sidebar"
                    placeholder="Webpage"
                />
            </div>

            <div >
                <ButtonEl
                    onClickHandler={() => setCollectionClicked((prev) => !prev)}
                    particularStyle={` hover:bg-gray-200  ${collectionClicked ? "bg-gray-300 " : " "} font-medium `} 
                    buttonType="dropDown"
                    placeholder="Collections "
                    endIcon={!collectionClicked ? <DropdownIcon dim="40" /> : <DropUpIcon dim="40" />}
                />
                <div
                    className={`transition-transform delay-[20ms]  duration-190 origin-top   ${collectionClicked ? 'scale-y-100' : 'scale-y-0'} transition-opacity ${collectionClicked ? " opacity-100 " : " opacity-0 "}  `}>
                    {
                        collectionClicked && (
                            <>
                                <ButtonEl
                                    onClickHandler={() => setModalNeededBy("addCollection")} placeholder="Add Collection"
                                    particularStyle=" pl-7"
                                    buttonType="sidebar"
                                    startIcon={<PlusIcon dim={"40"} />}
                                />
                                {
                                    listSuccess &&
                                    Array.isArray(lists?.data?.payload?.collectionList) &&
                                    lists.data.payload.collectionList
                                        .filter(
                                            (collection: { id: number; name: string }) =>
                                                collection.name !== "dashboard"
                                        )
                                        .map((collection: { id: number; name: string }) => (
                                            <ButtonEl
                                                onClickHandler={() => handleTabChnage("collection-" + collection.id.toString())
                                                }
                                                placeholder={collection.name}
                                                particularStyle=" pl-7 truncate "
                                                buttonType="sidebar"
                                                startIcon={<CollectionIcon dim={"40"} />}
                                            />
                                        ))
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
                                    listSuccess && Array.isArray(lists?.data?.payload?.allCommunities) && lists.data.payload.allCommunities.map((collection: { id: number, name: string }) => (<ButtonEl onClickHandler={() => handleTabChnage("community-" + collection.id.toString())} placeholder={collection.name} particularStyle=" pl-7 truncate " buttonType="sidebar" startIcon={<CommunityIcon dim={"40"} />} />))
                                }
                            </>)
                    }
                </div>
            </div>

        </div>
        <div className="fixed bottom-0 h-[9.3%] 2xl:w-[18%] xl:w-[20%] w-[290px] z-20 bg-sidebarBg  border-r-2 border-slate-300 " >
            <div
                className={` ${logOutButtonStyle} xl:scale-96 2xl:scale:scale-100 lg:scale:94 md:scale-92 scale-85 flex justify-center lg:-translate-x-4 md:-translate-x-6 -translate-x-6  ${logOutButton ? " block" : " hidden"} font-[520]`}
                onClick={() => handleAsyncLogout()}
            >
                log out
            </div>

            <div
                onClick={() => setLogoutHidden((prev) => !prev)}
                className="flex p-2 rounded-[2.5rem] justify-center cursor-pointer mx-6 mr-9 items-center hover:bg-slate-300 transition-hover duration-300  max-h-[90%] gap-4 lg:gap-2"
                title={user?.userName}
            >
                <img src={user?.profilePic}
                    className="rounded-[4rem] xl:size-14 size-12"
                />
                <div
                    className=" xl:text-3xl  text-[1.6rem] lg:font-[600]  font-[700] font-cardTitleHeading truncate mr-2   w-full text-center " >
                    {user?.userName}
                </div>
            </div>
        </div>

    </div>
}

export default React.memo(SideBar)