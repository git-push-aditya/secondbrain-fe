import { motion } from "framer-motion";
import { useState, type ReactNode, useRef, useEffect } from "react";
import { ChatLoader, CopyText } from "../icons/commonIcons";
import { ChatbotIcon } from "../icons/particularIcons";
import { useUserProfile } from "../recoil/user";
import type { cardContent } from "./Chatbot";
import { CardElement, type cardType } from "./card";
import { usePopUpAtom, usePopUpMessage } from "../recoil/clientStates";

export const MessageBubble = ({ role, message, responding, cardData, streamed = false, callBack }: { role: "assistant" | "user", cardData: cardContent | null, message: string, responding: boolean, streamed: boolean, callBack: () => void }) => {
    const [display, setDisplay] = useState<ReactNode[]>([]);
    const timerRef = useRef<number | null>(null);
    const [user] = useUserProfile();
    const [popUpMessage, setPopUpMessage] = usePopUpMessage();
    const [popUpLive, setPopUpLive] = usePopUpAtom();

    const copyResponse = () => {
        setPopUpMessage("Response coppied to clipboard!!");
        navigator.clipboard.writeText(message);
        setPopUpLive?.((prev) => !prev);
    }

    const renderWithBold = (text: string) => {
        const parts = text.split(/(^###\s.*$|\*\*[^*]+\*\*|---|\n)/gm).filter(Boolean);

        return (
            <div className="text-justify">
                {parts.map((part, idx) => {
                    if (!part) return null;

                    if (part === "---") {
                        return <hr key={idx} />
                    }

                    if (part.trim() === "" && part.includes(" ")) {
                        return " "; 
                    }

                    if (part.startsWith("###")) {
                        const headingText = part.replace(/^###\s?/, "").replace(/^#\s?/, "").replace(/^\*\*\s?/, "").replace(/\s?\*\*\s?/, "");
                        return (
                            <h1 key={idx} className="font-extrabold font-roboto text-3xl ">
                                {headingText}
                            </h1>
                        );
                    }

                    if (part.startsWith("**") && part.endsWith("**")) {
                        const boldText = part.slice(2, -2);
                        return <b key={idx}>{boldText}</b>;
                    }

                    if (part === "\n") {
                        return <br key={idx} />;
                    }

                    return <span key={idx}>{part}</span>;
                })}
            </div>
        );
    };


    useEffect(() => {
        if (!message || role !== "assistant" || !streamed) {
            return;
        }
        const tokens = message.match(/(####|###|\*\*|---|\n|[^\s\*#]+)/g) || [];

        if (display.length === 0) {
            setDisplay([]);
        }

        let i = display.length;
        let hash = false;
        let boldMode = false;

        const tick = () => {
            if (i >= tokens.length) {
                callBack();
                return;
            }

            const t = tokens[i];

            if (t === "\n") {
                if (hash) {
                    hash = false;
                } else {
                    setDisplay(prev => [...prev, <br key={`br-${i}`} />]);
                }

            } else if (t === "###" || t === "####") {
                hash = true;
            } else if (t === "**") {
                boldMode = !boldMode;
            } else if (t == "---") {
                setDisplay(prev => [...prev, <hr />])
            } else if (boldMode) {
                setDisplay(prev => [...prev, <b key={`b-${i}`}>{t}</b>, " "]);
            } else {
                if (hash) {
                    setDisplay(prev => [...prev, <h1 key={i} className="font-extrabold font-roboto text-3xl ">{t}</h1>, " "]);
                } else {
                    setDisplay(prev => [...prev, <span key={`t-${i}`}>{t}</span>, " "]);
                }
            }


            i++;

            if (i < tokens.length) { 
                timerRef.current = window.setTimeout(tick, 60);
            } else {
                callBack();
            }
        };

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
 
        timerRef.current = window.setTimeout(tick, 60);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [message, streamed, role]);


    return <div className="mt-2 cursor-default">
        <div className={`h-full flex ${role === "assistant" ? " justify-start " : " justify-end "} gap-2`}>
            {
                role === "assistant" && <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-[5%] flex justify-center items-center">
                    <ChatbotIcon dim="40" style=" xl:size-12 md:size-10 size-8" />
                </motion.div>
            }
            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={`${role === "assistant" ? " xl:w-[80%] lg:w-[85%] w-[95%]" : " xl:max-w-[80%] lg:max-w-[85%] max-w-[80%]"} xl:text-xl text-xl  ${role === "user" ? " bg-slate-100 text-slate-600 " : " text-slate-700 "}  rounded-3xl md:p-4 p-3 text-slate-600 font-inter`}>
                <article >

                    <div className="md:float-right">
                        {role === "assistant" && cardData !== null && <div className=" m-8 flex justify-center items-center">
                            <CardElement
                                key={cardData.id}
                                title={cardData.title}
                                cardType={cardData.type as cardType}
                                createdAt={cardData.createdAt}
                                layout="grid"
                                link={cardData.hyperlink}
                                id={cardData.id}
                                shared={true}
                                note={cardData.note ?? undefined}
                                collectionId={0}
                                tags={cardData.tags}
                            />
                        </div>
                        }
                    </div>
                    <p>
                        {
                            role === "assistant" && message === "" && responding && 
                                <ChatLoader 
                                    style="flex justify-start" 
                                    dim="70" 
                                />
                        }
                        {
                            role === "assistant" && (streamed ? <div 
                                className="text-justify">
                                    {display}
                                </div> : renderWithBold(message)
                            )
                        }
                    </p>

                </article>

                {role === "user" && message}

                {
                    role === "assistant" && !responding && <div
                        className="relative bottom-0 -left-4 cursor-pointer  lg:m-4 m-2">
                        <CopyText
                            dim="45"
                            onClickHandler={copyResponse}
                            style={` hover:bg-slate-100 lg:p-2 p-1 size-8 md:size-9  lg:size-11 rounded-lg transition-hover duration-200`}
                        />
                    </div>
                }
            </motion.div>
            {role === "user" && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:w-[5%] w:[8%] flex justify-center items-center">
                <img src={user?.profilePic} className="xl:size-12 scale-x-[-1] md:size-10 size-9 lg:rounded-[5rem] rounded-[2rem]" />
            </motion.div>}
        </div>
    </div>
}   