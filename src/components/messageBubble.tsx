import { motion } from "framer-motion";
import { useState, type ReactNode, useRef, useEffect } from "react";
import { ChatLoader } from "../icons/commonIcons";
import { ChatbotIcon } from "../icons/particularIcons";
import { useUserProfile } from "../recoil/user";
import type { cardContent } from "./Chatbot";
import { CardElement, type cardType } from "./card";

export const MessageBubble = ({ role, message, responding, cardData, streamed = false, callBack }: { role: "assistant" | "user", cardData: cardContent | null, message: string, responding: boolean, streamed: boolean, callBack: () => void }) => {
    const [display, setDisplay] = useState<ReactNode[]>([]);
    const timerRef = useRef<number | null>(null);
    const [user] = useUserProfile();

    const renderWithBold = (text: string) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);

        return parts.map((part, idx) => {
            const m = part.match(/^\*\*(.+?)\*\*$/);
            return m ? <b key={idx}>{m[1]}</b> : <span key={idx}>{part}</span>;
        });
    };





    useEffect(() => {
        if (!message) return;
        if (role !== "assistant" || !streamed) return;


        const tokens = message.split(" ");
        let i = 1;
        setDisplay([<span key={0}>{tokens[0] + " "}</span>]);

        const tick = () => {
            if (i >= tokens.length) {
                callBack();
                return;
            }

            const t = tokens[i];

            if (t.startsWith("**")) {
                const inline = t.match(/^\*\*(.+?)\*\*(\W*)?$/);

                if (inline) {
                    setDisplay(prev => [
                        ...prev,
                        <b key={`b-${i}`}>{inline[1]}</b>,
                        inline[2] ?? "",
                        " ",
                    ]);
                    i++;
                } else {
                    let j = i;
                    const buf: string[] = [];

                    while (j < tokens.length) {
                        buf.push(tokens[j]);
                        if (tokens[j].endsWith("**")) break;
                        j++;
                    }

                    const joined = buf.join(" ");
                    const multi = joined.match(/^\*\*(.+?)\*\*(\W*)?$/);

                    if (multi) {
                        setDisplay(prev => [
                            ...prev,
                            <b key={`b-${i}`}>{multi[1]}</b>,
                            multi[2] ?? "",
                            " ",
                        ]);
                        i = j + 1;
                    } else {
                        setDisplay(prev => [...prev, <span key={`t-${i}`}>{t + " "}</span>]);
                        i++;
                    }
                }
            } else {
                setDisplay(prev => [...prev, <span key={`t-${i}`}>{t + " "}</span>]);
                i++;
            }

            if (i < tokens.length) {
                timerRef.current = window.setTimeout(tick, 50);
            } else {
                callBack();
            }
        };


        timerRef.current = window.setTimeout(tick, 50);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [message, streamed, role]);




    return <div className="mt-2 cursor-default">
        <div className={`h-full flex ${role === "assistant" ? " justify-start " : " justify-end "} gap-2`}>
            {role === "assistant" && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-[5%] flex justify-center items-center"> <ChatbotIcon dim="40" style=" xl:size-12 md:size-10 size-8" /> </motion.div>}
            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={`${role === "assistant" ? " xl:w-[80%] lg:w-[85%] w-[95%]" : " xl:max-w-[80%] lg:max-w-[85%] max-w-[95%]"} xl:text-xl text-lg  ${role === "user" ? " bg-slate-100 text-slate-600 " : " text-slate-700 "}  rounded-3xl p-5 text-slate-600 font-inter`}>

                {role === "assistant" && message === "" && responding && <ChatLoader dim="70" />}
                {role === "assistant" && (streamed ? <span>{display}</span> : renderWithBold(message))}
                {role === "user" && message}
                {role === "assistant" && cardData !== null && <div className=" m-8 flex justify-center items-center"><CardElement title={cardData.title} cardType={cardData.type as cardType} createdAt={cardData.createdAt as string} layout="grid" link={cardData.hyperlink} id={cardData.id} shared={true} collectionId={0}  /></div>}

            </motion.div>
            {role === "user" && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-[5%] flex justify-center items-center">
                <img src={user?.profilePic} className="xl:size-12 scale-x-[-1] md:size-10 size-8 rounded-[5rem]" />
            </motion.div>}
        </div>
    </div>
}   