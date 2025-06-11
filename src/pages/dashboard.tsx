import { useEffect, useState } from "react";
import MainBlock  from "../components/mainBlock";
import SideBar from "../components/sideBar"; 
import Modal from "../components/modal";
import { AnimatePresence } from "framer-motion";
import { PopUp } from "../components/popUp";
import type { AuthUser } from "../App";
import { ChatBot } from "../components/Chatbot";

type ModalType = "addContent" | "shareBrain" | "logout" | "addCollection"| "addCommunity"|"joinCommunity" |"close";

export interface ChildProps {
  setModalNeededBy: React.Dispatch<React.SetStateAction<ModalType>>;
  setPopUpLive ?: React.Dispatch<React.SetStateAction<Boolean>>;
  popUpLive ?: Boolean;
  layout?: "grid" | "list";
  setLayout?:React.Dispatch<React.SetStateAction<"grid" | "list">>;
  user: AuthUser | null;
}


const Dashboard = ({popUpLive,user, setPopUpLive,layout,setLayout}:{user : AuthUser | null, popUpLive:Boolean,setPopUpLive:React.Dispatch<React.SetStateAction<Boolean>>,layout: "grid" | "list",setLayout: React.Dispatch<React.SetStateAction<"grid" | "list">>}) => {
    const [modalNeeded, setModalNeededBy] = useState<ModalType >("close");

    useEffect(()=>{setLayout('grid')},[])
    const closeModal = () => setModalNeededBy("close");



    return<>
        <div className="flex h-screen w-screen">
            <AnimatePresence mode="wait">
                {modalNeeded !== "close" && <Modal cause={modalNeeded} closeModal={closeModal}  />}
            </AnimatePresence>
            <SideBar setModalNeededBy={setModalNeededBy} user={null} />
            <MainBlock setModalNeededBy={setModalNeededBy} user={user} layout= {layout} setLayout={setLayout} popUpLive={popUpLive} setPopUpLive={setPopUpLive} />
            
        </div> 
    </>
}

export default Dashboard;

/**
 *             <ChatBot />
 */