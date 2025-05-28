import type { ReactElement } from "react";

interface buttonProps{
    placeholder?: string;
    onClickHandler : () => void;
    particularStyle?: string;
    buttonType : 'primary' | 'secondary' | "sidebar" | "dropDown" |"" | "dropdown";
    startIcon? : ReactElement; 
    endIcon?: ReactElement;
}

const specificStyle : {[key: string]: string} = {
    'primary' : "w-62  bg-primaryButtonBlue rounded-xl h-14 justify-center text-primaryButtonText hover:bg-hover1 font-inter text-3xl  font-[420] ",
    'secondary': "w-62  bg-secondaryButtonBlue rounded-xl justify-center h-14 text-Secondarybuttontext hover:bg-hover2 font-inter  font-[420] text-3xl ",
    'sidebar' : " font-cardTitleHeading text-xl w-full font-[400] mx-auto w-68 mt-2 hover:bg-gray-200  justify-start pl-4 h-12 ",
    'dropDown' : " text-2xl font-inter h-10 w-full h-14  mt-2 justify-between px-7", 
    "chatbot" : " rounded-sm",
    "dropdown" : "w-50  bg-secondaryButtonBlue rounded-xl justify-center h-14 text-Secondarybuttontext hover:bg-hover2 font-inter  font-[420] text-2xl ",
    "" : ""
};

const defaultStyle = "   flex items-center  gap-3 cursor-pointer group  ease-out transition-hover duration-300 ";

export const ButtonEl = ({placeholder, onClickHandler, particularStyle, buttonType, startIcon,endIcon} : buttonProps) => {
    return<div ><button onClick={onClickHandler} className={`${defaultStyle}  ${specificStyle[buttonType]}  ${particularStyle}`}> 
        {startIcon}
        {placeholder}
        {endIcon} 
    </button></div>
}