import { useEffect, useRef } from "react";
import { BlockIcon, ChatbotEnter, ChatLoader } from "../icons/commonIcons";
import { useChatHistory } from "../recoil/chatStates";
import { AnimatePresence, motion } from "framer-motion";
import { useUserProfile } from "../recoil/user";
import { ChatbotIcon } from "../icons/particularIcons";
import { useChatBot } from "../api/user/mutate";


export const ChatBot = () => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [chatHistory, setChatHistory] = useChatHistory();
    useEffect(() => { inputRef?.current?.focus() }, []);

    const { mutateAsync, isPending } = useChatBot();



    const handleMessage = async () => {
        const userMessage = inputRef.current?.value ?? "";
        if (inputRef.current) inputRef.current.value = "";

        if (userMessage.trim() === "") return;

        setChatHistory((prev) => [...(prev ?? []), { sender: "user", text: userMessage }]);

        try {
            const data = await mutateAsync({ userQuery: userMessage });
            setChatHistory((prev) => [...(prev ?? []), { sender: "chatbot", text: data.payload.message }]);
        } catch (err) {
            console.error(err);
        }
    };





    return <div className="bg-mainComponentBg z-10 w-[82%] h-screen scrollbarMC ">
        <div className="h-full w-full">
            <div className={`h-[80%] overflow-auto flex justify-center ${chatHistory !== null ? "items-start  " : " items-center"} py-10 scrollbarCB`}>
                <AnimatePresence mode="wait">
                    <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
                        <div className={`text-center cursor-default ${chatHistory === null ? " block " : " hidden "}`}>
                            <div className="text-[3.5rem] font-[1000] text-shadow-lg font-head text-primaryButtonBlue/95 ">Ask your secondbrain</div>
                            <div className="text-lg font-inter text-slate-700/80"> Get instant answers powered by your personal knowledge base.<br />
                                This chatbot uses your saved notes and documents to provide relevant, context-aware responses.</div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className={`${chatHistory === null ? " hidden " : " block "} xl:w-[73%] w-[90%]`}>
                    <AnimatePresence mode="wait">
                        {chatHistory?.map((message) => (<MessageBubble sender={message.sender} message={message.text} responding={false} />))}
                        {isPending && <MessageBubble responding={true} sender={"chatbot"} message={""} />}
                    </AnimatePresence>
                </div>

            </div>
            <div className="h-[20%]  w-full flex justify-center items-center ">
                <AnimatePresence mode="wait">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="xl:w-[73%] w-[85%] z-50 h-[70%]  rounded-[3rem] flex gap-10 items-center pl-5 bg-white shadow-xl hover:shadow-3xl  mb-3 group-hover" transition={{ duration: 0.2, ease: "easeInOut" }}>
                        <textarea   
                            onKeyDown={(e) => {
                                if(e.key === "Enter" && !e.shiftKey){
                                    e.preventDefault();
                                    handleMessage();
                                }
                            }}
                            className="text-token-text-primary resize-none placegolder:ps-px scrollbar-hidden outline-none px-5 h-[60%] text-2xl font-[550] w-[85%]" placeholder="Whats on your mind..." 
                            ref={inputRef} />
                        <ChatbotEnter 
                            dim="20" 
                            style={`p-2 hover:bg-gray-100 size-19 cursor-pointer rounded-[3rem] transition-all duration-300 ${!isPending ? " block " : " hidden "}`}
                            onClickHandler={handleMessage} />
                        <BlockIcon 
                            style={`bg-gray-500/90 -p-1 hover:bg-gray-600/90 size-19 cursor-default rounded-[3rem] transition-all duration-300 
                            ${isPending ? " block " : " hidden "}`} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

    </div>
}


const MessageBubble = ({ sender, message, responding }: { sender: "chatbot" | "user", message: string, responding: boolean }) => {
    const [user, setUser] = useUserProfile()
    return <div className="mt-2 cursor-default">
        <div className={`h-full flex ${sender === "chatbot" ? " justify-start " : " justify-end "} gap-2`}>
            {sender === "chatbot" && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-[5%] flex justify-center items-center"> <ChatbotIcon dim="40" style=" xl:size-12 md:size-10 size-8" /> </motion.div>}
            <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }} className={`${sender === "chatbot" ? " xl:w-[80%] lg:w-[85%] w-[95%]" : " xl:max-w-[80%] lg:max-w-[85%] max-w-[95%]"} xl:text-xl text-lg  ${sender === "user" ? " bg-slate-100 " : " "}  rounded-3xl p-5 text-slate-600 font-inter`}>
                {message}{sender === "chatbot" && responding && <ChatLoader dim="70" />}
            </motion.div>
            {sender === "user" && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-[5%] flex justify-center items-center"> <img src={user?.profilePic} className="xl:size-12 md:size-10 size-8 rounded-[5rem]" /> </motion.div>}
        </div>
    </div>
}   