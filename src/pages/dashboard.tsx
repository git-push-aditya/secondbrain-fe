import { useEffect, useState } from "react";
import MainBlock from "../components/mainBlock";
import SideBar from "../components/sideBar";
import Modal from "../components/modal";
import { AnimatePresence, motion } from "framer-motion";
import type { AuthUser } from "../App";
import { ChatBot } from "../components/Chatbot";
import { useSideBarAtom, useTabAtom } from "../recoil/clientStates";
import { CloseSideBar, OpenSideBar } from "../icons/commonIcons";

export type ModalType = "addContent" | "shareBrain" | "logout" | "addCollection" | "addCommunity" | "joinCommunity" | "close";


export interface ChildProps {
    setModalNeededBy: React.Dispatch<React.SetStateAction<ModalType>>;
    setPopUpLive?: React.Dispatch<React.SetStateAction<Boolean>>;
    popUpLive?: Boolean;
    layout?: "grid" | "list";
    setLayout?: React.Dispatch<React.SetStateAction<"grid" | "list">>;
    user: AuthUser | null;
    setUser?: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}


const Dashboard = ({ user, setUser, layout, setLayout }: { user: AuthUser | null, layout: "grid" | "list", setLayout: React.Dispatch<React.SetStateAction<"grid" | "list">>, setUser: React.Dispatch<React.SetStateAction<AuthUser | null>> }) => {

    const [modalNeeded, setModalNeededBy] = useState<ModalType>("close");

    const [sidebar, setSideBar] = useSideBarAtom();

    useEffect(() => {
        const handleResize = () => {
            const isLarge = window.innerWidth >= 1024;

            setSideBar(prev => {
                if ((isLarge && prev) || (!isLarge && !prev)) {
                    return prev;
                }
                return isLarge;
            });
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setSideBar]);


    const toggleSideBar = () => setSideBar(prev => !prev)

    useEffect(() => { setLayout('grid') }, [])
    const closeModal = () => setModalNeededBy("close");

    const [tab] = useTabAtom();

    return <>
        <div className="flex h-screen w-screen overflow-hidden">
            <AnimatePresence mode="wait">
                {modalNeeded !== "close" && <Modal cause={modalNeeded} closeModal={closeModal} />}
            </AnimatePresence>

            <AnimatePresence>
                {sidebar && (<motion.div
                    key={"SideBar"}
                    initial={{ x: -60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 900, damping: 30 }}
                    className="2xl:w-[18%] xl:w-[20%] w-[290px] h-[100%] bg-sidebarBg absolute lg:static z-100">
                    <SideBar setModalNeededBy={setModalNeededBy} setUser={setUser} />
                </motion.div>)}
            </AnimatePresence>

            <AnimatePresence>
                {!sidebar ? <OpenSideBar
                    dim="40"
                    style="hover:bg-slate-100 translate-y-6 rounded-md m-2 cursor-pointer transition-hover duration-200 absolute z-100 block lg:hidden"
                    onClickHandler={toggleSideBar}
                /> : <motion.div
                        key={"SideBar"}
                        initial={{ x: 0, opacity: 0 }}
                        animate={{ x: 285, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 900, damping: 30 }}
                        className="z-200 translate-y-6 "
                    ><CloseSideBar
                            dim="40"
                            style="hover:bg-slate-100 rounded-md bg-mainComponentBg m-2 cursor-pointer transition-hover duration-200 absolute z-200 block lg:hidden"
                            onClickHandler={toggleSideBar}
                        />
                    </motion.div>
                }
            </AnimatePresence>




            {tab === 'chatbot' ? <ChatBot /> : <MainBlock setModalNeededBy={setModalNeededBy} user={user} layout={layout} setLayout={setLayout} />}
        </div>
    </>
}

export default Dashboard;
