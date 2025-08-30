import { useEffect, useRef, useState, type ReactNode } from "react";
import { BlockIcon, BottomArrow, ChatbotEnter, ChatLoader } from "../icons/commonIcons";
import { useChatHistory } from "../recoil/chatStates";
import { AnimatePresence, motion } from "framer-motion";
import { useChatBot } from "../api/user/mutate";
import type { message } from "../recoil/chatStates";
import MessageBubble from "./messageBubble";

const ttl = 2 * 24 * 60 * 60 * 1000;         //ttl for chat of 2 days

export interface cardContent {
    title: string;
    hyperlink: string;
    note: string | null;
    id: number;
    type: string;
    createdAt: string;
    tags: {
        tag: {
            title: string;
            id: number;
        };
    }[];
}


export const ChatBot = () => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [chatHistory, setChatHistory] = useChatHistory();
    useEffect(() => { inputRef?.current?.focus() }, []);
    const recentChat = useRef<HTMLDivElement | null>(null); 

    const [buttonVisible, setButtonVisible] = useState<Boolean>(true);
    const { mutateAsync, isPending } = useChatBot();


    useEffect(() => {
        recentChat.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => setButtonVisible(!entry.isIntersecting));
            },
            { threshold: 0.1 }
        );

        if (recentChat.current) {
            observer.observe(recentChat.current);
        }

        return () => {
            if (recentChat.current) observer.unobserve(recentChat.current);
        };
    }, []);

    //In dev enviornment for desingin purposes i am deactivation this storing chat to two days

    // useEffect(() => {
    //     const rawPastChats = localStorage.getItem("pastChats");
    //     if (!rawPastChats) {
    //         setChatHistory(null);  
    //         return;
    //     }

    //     try {
    //         const parsed = JSON.parse(rawPastChats);
    //         if (parsed.expiry && parsed.expiry > Date.now()) {
    //             setChatHistory(parsed.value);
    //         } else { 
    //             localStorage.removeItem("pastChats");
    //             setChatHistory(null);
    //         }
    //     } catch (err) {
    //         console.error("Failed to parse pastChats:", err);
    //         setChatHistory(null);
    //     }
    // }, []);


    // useEffect(() => {
    //     const now = new Date;
    //     const pastChats = {
    //         value: chatHistory,
    //         expiry: now.getTime() + ttl,
    //     }

    //     localStorage.setItem("pastChats", JSON.stringify(pastChats))
    // }, [chatHistory])


    const handleMessage = async () => {
        const userMessage = inputRef.current?.value ?? "";
        if (inputRef.current) inputRef.current.value = "";

        if (userMessage.trim() === "") return;

        setChatHistory((prev) => [
            ...(prev ?? []),
            { role: "user", content: userMessage, toStream: false,cardContent : null },
            { role: "assistant", content: "", toStream: false, cardContent: null }
        ]);

        const lastSevenMessages: message[] = [...chatHistory?.slice(-6) ?? [], { role: "user", content: userMessage, toStream: false, cardContent :null  }];


        try {
            const data = await mutateAsync({ lastSevenMessages });
            setChatHistory((prev) => {
                const updated = [...(prev ?? [])];
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: data.payload.message,
                    toStream: true,
                    cardContent : data.payload.content ?? null
                }
                return updated;
            });
        } catch (err) {
            console.error(err);
        }
    };

    const slideToRecent = () => {
        recentChat.current?.scrollIntoView({ behavior: "smooth" });
    }

    const callback = () => {
        setChatHistory((prev) => {
            const updated = [...(prev ?? [])];
            updated[updated.length - 1] = {
                role: "assistant",
                content: updated[updated.length - 1].content,
                toStream: false,
                cardContent : updated[updated.length - 1].cardContent
            }
            return updated;
        });
    }



    return <div className="bg-mainComponentBg z-10 flex-1 h-screen relative h-screen overflow-y-auto scrollbarMC ">
        <div className="h-full w-full">
            <div className={`h-[80%] overflow-auto flex justify-center ${chatHistory !== null ? "items-start  " : " items-center"} py-10 scrollbarCB`}>
                <AnimatePresence mode="wait">
                    <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
                        <div className={`text-center cursor-default ${chatHistory === null ? " block " : " hidden "}`}>
                            <div className="xl:text-[3.5rem] lg:text-[2.8rem]  mx-2 text-[2rem] font-[600] xl:font-[1000] text-shadow-lg font-head text-primaryButtonBlue/95 ">Ask your secondbrain</div>
                            <div className="xl:text-lg lg:text-[1rem] font-inter text-[0.9rem] text-slate-700/80 mx-4   "> Get instant answers powered by your personal knowledge base.<br />
                                This assistant uses your saved notes and documents to provide relevant, context-aware responses.</div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className={`${chatHistory === null ? " hidden " : " block "} xl:w-[73%] w-[90%]`}>
                    <AnimatePresence mode="wait">
                        {chatHistory?.map((message, idx) => (<MessageBubble
                            key={idx}
                            role={message.role}
                            message={message.content}
                            responding={message.content === "" ? true : false}
                            streamed={message.toStream}
                            callBack={callback}
                            cardData={message.cardContent}
                        />))}
                        <div ref={recentChat} className="border-2  border-mainComponentBg" />
                    </AnimatePresence>
                </div>

            </div>
            <div className="h-[20%]  w-full flex flex-col justify-center items-center ">
                <AnimatePresence mode="wait">
                    {chatHistory !== null && buttonVisible && (<motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: -140, opacity: 1 }}
                        exit={{ y: -180, opacity: 0 }}
                        transition={{ duration: 0.1, ease: "easeInOut" }}
                        className=" z-100 fixed"
                    >
                        <BottomArrow
                            dim={"40"}
                            style="cursor-pointer rounded-[3rem] p-2 bg-gray-100 opacity-95 border-1 "
                            onClickHandler={slideToRecent}
                        />
                    </motion.div>)}
                </AnimatePresence>
                <AnimatePresence mode="wait">

                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="xl:w-[73%] w-[85%] z-50 xl:h-[70%] lg:h-[60%] h-[50%]  rounded-[3rem] flex gap-10 items-center pl-5 bg-white shadow-xl hover:shadow-3xl  mb-3 group-hover" 
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                        <textarea
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleMessage();
                                }
                            }}
                            className="text-token-text-primary resize-none placegolder:ps-px scrollbar-hidden outline-none px-5 h-[60%] xl:text-2xl lg:text-xl text-[1.35rem] font-[550] w-[85%]" placeholder="Whats on your mind..."
                            ref={inputRef} />
                        <ChatbotEnter
                            dim="20"
                            style={`p-2 mr-5 hover:bg-gray-100 lg:size-19 size-16 cursor-pointer rounded-[3rem] transition-all duration-300 ${!isPending ? " block " : " hidden "}`}
                            onClickHandler={handleMessage} />
                        <BlockIcon
                            style={` text-gray-500/90 mr-5 hover:text-gray-600/95 lg:size-17 animate-pulse size-14 cursor-default  rounded-[5rem]  transition-all duration-300 
                            ${isPending ? " block " : " hidden "}`} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

    </div>
}





