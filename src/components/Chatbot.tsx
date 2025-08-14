import { useEffect, useRef, useState } from "react";
import { ChatbotEnter } from "../icons/commonIcons";
import { useChatHistory } from "../recoil/chatStates";
import { AnimatePresence, motion } from "framer-motion";


export const ChatBot = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useChatHistory()
    useEffect(() => { inputRef?.current?.focus() }, [])


    return <div className="bg-mainComponentBg z-10 w-[82%] h-screen scrollbarMC">
        <div className="h-full w-full">
            <div className="h-[75%] overflow-auto flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, x: 0, opacity: 1 }}      exit={{ x: -10, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
                        <div className={`text-center cursor-default ${messages === null ? " block " : " hidden "}`}>
                            <div className="text-[3.5rem] font-[1000] text-shadow-lg font-head text-primaryButtonBlue/95 ">Ask your secondbrain</div>
                            <div className="text-lg font-inter text-slate-700/80"> Get instant answers powered by your personal knowledge base.<br/>
                            This chatbot uses your saved notes and documents to provide relevant, context-aware responses.</div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="h-[25%]  w-full flex justify-center items-center ">
                <AnimatePresence mode="wait">
                    <motion.div initial={{ opacity: 0 }} animate={{opacity: 1 }}      exit={{  opacity: 0 }} className="w-[73%] z-50 h-[60%]  rounded-[3rem] flex gap-10 items-center pl-5 bg-white shadow-xl hover:shadow-3xl  mb-3 group-hover" transition={{ duration: 0.2, ease: "easeInOut" }}>
           
                    <textarea  className="text-token-text-primary resize-none placegolder:ps-px scrollbar-hidden outline-none px-5 h-[60%] text-2xl font-[550] w-[85%]" data-virtualKeyboard="true" placeholder="Whats on your mind..." />
                    <ChatbotEnter dim="20" style={`p-2 hover:bg-gray-100 size-19 cursor-pointer rounded-[3rem] transition-all duration-300`} />
                
                </motion.div>
                </AnimatePresence>
            </div>
        </div>

    </div>
}
