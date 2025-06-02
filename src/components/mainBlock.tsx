import { useState, useEffect} from "react";
import { instagramScriptLoader, loadTwitterScript,redditScriptLoader } from "../scriptLoader";
import type { cardProp } from "./card";
import { ButtonEl } from "./button"
import { CardElement } from "./card";
import { GridIcon, ListIcon, PlusIcon ,ShareIcon} from "../icons/commonIcons";   
import type { ChildProps } from "../pages/dashboard";


const MainBlock = ({setModalNeededBy, setPopUpLive, layout,setLayout} : ChildProps) => {
    const [tweetCount, setTweetCount] = useState<number>(0);//no. of tweets card among all cards
    const [tweetScriptNeeded,setTweetScriptNeeded] = useState<boolean>(false);   // if tweets needed
    
    const [cardsList,setCardList]=useState<cardProp[]>([]);  //contains the list of all the card needed
    
    const [redditCount, setRedditcount] = useState<number>(0);
    const [redditScriptneeded, setRedditScriptneeded] = useState<boolean>(false);

    const [instaCount, setInstaCount] = useState<number>(0);
    const [instaScriptNeeded, setInstaScriptNeeded] = useState<boolean>(false);

    





    
    const layoutStyle = "hover:bg-[#F5F5F6] rounded-lg p-2  cursor-pointer";
    
    return<div className="bg-mainComponentBg z-10 flex-1 pb-20 relative h-full overflow-y-auto scrollbarMC">
                
        <div className="flex justify-between gap-4 p-6 left-0 top-0 sticky z-10 items-center bg-gradient-to-b from-mainComponentBg via-mainComponentBg to-transparent">
            <div className="text-5xl text-dashboardHeading font-extrabold cursor-default">Welcome, Aditya Dubey</div>
            <div className="flex justify-around gap-6">
                <ButtonEl onClickHandler={() => setModalNeededBy("shareBrain")} placeholder="Share Brain" particularStyle=" h-14 " buttonType="secondary" startIcon={<ShareIcon style="size-8.5 " />}></ButtonEl>
                <ButtonEl onClickHandler={() => setModalNeededBy("addContent")} placeholder="Add Content" buttonType="primary" startIcon={<PlusIcon style="size-8.5 " />}></ButtonEl>
                
            </div>
        </div> 
        <div  className="flex justify-end mr-7">
            <div className="text-center font-head font-[500] p-4">
                 //NOTE: fixed placing to adjust placement of component irrerspective of other component and along with this using z value to maintain who stays on top of whom when times call for it 
                 //at initial fietch req with paginationlimitonl10 cards at a timee; you also get a complete list of all tags prev.used by user and at time of add content browser compares orignal list for old tags and new tags; db only stores tags for specific user(if its toomuch than make user id to tags as array and try n manage) 
                 //optimize / cache the twitter reddit so that is stays on unmount or something</div>
            <div className="flex items-center justify-around ml-6 w-26 gap-2 rounded-lg "> 
                <GridIcon dim="50" onClickHandler={() => setLayout?.("grid")} style={layoutStyle}/> 
                <ListIcon dim="50" onClickHandler={() => setLayout?.("list")} style={layoutStyle} />
            </div>
        </div>
        <div className=" mt-6  w-full flex justify-center ">
            <div className={` ${layout === "grid" ? " grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:gap-6  lg:gap-4 gap-2 gap-y-6 " : " w-full " }`}> 
                <CardElement setPopUpLive={() => setPopUpLive?.(true)}  layout={layout} title="wassup people this is crazy" note="wassup people this is crazy fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i  djdh fhv thr etsr fgfu huu hioup pope and i" shared={false} createdAt="11/12/2004" cardType="twitter" link="https://twitter.com/narendramodi/status/1919736905115054505"></CardElement>
                <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title="wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" shared={false} createdAt="11/12/2004" cardType="reddit" link="https://www.reddit.com/r/TheWhiteLotusHBO/comments/1is3or1/who_do_you_think_is_the_murderer_or_murderers_of/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"></CardElement>
                <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title="wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" shared={false} createdAt="11/12/2004" cardType="instagram" link="https://www.instagram.com/p/DJVJJkktapz/?utm_source=ig_web_copy_link"></CardElement>
                
                <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title=" wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" cardType="web" shared={false} createdAt="11/12/2004" link="https://x.com/arunpudur/status/1919789338981712121" ></CardElement>
                <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title=" wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhfwassup people this is u iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and ir etsr fgfu huu hioup pope and i" shared={false} createdAt="11/12/2004" cardType="youtube" link="https://www.youtube.com/embed/Eo4X1xBt4P0?si=rRY13NFAVXYhApRY"></CardElement>
                <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title=" wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" shared={false} createdAt="11/12/2004" cardType="twitter" link="https://twitter.com/narendramodi/status/1919736905115054505"></CardElement>
                <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title=" wassup people this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr wassup people this is ou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and iyou iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and ihioup pope and i" shared={false} createdAt="11/12/2004" cardType="reddit" link="https://www.reddit.com/r/TheWhiteLotusHBO/comments/1is3or1/who_do_you_think_is_the_murderer_or_murderers_of/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"></CardElement>
                <CardElement setPopUpLive={() => setPopUpLive?.(true)} layout={layout} title=" wassup people this is crazy " note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i" shared={false} createdAt="11/12/2004" cardType="instagram" link="https://www.instagram.com/p/DJVJJkktapz/?utm_source=ig_web_copy_link"></CardElement> 
                <CardElement setPopUpLive={() => setPopUpLive?.(true)} shared={false} createdAt="11/12/2004" layout={layout} title="wassup people heheh heheh heheh heheh heheh this is crazy" note="you iaefi awoda awiwi jjjdddhhhf  djdh fhv thr etsr fgfu huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i huu hioup pope and i" cardType="web" link="https://x.com/arunpudur/status/1919789338981712121" ></CardElement>
            </div> 
        </div>
    </div>
}  



export default MainBlock;
