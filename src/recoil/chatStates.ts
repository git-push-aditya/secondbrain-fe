import {atom, useRecoilState} from "recoil";

interface message{
    sender : "user" | "chatbot";
    text : string;
}

const chatHistory = atom<message[] | null>({
    key : "chats",
    default : null
})

export const useChatHistory = () => useRecoilState(chatHistory);