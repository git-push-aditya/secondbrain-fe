import { useEffect, useState } from "react";
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
}


const Dashboard = () => {
    const [modalNeeded, setModalNeededBy] = useState<ModalType >("close");
    const [popUpLive, setPopUpLive] = useState<Boolean>(false);
    const closeModal = () => setModalNeededBy("close");

    useEffect(() => {
        if(popUpLive){
            const counter = setTimeout(() => {setPopUpLive(false); console.log("tik")}, 3000);
            return () => clearInterval(counter);
        }
    }, [popUpLive])

    return<>
        <div className="flex h-screen w-screen">
            {modalNeeded !== "close" && <AnimatePresence><Modal cause={modalNeeded} closeModal={closeModal}  /></AnimatePresence>}
            {popUpLive && <AnimatePresence><PopUp placeholder="Link coppied to clipboard!!" /></AnimatePresence>} 
            <SideBar setModalNeededBy={setModalNeededBy} />
            
            <MainBlock setModalNeededBy={setModalNeededBy} popUpLive={popUpLive} setPopUpLive={setPopUpLive} />
        </div> 
    </>
}

export default Dashboard;