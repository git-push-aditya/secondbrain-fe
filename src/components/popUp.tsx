import { AnimatePresence, motion } from "framer-motion"
import { Tick } from "../icons/commonIcons"
import { usePopUpMessage, useTabAtom } from "../recoil/clientStates"


export const PopUp = ({ particularStyle }: { particularStyle?: string, placeholder: string }) => {

    const [tab] = useTabAtom();
    const [popUpMessage ] = usePopUpMessage();


    return <AnimatePresence>
        <motion.div key="popup"
            initial={{ y: 20, opacity: 0, scale: 0.90 }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`z-400 fixed cursor-default ${tab !== "chatbot" ? "bottom-18" : "top-25"} left-0 right-0`}
            transition={{ duration: 0.2, ease: "easeInOut" }}> 
                <div className={` shadow-2xl z-100 w-92 h-9 text-xl flex justify-center items-center mx-auto  rounded-xl z-100 bg-white border-2 border-slate-600 text-black  ${particularStyle}`}>
                    <Tick dim="28" style="mr-3" />
                    {popUpMessage}
                </div>
            </motion.div>
        </AnimatePresence>
} 