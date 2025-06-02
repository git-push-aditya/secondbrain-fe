import { useState } from "react";
import MainBlock  from "../components/mainBlock";
import SideBar from "../components/sideBar"; 
import Modal from "../components/modal";
import { AnimatePresence } from "framer-motion";
import { PopUp } from "../components/popUp";

type ModalType = "addContent" | "shareBrain" | "logout" | "addCollection"| "addCommunity"|"joinCommunity" |"close";

export interface ChildProps {
  setModalNeededBy: React.Dispatch<React.SetStateAction<ModalType>>;
  setPopUpLive ?: React.Dispatch<React.SetStateAction<Boolean>>;
  popUpLive ?: Boolean;
  layout?: "grid" | "list";
  setLayout?:React.Dispatch<React.SetStateAction<"grid" | "list">>;
}


const Dashboard = ({popUpLive, setPopUpLive,layout,setLayout}:{popUpLive:Boolean,setPopUpLive:React.Dispatch<React.SetStateAction<Boolean>>,layout: "grid" | "list",setLayout: React.Dispatch<React.SetStateAction<"grid" | "list">>}) => {
    const [modalNeeded, setModalNeededBy] = useState<ModalType >("close");

    
    const closeModal = () => setModalNeededBy("close");



    return<>
        <div className="flex h-screen w-screen">
            <AnimatePresence>
                {modalNeeded !== "close" && <Modal cause={modalNeeded} closeModal={closeModal}  />}
                {popUpLive && <PopUp placeholder="Link coppied to clipboard!!" />} 
            </AnimatePresence>
            <SideBar setModalNeededBy={setModalNeededBy} />
            
            <MainBlock setModalNeededBy={setModalNeededBy} layout= {layout} setLayout={setLayout} popUpLive={popUpLive} setPopUpLive={setPopUpLive} />
        </div> 
    </>
}

export default Dashboard;