
//note collection dashboard is reffered as orimary; rest other shared collections are simply shared by the name of that collection

import { CardElement } from "../components/card"
import { GridIcon, ListIcon } from "../icons/commonIcons"
import { LogoIcon } from "../icons/particularIcons"
import { usePopUpAtom } from "../recoil/clientStates"

//if brain is shared there shouldnt be delete options and added displayed

export const SharedCollection = ({layout,setLayout}:{layout: "grid" | "list",setLayout: React.Dispatch<React.SetStateAction<"grid" | "list">>}) => {

    const [popUpLive, setPopUpLive] = usePopUpAtom()
    const layoutStyle = "hover:bg-[#F5F5F6] rounded-lg p-2 transition:hover duration-200 ease-in-out  cursor-pointer size-11 lg:size-13";

    return <div className="h-full w-full bg-mainComponentBg flex flex-col items-center py-5 ">
        <div className="w-[90%] md:w-[75%] h-[15%] flex gap-4 lg:gap-8 items-center ">
            <div>
                <LogoIcon dim="30" style="size-20 md:size-25 xl:size-30" />
            </div>
            <div className="overflow-x-hidden">
                <div className="xl:text-5xl md:text-3xl text-xl  font-dashboardHeading font-extrabold cursor-default line-colaps-2 text-4xl font-bold text-gradient  ">
                    Aditya Dubey's shared brain
                </div>
                <div className="md:text-2xl cursor-default text-slate-800 text-lg font-[550] text-subHead mt-0 md:mt-2 lg:mt-3">
                    Collection: Primary
                </div>
            </div>
            
        </div>
        
        <div className="w-[95%] md:w-[80%] h-[85%] 2xl:h-[80%]">
            <div className="flex justify-between items-center mx-15 md:mx-12 ">
                <div className="text-gray-700 animate-pulse duration-[5000ms] duration-[2000ms] ml-2 line-clamp-3 text-sm md:text-xl font-[480] cursor-default">
                    secondbrain helps you capture and share insights from the web — your second brain, curated for the world.
                </div>
                <div className="flex items-center justify-around  w-26 gap-2 mr-2 rounded-lg"> 
                    <GridIcon dim="52" onClickHandler={() => setLayout?.("grid")} style={layoutStyle}/> 
                    <ListIcon dim="52" onClickHandler={() => setLayout?.("list")} style={layoutStyle} />
                </div>
            </div>
            <div className=" mt-6 flex justify-center ">
                <div className={` ${layout === "grid" ? " grid sharedBp2xl:grid-cols-4 sharedBp2x:gap-10 sharedBplg:grid-cols-3  md:grid-cols-2 grid-cols-1  lg:gap-4 gap-2 gap-y-4 " : " w-full px-10 " }`}> 
                    <CardElement setPopUpLive={() => setPopUpLive?.(true)}  layout={layout} title="wassup people this is crazy" note="wassup people this is crazy fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i  djdh fhv thr etsr fgfu huu hioup pope and i" shared={true} createdAt="11/12/2004" cardType="TWITTER" link="https://twitter.com/narendramodi/status/1919736905115054505"></CardElement>
                    <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title="wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" shared={true} createdAt="11/12/2004" cardType="REDDIT" link="https://www.reddit.com/r/TheWhiteLotusHBO/comments/1is3or1/who_do_you_think_is_the_murderer_or_murderers_of/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"></CardElement>
                    <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title="wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" shared={true} createdAt="11/12/2004" cardType="INSTAGRAM" link="https://www.instagram.com/p/DJVJJkktapz/?utm_source=ig_web_copy_link"></CardElement>
                    
                    <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title=" wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" cardType="WEB" shared={true} createdAt="11/12/2004" link="https://x.com/arunpudur/status/1919789338981712121" ></CardElement>
                    <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title=" wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhfwassup people this is u iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and ir etsr fgfu huu hioup pope and i" shared={true} createdAt="11/12/2004" cardType="YOUTUBE" link="https://www.youtube.com/embed/Eo4X1xBt4P0?si=rRY13NFAVXYhApRY"></CardElement>
                    <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title=" wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" shared={true} createdAt="11/12/2004" cardType="TWITTER" link="https://twitter.com/narendramodi/status/1919736905115054505"></CardElement>
                    <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title=" wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr wassup people this is ou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and ihioup pope and i" shared={true} createdAt="11/12/2004" cardType="REDDIT" link="https://www.reddit.com/r/TheWhiteLotusHBO/comments/1is3or1/who_do_you_think_is_the_murderer_or_murderers_of/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"></CardElement>
                    <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title=" wassup people this is crazy " note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" shared={true} createdAt="11/12/2004" cardType="INSTAGRAM" link="https://www.instagram.com/p/DJVJJkktapz/?utm_source=ig_web_copy_link"></CardElement> 
                    <CardElement setPopUpLive={() => setPopUpLive?.(true)} shared={true} createdAt="11/12/2004" layout={layout} title="wassup people heheh heheh heheh heheh heheh this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i" cardType="WEB" link="https://x.com/arunpudur/status/1919789338981712121" ></CardElement>
                </div> 
            </div>
        </div>

    </div>
}