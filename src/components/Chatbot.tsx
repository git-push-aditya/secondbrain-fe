import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import axios from "axios";
import { BlockIcon, BottomArrow } from "../icons/commonIcons";
import { LiquidMetalButton } from "./ui/liquid-metal-button";
import { useActiveConversationId, useChatHistory } from "../recoil/chatStates";
import { AnimatePresence, motion } from "framer-motion";
import { useChatBot } from "../api/user/mutate";
import { useGetConversationQuery, useGetConversationsQuery } from "../api/user/query";
import MessageBubble from "./messageBubble";

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
    const [activeConversationId, setActiveConversationId] = useActiveConversationId();
    useEffect(() => { inputRef?.current?.focus() }, []);
    const recentChat = useRef<HTMLDivElement | null>(null);

    const [buttonVisible, setButtonVisible] = useState<Boolean>(true);
    const { mutateAsync, isPending } = useChatBot();

    const { data: conversationsData } = useGetConversationsQuery();
    const { data: conversationData } = useGetConversationQuery(activeConversationId);
    const autoRestoreAttempted = useRef(false);
    const hydratedConversationId = useRef<number | null>(null);
    const skipHydrationForId = useRef<number | null>(null);


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



    /* Auto-load the most recently updated conversation on mount so a page
       refresh doesn't lose the current chat. Runs at most once: without the
       ref guard, a "New chat" click (which nulls activeConversationId) would
       make this effect fire again and drag the user right back into the old
       conversation. Also bails if chatHistory is already non-null, since that
       means the user started typing a brand-new chat before the list loaded —
       otherwise this would race handleMessage and steal activeConversationId
       out from under the message that's already in flight. */
    useEffect(() => {
        if (autoRestoreAttempted.current) return;
        if (activeConversationId !== null || chatHistory !== null) return;
        const list = conversationsData?.payload?.conversations;
        if (!list) return; // wait for the list before giving up on restoring
        autoRestoreAttempted.current = true;
        if (list.length > 0) setActiveConversationId(list[0].id);
    }, [conversationsData, activeConversationId, chatHistory, setActiveConversationId]);

    /* Hydrates chatHistory whenever the active conversation actually changes
       (switching in the history panel, or the auto-restore above), keyed on
       conversation id rather than "has this ever run" so picking a different
       past conversation re-hydrates instead of being a no-op. Historical
       messages only carry contentRefId, not the inflated citation card, so
       they render without a source card — only the live turn just answered
       gets one.

       skipHydrationForId covers the id handleMessage just assigned: chatHistory
       there is already authoritative (it has the citation card the hydrated,
       card-less version doesn't), so the background conversation fetch that
       follows must not overwrite it. */
    useEffect(() => {
        if (activeConversationId === null) {
            // lets a later re-selection of the same conversation re-hydrate
            hydratedConversationId.current = null;
            return;
        }
        if (hydratedConversationId.current === activeConversationId) return;
        if (skipHydrationForId.current === activeConversationId) {
            hydratedConversationId.current = activeConversationId;
            skipHydrationForId.current = null;
            return;
        }
        if (!conversationData) return;
        hydratedConversationId.current = activeConversationId;

        const messages = conversationData.payload?.messages ?? [];
        setChatHistory(messages.length === 0 ? null : messages.map((m: { role: "user" | "assistant"; content: string }) => ({
            role: m.role,
            content: m.content,
            toStream: false,
            cardContent: null
        })));
    }, [activeConversationId, conversationData, setChatHistory]);


    const handleMessage = async () => {
        const userMessage = inputRef.current?.value ?? "";
        if (inputRef.current) inputRef.current.value = "";

        if (userMessage.trim() === "") return;

        setChatHistory((prev) => [
            ...(prev ?? []),
            { role: "user", content: userMessage, toStream: false,cardContent : null },
            { role: "assistant", content: "", toStream: false, cardContent: null }
        ]);

        try {
            const data = await mutateAsync({
                conversationId: activeConversationId ?? undefined,
                content: userMessage
            });

            setActiveConversationId(data.payload.conversationId);
            skipHydrationForId.current = data.payload.conversationId;

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

            /* The empty assistant message was appended before the request. Leaving
               it empty means `responding` (content === "") never goes false, so the
               thinking trace spins forever and the failure is invisible. Every
               failure mode has to land here — 401, 404, 5xx, network drop alike. */
            const status = axios.isAxiosError(err) ? err.response?.status : undefined;

            // stale/deleted conversationId: drop it so the next send starts fresh
            if (status === 404) setActiveConversationId(null);

            setChatHistory((prev) => {
                const updated = [...(prev ?? [])];
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: status === 401
                        ? "Your session expired — log in again to keep chatting."
                        : status === 404
                        ? "That conversation is gone. Send your message again to start a new one."
                        : "That request didn't go through. Try sending it again.",
                    toStream: false,
                    cardContent: null
                }
                return updated;
            });
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



    /* Held as an element, not a nested component: a component defined in the body
       would be a fresh type every render, remounting the textarea and dropping
       whatever was typed. */
    const composer = <div className="mx-auto mb-3 w-full max-w-3xl">
        {/* no overflow-hidden: the metal button casts a 36px shadow that the pill
            would otherwise clip flat */}
        <div className="silver-rim rounded-[2rem] shadow-sm transition-shadow focus-within:shadow-md">
            <div className="flex items-center gap-2 p-2 pl-5">
                <textarea
                    ref={inputRef}
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleMessage();
                        }
                    }}
                    placeholder="What do you want to know?"
                    className="max-h-40 min-w-0 flex-1 resize-none bg-transparent py-3 text-[0.95rem] leading-6 text-[#141418] outline-none scrollbar-hidden placeholder:text-[#9A9A9A]"
                />

                {/* liquid metal pill sends; it swaps for the pending block, since
                    the shader button has no in-flight state of its own */}
                <div className="shrink-0">
                    {isPending
                        ? <div className="grid size-[46px] place-items-center rounded-full bg-[var(--accent)] text-white">
                            <BlockIcon style="size-5 animate-pulse" />
                        </div>
                        : <LiquidMetalButton viewMode="icon" onClick={handleMessage} />}
                </div>
            </div>
        </div>
    </div>;

    return <div className="flex h-full flex-col px-4">
        {chatHistory === null
            ? <motion.div
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex h-full flex-col items-center justify-center">
                <h1 className="cursor-default text-center text-[1.7rem] leading-tight font-[650] tracking-[-0.02em] text-[#141418] sm:text-[2.1rem]">
                    Ask your secondbrain
                </h1>
                <p className="mt-3 mb-7 max-w-[32rem] cursor-default text-center text-[0.9rem] leading-[1.65] text-[#52525B]">
                    Instant answers from your personal knowledge base — grounded in the
                    notes and documents you've saved.
                </p>
                {composer}
            </motion.div>

            : <>
                <div className="flex-1 overflow-y-auto pt-6 scrollbarCB">
                    <div className="mx-auto w-full max-w-3xl">
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
                            <div ref={recentChat} className="h-px" />
                        </AnimatePresence>
                    </div>
                </div>

                <div className="relative">
                    <AnimatePresence>
                        {buttonVisible && <motion.div
                            initial={{ y: 8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 8, opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeInOut" }}
                            className="absolute -top-12 left-1/2 z-20 -translate-x-1/2">
                            {/* dithered black puck; the strip's checkerboard is the
                                paper colour, so the grain reads white on black */}
                            <button
                                type="button"
                                onClick={slideToRecent}
                                aria-label="Jump to latest"
                                className="relative size-10 cursor-pointer overflow-hidden rounded-full shadow-md ring-1 ring-black/25 transition-transform hover:scale-105">
                                <span className="dither-strip dither-fine block size-full"
                                    style={{ "--accent": "#0A0A0A", "--dx": "-18px", "--dy": "-26px" } as CSSProperties} />
                                {/* solid core so the glyph never lands on a pale
                                    patch of grain and disappear */}
                                <span className="puck-core absolute inset-0" />
                                <BottomArrow
                                    dim={"13"}
                                    style="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 [&_polygon]:fill-white"
                                />
                            </button>
                        </motion.div>}
                    </AnimatePresence>

                    {composer}
                </div>

                <p className="mx-auto w-full max-w-3xl cursor-default pb-2 text-center font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#A1A1AA]">
                    DeepDive can make mistakes. Verify important information.
                </p>
            </>}
    </div>
}





