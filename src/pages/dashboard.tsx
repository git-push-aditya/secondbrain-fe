import { useEffect, useState } from "react";
import MainBlock  from "../components/mainBlock";
import SideBar from "../components/sideBar"; 
import Modal from "../components/modal";
import { AnimatePresence } from "framer-motion"; 
import type { AuthUser } from "../App";
import { ChatBot } from "../components/Chatbot";
import { useQueryClient } from '@tanstack/react-query';
import { useTabAtom } from "../recoil/tab";

type ModalType = "addContent" | "shareBrain" | "logout" | "addCollection"| "addCommunity"|"joinCommunity" |"close";

// const queryClient = useQueryClient();

export interface ChildProps {
  setModalNeededBy: React.Dispatch<React.SetStateAction<ModalType>>;
  setPopUpLive ?: React.Dispatch<React.SetStateAction<Boolean>>;
  popUpLive ?: Boolean;
  layout?: "grid" | "list";
  setLayout?:React.Dispatch<React.SetStateAction<"grid" | "list">>;
  user: AuthUser | null;
  setUser ?: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  collectionList: {id : number, title: string}[];
  setCollectionList : React.Dispatch<React.SetStateAction<{id: number;title: string;}[]>>
}


const Dashboard = ({popUpLive,user, setUser,setPopUpLive,layout,setLayout}:{user : AuthUser | null, popUpLive:Boolean,setPopUpLive:React.Dispatch<React.SetStateAction<Boolean>>,layout: "grid" | "list",setLayout: React.Dispatch<React.SetStateAction<"grid" | "list">>, setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>}) => {

    const [modalNeeded, setModalNeededBy] = useState<ModalType >("close");
    const [collectionList, setCollectionList] = useState<{id : number, title: string}[]>([]);
///have to look into this as to how to use tanstack query chache w/o data duplicacy
 
    useEffect(()=>{setLayout('grid')},[])
    const closeModal = () => setModalNeededBy("close");

    const [tab] = useTabAtom();



    return<>
        <div className="flex h-screen w-screen">
            <AnimatePresence mode="wait">
                {modalNeeded !== "close" && <Modal cause={modalNeeded} closeModal={closeModal}  />}
            </AnimatePresence>
            <SideBar setModalNeededBy={setModalNeededBy} collectionList={collectionList} setCollectionList={setCollectionList} user={user} setUser={setUser} />
            {tab === 'chatbot' ? <ChatBot /> : <MainBlock setModalNeededBy={setModalNeededBy} user={user} layout= {layout} setLayout={setLayout} popUpLive={popUpLive} collectionList={collectionList} setCollectionList={setCollectionList} setPopUpLive={setPopUpLive} />}
            
            
        </div> 
    </>
}

export default Dashboard;
 