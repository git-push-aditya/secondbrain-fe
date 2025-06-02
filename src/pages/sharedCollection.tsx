
//note collection dashboard is reffered as orimary; rest other shared collections are simply shared by the name of that collection

import { CardElement } from "../components/card"
import { GridIcon, ListIcon } from "../icons/commonIcons"
import { LogoIcon } from "../icons/particularIcons"

//if brain is shared there shouldnt be delete options and added displayed

export const SharedCollection = ({popUpLive, setPopUpLive,layout,setLayout}:{popUpLive:Boolean,setPopUpLive:React.Dispatch<React.SetStateAction<Boolean>>,layout: "grid" | "list",setLayout: React.Dispatch<React.SetStateAction<"grid" | "list">>}) => {

    const layoutStyle = "hover:bg-[#F5F5F6] rounded-lg p-2  cursor-pointer";

    return <div className="h-full w-full bg-mainComponentBg flex flex-col items-center pb-5 ">
        <div className="w-screen md:w-[76%]  px-10 pt-4 md:px-0 h-[15%] flex gap-8 items-center ">
            <div>
                <LogoIcon dim="30" style="xl:size-30" />
            </div>
            <div>
                <div className="xl:text-5xl text-2xl  font-dashboardHeading font-extrabold cursor-default truncate">
                    Aditya Dubey's shared brain
                </div>
                <div className="md:text-2xl text-slate-800 text-lg font-[550] text-subHead mt-2">
                    Collection: Primary
                </div>
            </div>
            
        </div>
        
        <div className="w-screen md:w-[76%] h-[85%] ">
            <div className="flex justify-end">
                <div className="flex items-center justify-around  w-26 gap-2 rounded-lg "> 
                    <GridIcon dim="55" onClickHandler={() => setLayout?.("grid")} style={layoutStyle}/> 
                    <ListIcon dim="55" onClickHandler={() => setLayout?.("list")} style={layoutStyle} />
                </div>
            </div>
            <div className=" mt-6 flex justify-center ">
                <div className={` ${layout === "grid" ? " grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:gap-6  lg:gap-4 gap-2 gap-y-6 " : " w-full " }`}> 
                    <CardElement setPopUpLive={() => setPopUpLive(true)} layout={layout} title="wassup people this is crazy" note="wassup people this is crazy fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i  djdh fhv thr etsr fgfu huu hioup pope and i" createdAt="11/12/2004" cardType="twitter" link="https://twitter.com/narendramodi/status/1919736905115054505"></CardElement>
                    <CardElement setPopUpLive={() => setPopUpLive(true)} layout={layout} title="wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" createdAt="11/12/2004" cardType="reddit" link="https://www.reddit.com/r/TheWhiteLotusHBO/comments/1is3or1/who_do_you_think_is_the_murderer_or_murderers_of/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"></CardElement>
                    <CardElement setPopUpLive={() => setPopUpLive(true)} layout={layout} title="wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" createdAt="11/12/2004" cardType="instagram" link="https://www.instagram.com/p/DJVJJkktapz/?utm_source=ig_web_copy_link"></CardElement>
                    
                    <CardElement setPopUpLive={() => setPopUpLive(true)} layout={layout} title=" wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" cardType="web" createdAt="11/12/2004" link="https://x.com/arunpudur/status/1919789338981712121" ></CardElement>
                    <CardElement setPopUpLive={() => setPopUpLive(true)} layout={layout} title=" wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhfwassup people this is u iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and ir etsr fgfu huu hioup pope and i" createdAt="11/12/2004" cardType="youtube" link="https://www.youtube.com/embed/Eo4X1xBt4P0?si=rRY13NFAVXYhApRY"></CardElement>
                    <CardElement setPopUpLive={() => setPopUpLive(true)} layout={layout} title=" wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" createdAt="11/12/2004" cardType="twitter" link="https://twitter.com/narendramodi/status/1919736905115054505"></CardElement>
                    <CardElement setPopUpLive={() => setPopUpLive(true)} layout={layout} title=" wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr wassup people this is ou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and ihioup pope and i" createdAt="11/12/2004" cardType="reddit" link="https://www.reddit.com/r/TheWhiteLotusHBO/comments/1is3or1/who_do_you_think_is_the_murderer_or_murderers_of/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"></CardElement>
                    <CardElement setPopUpLive={() => setPopUpLive(true)} layout={layout} title=" wassup people this is crazy " note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" createdAt="11/12/2004" cardType="instagram" link="https://www.instagram.com/p/DJVJJkktapz/?utm_source=ig_web_copy_link"></CardElement> 
                    <CardElement setPopUpLive={() => setPopUpLive(true)} createdAt="11/12/2004" layout={layout} title="wassup people heheh heheh heheh heheh heheh this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i" cardType="web" link="https://x.com/arunpudur/status/1919789338981712121" ></CardElement>
                </div> 
            </div>
        </div>

    </div>
}