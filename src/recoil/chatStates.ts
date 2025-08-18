import {atom, useRecoilState} from "recoil";

export interface message{
    role : "user" | "assistant";
    content : string; 
    toStream : boolean;
}

const chatHistory = atom<message[] | null>({
    key : "chats",
    default : null
})

export const useChatHistory = () => useRecoilState(chatHistory);