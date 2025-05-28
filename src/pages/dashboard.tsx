import { useState } from "react";
import MainBlock  from "../components/mainBlock";
import SideBar from "../components/sideBar"; 
import Modal from "../components/modal";
import { AnimatePresence } from "framer-motion";

type ModalType = "addContent" | "shareBrain" | "logout" | "addCollection"| "addCommunity"|"joinCommunity" |"close";

export interface ChildProps {
  setModalNeededBy: React.Dispatch<React.SetStateAction<ModalType>>;
}


const Dashboard = () => {
    const [modalNeeded, setModalNeededBy] = useState<ModalType >("close");
    const closeModal = () => setModalNeededBy("close");


    return<>
        <div className="flex h-screen w-screen">
            {modalNeeded !== "close" && <AnimatePresence><Modal cause={modalNeeded} closeModal={closeModal}  /></AnimatePresence>} 
            <SideBar setModalNeededBy={setModalNeededBy} />
            
            <MainBlock setModalNeededBy={setModalNeededBy} />
        </div> 
    </>
}

export default Dashboard;