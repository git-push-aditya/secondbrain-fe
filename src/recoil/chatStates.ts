import {atom, useRecoilState} from "recoil";
import type { cardContent } from "../components/Chatbot";

export interface message{
    role : "user" | "assistant";
    content : string; 
    toStream : boolean;
    cardContent : cardContent | null;
}

const chatHistory = atom<message[] | null>({
    key : "chats",
    default : null
})

export const useChatHistory = () => useRecoilState(chatHistory);