import { motion } from "framer-motion";
import { useState, type ReactNode, useRef, useEffect } from "react";
import { CopyText } from "../icons/commonIcons";
import ThinkingState from "./thinkingState";
import type { cardContent } from "./Chatbot";
import { type cardType } from "./card";
import SourceCard from "./sourceCard";
import { usePopUpAtom, usePopUpMessage } from "../recoil/clientStates";
import React from "react";

const MessageBubble = ({ role, message, responding, cardData, streamed = false, callBack }: { role: "assistant" | "user", cardData: cardContent | null, message: string, responding: boolean, streamed: boolean, callBack: () => void }) => {
    const [display, setDisplay] = useState<ReactNode[]>([]);
    const timerRef = useRef<number | null>(null);
    const [popUpMessage, setPopUpMessage] = usePopUpMessage();
    const [popUpLive, setPopUpLive] = usePopUpAtom();

    const copyResponse = () => {
        setPopUpMessage("Response copied to clipboard!!");
        navigator.clipboard.writeText(message);
        setPopUpLive?.((prev) => !prev);
    }

    const renderWithBold = (text: string) => {
        // keep delimiters, but don't drop empty strings
        const parts = text.split(/(###\s.*$|\*\*[^*]+\*\*|---|\n)/gm);

        return (
            <div className="text-justify">
                {parts.map((part, idx) => {
                    if (!part) return null; // skip only true null/undefined, not empty strings

                    if (part === "---") {
                        return <hr key={idx} />;
                    }

                    if (part === "\n") {
                        return <br key={idx} />;
                    }

                    if (part.startsWith("###")) {
                        const headingText = part
                            .replace(/^###\s?/, "")
                            .trim();
                        return (
                            <h1 key={idx} className="font-extrabold font-roboto text-3xl">
                                {headingText}
                            </h1>
                        );
                    }

                    if (part.startsWith("**") && part.endsWith("**")) {
                        const boldText = part.slice(2, -2);
                        return <b key={idx}>{boldText}</b>;
                    }

                    // default case: just render span
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


    return <div className="group/message relative mb-2 flex w-full flex-col">
        <div className={`flex w-full ${role === "assistant" ? "justify-start" : "justify-end"}`}>
            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={`cursor-default font-inter text-[0.95rem] leading-[1.7] ${role === "user"
                    ? "max-w-[90%] rounded-3xl rounded-br-lg border border-[var(--rule)] bg-[var(--wash)] px-4 py-3 text-[#141418]"
                    : "w-full max-w-none text-[#27272A]"}`}>
                {/* With a citation the answer becomes two columns — prose left,
                    source rail right. Stacks under 768px, where a 9rem rail beside
                    text would leave neither enough room. */}
                <article className={cardData !== null && role === "assistant"
                    ? "flex flex-col gap-4 md:flex-row md:items-start md:gap-6"
                    : undefined}>

                    <div className="min-w-0 flex-1">
                        {/* Stays mounted past `responding` so it can settle into
                            "Thought for Ns"; renders nothing for restored history. */}
                        {role === "assistant" && <ThinkingState working={responding} />}

                        <p>
                            {
                                role === "assistant" && (streamed ? <div
                                    className="text-justify">
                                    {display}
                                </div> : renderWithBold(message)
                                )
                            }
                        </p>
                    </div>

                    {role === "assistant" && cardData !== null &&
                        <div className="w-full shrink-0 md:sticky md:top-4 md:w-36">
                            <SourceCard
                                id={cardData.id}
                                title={cardData.title}
                                link={cardData.hyperlink}
                                type={cardData.type as cardType}
                            />
                        </div>
                    }
                </article>

                {role === "user" && message}
            </motion.div>
        </div>

        {/* action bar rides in on hover, per the reference */}
        {role === "assistant" && !responding &&
            <div className="-ml-2 mt-1 flex h-8 items-center gap-0.5 opacity-0 transition-opacity group-focus-within/message:opacity-100 group-hover/message:opacity-100">
                <CopyText
                    dim="16"
                    onClickHandler={copyResponse}
                    style="size-8 cursor-pointer rounded-full p-2 text-[#6B6B6B] transition-colors hover:bg-[var(--wash)] hover:text-[var(--accent)] [&_path]:stroke-current"
                />
            </div>
        }
    </div>
}


export default React.memo(MessageBubble);