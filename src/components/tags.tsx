import type { ReactElement } from "react";

interface tagProps{
    name:string;
    id: string;
    endIcon?: ReactElement;
    onClickHandler ?: () => void;
}

const Tag = ({name,id,endIcon,onClickHandler}:tagProps) => {
    return <div onClick={onClickHandler} className="inline-flex justify-center whitespace-nowrap cursor-pointer text-center items-center bg-tagBg  p-2 rounded-4xl hover:border-1 hover:border-slate-400 transition-hover duration-200 text-tagText border-1 border-tagBg" id={id}>
        {
            name != "..." ? <>#{name}</> : <>{name}</> 
        }
        {
           endIcon
        }
        
    </div>
}

export default Tag;

