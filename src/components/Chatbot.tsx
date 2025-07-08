import { useEffect, useRef, useState } from "react";


export const ChatBot = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [mssg, setMssg] = useState<string>("")
    useEffect(() => { inputRef?.current?.focus() }, [])


    return <div className="bg-mainComponentBg z-10 w-[82%] h-screen scrollbarMC">
        <div className="h-full w-full">
            <div className="h-[71%]">
                ergaer
            </div>
            <div className="h-[29%]  w-full flex justify-center items-center ">
                <div className="w-[73%] z-50 h-[60%] rounded-[3rem] flex items-center pl-5 bg-white shadow-xl hover:shadow-3xl  mb-3">
                    <textarea  className="text-token-text-primary resize-none placegolder:ps-px scrollbar-hidden outline-none px-5 h-[60%] text-2xl font-[550] w-[85%]" data-virtualKeyboard="true" placeholder="Whats on your mind..." />
                </div>
            </div>
        </div>

    </div>
}

//hover shadow is not visible