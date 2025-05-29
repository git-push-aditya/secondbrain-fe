import { AnimatePresence, motion } from "framer-motion"


export const PopUp = ({particularStyle,placeholder} : {particularStyle ?: string, placeholder: string}) => {
    return <AnimatePresence><motion.div key="popup" 
                initial={{ y: -100, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -300, opacity: 0 }}
                transition={{ duration: 2,ease:"easeInOut" }}> <div className={`top-21 left-0 right-0 w-80 h-8 text-xl flex justify-center items-center mx-auto absolute rounded-xl z-100 bg-white border-1 border-slate-400 text-black  ${particularStyle}`}> 
        {placeholder}
    </div></motion.div></AnimatePresence>
}