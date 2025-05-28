import { CopyIcon, CrossIcon } from "../icons/commonIcons"; 
import { ButtonEl } from "./button"; 
import {motion, AnimatePresence} from "framer-motion";
import Dropdown from "./dropdown";
import { useRef, useState } from "react";

interface props{
    cause : "addContent" | "shareBrain" | "logout" |"addCollection"| "addCommunity"|"joinCommunity" |"close";
    closeModal : () => void;
    collectionName ?: string;
}

interface cardComponent{
    closeCard : () => void;
    cause ?: "addContent" | "shareBrain" | "logout" |"addCollection"| "addCommunity"|"joinCommunity" |"close";
}

const clicked = () => {
    alert("clicked");
}


const Modal = ({cause,closeModal} : props) => {
    return<AnimatePresence><motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{ duration: 0.3 ,ease:'circIn'}} className="h-screen w-screen  backdrop-blur-xs bg-[rgba(0,0,0,0.5)] fixed z-20 top-0 left-0 flex justify-center items-center" >
        {cause == "addContent" && <AddContent closeCard ={closeModal} />}
        {cause == "shareBrain" && <ShareBrain cause={cause} closeCard ={closeModal} />}
        {cause == "logout" && <Logout closeCard ={closeModal} />}
        {cause == "addCommunity" && <AddCommunity closeCard ={closeModal} />}
        {cause == "addCollection" && <AddCollection closeCard ={closeModal} />}
        {cause == "joinCommunity" && <JoinCommunity closeCard ={closeModal} />}
    </motion.div></AnimatePresence>
}

const linkType = ["Web","Youtube","X","Reddit","Instagram","blank"];
const collectionList = ["Dashboard","Food Blogs", "Dev Blogs","politic Blogs","blank"];

const AddContent = ({closeCard} : cardComponent ) => {
    const [selectedLink,setSelectedLink] =  useState<string>("blank");
    const [selectedCollection,setSelectedCollection] =  useState<string>("blank");

    return <motion.div initial={{y:8,scale:0.99 }} animate={{y:0,scale:1}} exit={{opacity:0}} transition={{ duration: 0.3  }}className={`h-[70%] md:h-[68%] xl:h-[58%] w-[70%] xl:w-[50%] md:w-[60%]  rounded-3xl bg-modalCard  cursor-default overflow-y-hidden scrollbarSB `} >
            <div className="flex justify-between mx-8 nd:mx-10 xl:mx-12 mt-10"> 
                <div className="font-[650]  text-4xl text-modalHead font-inter ">Save a New Link</div>
                <ButtonEl buttonType=""   onClickHandler={closeCard} startIcon={<CrossIcon dim="40" style="text-gray" />} />
            </div> 
            <div className="mt-3 text-center text-xl mx-12  font-[450] text-gray-500">
                Paste a link you want to save or share with your Second Brain.
            </div> 
            <div className="text-center mt-2">
                <input type="text" placeholder="Paste link here" className="w-[90%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-xl font-cardTitleHeading border-2 border-gray-500 rounded-md hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-600 focus:outline-none"  /> 
                <input type="text" placeholder="Enter title" className="w-[90%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-xl font-cardTitleHeading border-2 border-gray-500 rounded-md hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-600 focus:outline-none"  /> 
                
                <textarea placeholder="Note..." className="w-[90%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-xl font-cardTitleHeading border-2 border-gray-500 rounded-md hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-600 focus:outline-none"  /> 

                <Dropdown list={linkType} selected={selectedLink} title="Link type" setState={setSelectedLink}/>

                <Dropdown list={collectionList} selected={selectedCollection} title="Collection" setState={setSelectedCollection}/>

                <ButtonEl buttonType="primary" onClickHandler={clicked} particularStyle="w-[80%] xl:w-[46%]  font-inter mt-6 h-16 mx-auto font-[550] font-inter " placeholder="Add Link" />


            </div>
        </motion.div> 
}

const ShareBrain = ({closeCard} : cardComponent ) => { 

  return <motion.div initial={{y:8,scale:0.99}} animate={{y:0,scale:1}} transition={{ duration: 0.2  }}className={`h-[65%] md:h-[57%] xl:h-[42%] w-[70%] xl:w-[40%] md:w-[50%]  rounded-3xl bg-modalCard  cursor-default overflow-y-hidden scrollbarSB `} >
            <div className="flex justify-between mx-8 md:mx-10 xl:mx-12 mt-10"> 
                <div className="font-[650]  text-3xl text-modalHead font-inter ">Share your Second Brain</div>
                <ButtonEl buttonType=""   onClickHandler={closeCard} startIcon={<CrossIcon dim="40" style="text-gray" />} />
            </div>
            <div className="  mt-6 xl:mt-7 md:mt-6  xl:text-2xl  text-xl mx-12  font-[450] text-gray-500">
                Share your entire collection of posts, blogs, tweets, and videos with others. They'll be able to import your content into their own Second Brain.
            </div>
            <div className="mt-3 xl:text-xl md:text-md mx-12 text-center font-[400] text-gray-600">
                You can stop sharing your Second Brain at any time.
            </div>
            <ButtonEl buttonType="primary" onClickHandler={clicked} particularStyle="w-[80%] xl:w-[88%] gap-5 font-inter mt-6 h-16 mx-auto font-[550] font-inter " placeholder="Share Brain" startIcon={<CopyIcon dim="40" style="color-white" />} />
        </motion.div>  
}
const Logout = ({closeCard} : cardComponent ) => {

    return <div className="h-[50%] w-[60%] bg-modalCard py-4">
            <button onClick={() => closeCard() }>closeModal</button>
            <h1 className="text-center">Logout</h1>
        </div> 
}


