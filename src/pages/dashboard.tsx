import { useEffect, useState } from "react";
import MainBlock  from "../components/mainBlock";
import SideBar from "../components/sideBar"; 
import Modal from "../components/modal";
import { AnimatePresence } from "framer-motion"; 
import type { AuthUser } from "../App";
import { ChatBot } from "../components/Chatbot"; 
import { useTabAtom } from "../recoil/clientStates";

export type ModalType = "addContent" | "shareBrain" | "logout" | "addCollection"| "addCommunity"|"joinCommunity" |"close";
 

export interface ChildProps {
  setModalNeededBy: React.Dispatch<React.SetStateAction<ModalType>>;
  setPopUpLive ?: React.Dispatch<React.SetStateAction<Boolean>>;
  popUpLive ?: Boolean;
  layout?: "grid" | "list";
  setLayout?:React.Dispatch<React.SetStateAction<"grid" | "list">>;
  user: AuthUser | null;
  setUser ?: React.Dispatch<React.SetStateAction<AuthUser | null>>; 
}


const Dashboard = ({ user, setUser, layout,setLayout}:{user : AuthUser | null,   layout: "grid" | "list",setLayout: React.Dispatch<React.SetStateAction<"grid" | "list">>, setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>}) => {
 
    const [modalNeeded, setModalNeededBy] = useState<ModalType >("close"); 
 
 
    useEffect(()=>{setLayout('grid')},[])
    const closeModal = () => setModalNeededBy("close");

    const [tab] = useTabAtom();




    return<>
        <div className="flex h-screen w-screen">
            <AnimatePresence mode="wait">
                {modalNeeded !== "close" && <Modal cause={modalNeeded} closeModal={closeModal}  />}
            </AnimatePresence>
            <SideBar setModalNeededBy={setModalNeededBy}  setUser={setUser} />
            {tab === 'chatbot' ? <ChatBot /> : <MainBlock setModalNeededBy={setModalNeededBy} user={user} layout= {layout} setLayout={setLayout}    />}
            
            
        </div> 
    </>
}

export default Dashboard;
 