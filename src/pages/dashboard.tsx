import { useEffect, useState } from "react";
import MainBlock  from "../components/mainBlock";
import SideBar from "../components/sideBar"; 
import Modal from "../components/modal";
import { AnimatePresence } from "framer-motion";
import { PopUp } from "../components/popUp";
import { instagramScriptLoader, loadTwitterScript, redditScriptLoader } from "../scriptLoader";

type ModalType = "addContent" | "shareBrain" | "logout" | "addCollection"| "addCommunity"|"joinCommunity" |"close";

export interface ChildProps {
  setModalNeededBy: React.Dispatch<React.SetStateAction<ModalType>>;
  setPopUpLive ?: React.Dispatch<React.SetStateAction<Boolean>>;
  popUpLive ?: Boolean;
  layout?: "grid" | "list";
  setLayout?:React.Dispatch<React.SetStateAction<"grid" | "list">>;
}


const Dashboard = () => {
    const [modalNeeded, setModalNeededBy] = useState<ModalType >("close");
    const [popUpLive, setPopUpLive] = useState<Boolean>(false);
    const closeModal = () => setModalNeededBy("close");

    const [layout,setLayout] = useState<"grid" | "list" >("grid");

    useEffect(()=>{
        loadTwitterScript().then(() =>{
            window.twttr.widgets.load();
        })

        redditScriptLoader();

        instagramScriptLoader();
    },[])

    useEffect(() =>{
        window.twttr?.widgets?.load();
        window.instgrm?.Embeds?.process();
    },[layout])


    useEffect(() => {
        if(popUpLive){
            const counter = setTimeout(() => {setPopUpLive(false); console.log("tik")}, 3000);
            return () => clearInterval(counter);
        }
    }, [popUpLive])

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