const AddCollection = ({closeCard} : cardComponent ) => {

    return <motion.div initial={{y:8,scale:0.99}} animate={{y:0,scale:1}} transition={{ duration: 0.3  }}className={`h-[65%] md:h-[57%] xl:h-[48%] w-[70%] xl:w-[38%] md:w-[50%]  rounded-3xl bg-modalCard  cursor-default overflow-y-hidden scrollbarSB `} >
            <div className="flex justify-between mx-8 nd:mx-10 xl:mx-12 mt-8"> 
                <div className="font-[650]  text-3xl text-modalHead font-inter ">Start a new collection</div>
                <ButtonEl buttonType=""   onClickHandler={closeCard} startIcon={<CrossIcon dim="40" style="text-gray" />} />
            </div>
            <div className="  mt-6 text-lg mx-12  font-[450] text-gray-500">
                Organize related links under one collection. Perfect for keeping your research or ideas grouped together.
            </div>
            <div className="text-center mt-3">
                <input type="text" placeholder="Name your collection" className="w-[90%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-xl font-cardTitleHeading border-2 border-gray-500 rounded-xl hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-700 focus:outline-none"  /> 
                <textarea placeholder="Some light description.." className="w-[90%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-xl font-cardTitleHeading scrollbarSB border-2 border-gray-500 rounded-xl hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-700 focus:outline-none"  />                 
            </div>
            <ButtonEl buttonType="primary" onClickHandler={clicked} particularStyle="w-[90%]  font-inter mt-2 h-12 mx-auto text-2xl font-[550] font-inter " placeholder="Create new collection" />
        </motion.div>  
}


//add community == starting a new community
const AddCommunity = ({closeCard} : cardComponent ) => {
    const messageRef = useRef(null);
    const postRef = useRef(null);

    const checkboxStyle = "flex items-center mt-2 pl-16 text-2xl font-cardTitleHeading font-[400] text-slate-700 "
    const inputStyle = "w-[85%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-2xl font-cardTitleHeading border-2 border-gray-500 rounded-xl hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-700 focus:outline-none";

    return <motion.div initial={{y:8,scale:0.99}} animate={{y:0,scale:1}} transition={{ duration: 0.2  }}className={`h-[65%] md:h-[57%] xl:h-[58%] w-[70%] xl:w-[45%] md:w-[50%]  rounded-3xl bg-modalCard  cursor-default overflopointerw-y-hidden scrollbarSB `} >
            <div className="flex justify-between mx-8 nd:mx-10 xl:mx-16 mt-8"> 
                <div className="font-[650]  text-3xl text-modalHead font-inter ">Start your Community!!</div>
                <ButtonEl buttonType=""   onClickHandler={closeCard} startIcon={<CrossIcon dim="40" style="text-gray" />} />
            </div>
            <div className="mt-5 text-center text-xl mx-12  font-[450] text-gray-500">
                Passionate about something? Build a space where others can explore it with you.
            </div> 
            <div className="text-center mt-1">
                <input type="text" placeholder="Name your community" className={inputStyle + ""}  /> 
                <textarea placeholder="Describe you community.." className={inputStyle}  />  
            </div>
            <div className={checkboxStyle}>
                    <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="size-6 mr-4 cursor-pointer" ref={postRef}></input>Allow member post
                    </label>
            </div>
            <div className={checkboxStyle}>
                    <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="size-6 mr-4 cursor-pointer" ref={messageRef}></input>Allow community chat
                    </label>cursor-pointer
            </div>
            
            <ButtonEl buttonType="primary" onClickHandler={clicked} particularStyle="w-[85%] gap-5 font-inter mt-6 h-16 mx-auto font-[550] font-inter " placeholder="Start your Community"  />
        </motion.div>  
}


const JoinCommunity = ({closeCard} : cardComponent ) => { 
    const inputStyle = "w-[85%] mt-4 cursor-pointer py-1 pl-4 md:py-2 text-2xl font-cardTitleHeading border-2 border-gray-500 rounded-xl hover:border-[#7569B3] focus:border-[#6056AA] focus:shadow-sm transition-focus delay-50 duration-150 text-gray-600 focus:outline-none";
  return <motion.div initial={{y:8,scale:0.99}} animate={{y:0,scale:1}} transition={{ duration: 0.2  }}className={`h-[65%] md:h-[57%] xl:h-[48%] w-[70%] xl:w-[40%] md:w-[50%]  rounded-3xl bg-modalCard  cursor-default overflow-y-hidden scrollbarSB `} >
            <div className="flex justify-between mx-8 nd:mx-10 xl:mx-15 mt-8"> 
                <div className="font-[650]  text-3xl text-modalHead font-inter ">Join a Community!!</div>
                <ButtonEl buttonType=""   onClickHandler={closeCard} startIcon={<CrossIcon dim="40" style="text-gray" />} />
            </div>
            <div className="mt-5 text-center text-xl mx-12  font-[450] text-gray-500">
                Discover and share the best content with like-minded people.
            </div> 
            <div className="text-center mt-3">
                <input type="text" placeholder="Paste community link" className={inputStyle + " h-14"}  /> 
                <input type="password" placeholder="Enter code" className={inputStyle}  /> 
            </div>
            <ButtonEl buttonType="primary" onClickHandler={clicked} particularStyle="w-[85%] gap-5 font-inter mt-6 h-16 mx-auto font-[550] font-inter " placeholder="Join Community"  />
        </motion.div>  
}
















export default Modal;

