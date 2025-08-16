import { useEffect, useRef, useState } from "react";
import { BlockIcon, ChatbotEnter } from "../icons/commonIcons";
import { useChatHistory } from "../recoil/chatStates";
import { AnimatePresence, motion } from "framer-motion";
import { useUserProfile } from "../recoil/user";
import { ChatbotIcon } from "../icons/particularIcons";


export const ChatBot = () => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [chatHistory, setChatHistory] = useChatHistory();
    const [responding, setresponding] = useState<boolean>(false);
    useEffect(() => { inputRef?.current?.focus() }, [])

    const handleMessage = () => {
        const userMessage = inputRef.current?.value ?? "";
        if (inputRef.current) {
            inputRef.current.value = "";
        }

        if (userMessage?.trim() === "") {
            return;
        } else {
            setChatHistory((prev) => [...(prev ?? []), { sender: "user", text: userMessage }]);
            setChatHistory((prev) => [...(prev ?? []), { sender: "chatbot", text: "thatsa correct" }])
        }
    }

    useEffect(() => { console.log(chatHistory) }, [chatHistory])



    return <div className="bg-mainComponentBg z-10 w-[82%] h-screen scrollbarMC">
        <div className="h-full w-full">
            <div className="h-[75%] overflow-auto flex items-center justify-center scrollbarCB">
                <AnimatePresence mode="wait">
                    <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
                        <div className={`text-center cursor-default ${chatHistory === null ? " block " : " hidden "}`}>
                            <div className="text-[3.5rem] font-[1000] text-shadow-lg font-head text-primaryButtonBlue/95 ">Ask your secondbrain</div>
                            <div className="text-lg font-inter text-slate-700/80"> Get instant answers powered by your personal knowledge base.<br />
                                This chatbot uses your saved notes and documents to provide relevant, context-aware responses.</div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className={`${chatHistory === null ? " hidden " : " block "} w-[90%] `}>
                    {chatHistory?.map((message) => (<MessageBubble sender={message.sender} message={message.text}  />))}
                </div>

            </div>
            <div className="h-[25%]  w-full flex justify-center items-center ">
                <AnimatePresence mode="wait">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-[73%] z-50 h-[60%]  rounded-[3rem] flex gap-10 items-center pl-5 bg-white shadow-xl hover:shadow-3xl  mb-3 group-hover" transition={{ duration: 0.2, ease: "easeInOut" }}>
                        <textarea className="text-token-text-primary resize-none placegolder:ps-px scrollbar-hidden outline-none px-5 h-[60%] text-2xl font-[550] w-[85%]" placeholder="Whats on your mind..." ref={inputRef} />
                        <ChatbotEnter dim="20" style={`p-2 hover:bg-gray-100 size-19 cursor-pointer rounded-[3rem] transition-all duration-300 ${!responding ? " block " : " hidden "}`}
                            onClickHandler={handleMessage}
                        />
                        <BlockIcon style={`bg-gray-500/80 p-0 hover:bg-gray-300 size-19 cursor-default rounded-[3rem] transition-all duration-300 ${responding ? " block " : " hidden "}`} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

    </div>
}


const MessageBubble = ({sender, message} : {sender: "chatbot" | "user",message: string }) => {
    const [user, setUser] = useUserProfile()
    return <div className=" m-2 p-2">
        <div className={`h-full flex ${sender === "chatbot" ? " justify-start " : " justify-end "}`}>
            {sender === "chatbot" &&<div className="w-[5%] flex justify-center items-center"> <ChatbotIcon dim="40" style=" size-10" /> </div>}
            <div className={` w-[80%] ${ sender === "user" ? " bg-slate-100 " : " bg-slate-400 " }  rounded-lg p-5 ${ sender === "user" ?"text-slate-600" : "text-slate-100"} font-inter`}>
                {message}
            </div>
            {sender === "user" && <div className="w-[5%] flex justify-center items-center"> <img src={user?.profilePic} className="size-12  rounded-[5rem]" /> </div>}
        </div>
    </div>
}   