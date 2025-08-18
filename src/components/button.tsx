import type { ReactElement } from "react";

interface buttonProps {
    tooltip ?: string;
    placeholder?: string;
    onClickHandler: () => void;
    particularStyle?: string;
    buttonType: 'primary' | 'secondary' | "sidebar" | "dropDown" | "" | "dropdown" | "back" | "cardButton" | "authin" | "authicon" | "loadMore" | "rightTopbar";
    startIcon?: ReactElement | null;
    endIcon?: ReactElement | null;
    disabled?: boolean;
}

const specificStyle: { [key: string]: string } = {
    'primary': "w-62  bg-primaryButtonBlue rounded-xl h-14 justify-center text-primaryButtonText hover:bg-hover1 font-inter text-3xl  font-[500] ",
    'secondary': "w-62  bg-secondaryButtonBlue rounded-xl justify-center text-Secondarybuttontext hover:bg-hover2 font-inter  font-[420] text-3xl ",
    'sidebar': " font-cardTitleHeading text-xl pl-4 w-[100%] font-[400] mx-auto w-68 mt-2 hover:bg-gray-200  justify-start h-12 ",
    'dropDown': " text-2xl font-inter h-10 w-full h-14  mt-2 justify-between px-7",
    "chatbot": " rounded-sm",
    "dropdown": "w-50  bg-secondaryButtonBlue rounded-xl justify-between h-14 text-Secondarybuttontext hover:bg-hover2 font-inter  font-[540] text-2xl ",
    "back": " rounded-3xl bg-gray-300 hover:bg-gray-200 font-[500] justify-center text-cardTitleHeading text-2xl h-12 w-30 transition-hover duration-200 ease-in-out  ",
    "cardButton": " rounded-2xl text-head  font-[550] border-1 border-white justify-center text-lg transition-hover duration-200 ease-in-out hover:scale-104 mt-1  ",
    "authin": " bg-black w-full h-14 justify-center font-roboto text-white text-xl ",
    "loadMore": "mx-auto border-2 px-8 py-1 rounded-3xl border-primaryButtonBlue text-xl bg-gray-300 font-[500]  ",
    "rightTopbar" : " w-50 h-12 rounded-xl justify-center text-white text-[1.35rem] font-cardTitleHeading font-[600] ",
    "": ""
};

const defaultStyle = "   flex items-center  gap-3 cursor-pointer group  ease-out transition-hover duration-300 ";

export const ButtonEl = ({tooltip, placeholder, onClickHandler, disabled = false, particularStyle, buttonType, startIcon, endIcon }: buttonProps) => {
    return <div title={tooltip} ><button onClick={onClickHandler} disabled={disabled} className={`${defaultStyle}  ${specificStyle[buttonType]}  ${particularStyle}`}>
        {startIcon}
        <span className="truncate">
            {placeholder}</span>
        {endIcon}
    </button></div>
}