import { useState, type ReactElement } from "react";
import { InstagramIcon, RedditIcon, TwitterIcon, WebIcon, WebPageDisplay, YoutubeIcon } from "../icons/particularIcons";
import { DeleteIcon, ShareIcon } from "../icons/commonIcons";
import Tag from "./tags"; 
import { ButtonEl } from "./button";
 

export interface cardProp{
    title: string;
    cardType: "youtube" | "web" | "twitter" | "reddit" | "instagram";
    note? : string;
    tags?: {title : string, id: number}[];
    createdAt?: string;
    link : string; 
    setPopUpLive : React.Dispatch<React.SetStateAction<Boolean>>;
}

const minEndingIndex = (link: string) : number=> {
    const positions = [
        link.indexOf('.com') === -1 ? Infinity : link.indexOf('.com') + 4,
        link.indexOf('.in') === -1 ? Infinity : link.indexOf('.in') + 3,
        link.indexOf('.org') === -1 ? Infinity : link.indexOf('.org') + 4,
        link.indexOf('.net') === -1 ? Infinity : link.indexOf('.net') + 4,
        link.indexOf('.info') === -1 ? Infinity : link.indexOf('.info') + 5,
        link.indexOf('.biz') === -1 ? Infinity : link.indexOf('.biz') + 4,
        link.indexOf('.app') === -1 ? Infinity : link.indexOf('.app') + 4,
        link.indexOf('.xyz') === -1 ? Infinity : link.indexOf('.xyz') + 4,
      ];
      
      const minPos = Math.min(...positions);
      return minPos;
      
}

    const clicked = () => {
        alert("clikced");
    }

const typeIcon:{[key:string]:ReactElement}={
    'twitter' : <TwitterIcon dim="45" />,
    'youtube' : <YoutubeIcon dim="60"/>,
    'web' : <WebIcon diml="60" dimb="50" />,
    'reddit' : <RedditIcon dim="50" />,  
    'instagram' : <InstagramIcon dim="50" />
}



const defaultStyle:string = "w-88 font-source hover:border-slate-500  transition-hover duration-300 max-h-145  bg-cardBackground border-2 border-slate-300 rounded-3xl shadow-md "; 

export const CardElement = ({title,cardType,note,setPopUpLive,tags,createdAt,link} : cardProp) => {  

    const [deletClicked, setDeleteClicked] = useState<Boolean>(false);
    const shareClicked = (link :string ) => {
        navigator.clipboard.writeText(link);
        setPopUpLive((prev) => !prev);

    }

    return<div className={defaultStyle}> 
            <div className="flex justify-between gap-2 px-6 pt-1" >
                <div className="flex justify-around gap-2 items-center">
                    {typeIcon[cardType]}
                    <div className="font-[550] cursor-default font-cardTitleFont text-xl ont-cardTitleHeading ">{title}</div>
                </div>
                <div className="flex justify-around gap-4 items-center">
                    <ShareIcon style="size-7 hover:text-slate-600 transition-hover duration-300 ease-in-out" onClickHandler={() => shareClicked(link)} />
                    <DeleteIcon  onClickHandler={() => setDeleteClicked((prev) => !prev)} style="size-7.5 hover:text-slate-600 transition-hover duration-300 ease-in-out" />
                </div> 
            </div>
            <div > 
                <div className= "px-2 max-h-[321px] overflow-y-auto scrollbar-hidden scroll-smooth overscroll-auto relative">
                    {deletClicked ? <div className="px-2 bg-cardBackground/90 mb-2 h-[75px] text-gray-700 text-center text-xl font-[580] sticky left-0 top-0  ">
                    Delete this Link ? 
                        <div className=" flex items-center justify-around gap-4 mb-4">
                            <ButtonEl onClickHandler={()=> setDeleteClicked((prev) => !prev)} placeholder="Cancel" buttonType={"cardButton"} particularStyle=" hover:bg-green-400 bg-green-300 text-white w-30 h-9 " />  
                            <ButtonEl onClickHandler={clicked} placeholder="Delete" buttonType={"cardButton"} particularStyle=" text-white hover:bg-red-400 bg-red-300  w-30 h-9 " />     
                        </div>
                    </div> : null }
                
                    {cardType === "youtube" &&  <iframe  className="w-[99%] mx-auto h-50  rounded-lg  "  title="YouTube video player" src={link.includes('youtu.be') ? link.replace('youtu.be', 'youtube.com/embed') : link}  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> }
                    
                    {cardType === 'twitter' && <div className="w-full mb-[-10px] mx-auto"> 
                            <blockquote className= "twitter-tweet m-0 w-full max-w-full"  >
                                <a href={link.replace('x.com','twitter.com')} target="_blank" rel="noopener noreferrer" > </a>
                            </blockquote> 
                    </div>}

                    {cardType === 'reddit' && <>
                        <div className="" >
                            <blockquote className="reddit-embed-bq">
                                <a href={link}></a>
                            </blockquote>
                        </div>
                    </>}

                    {cardType === 'instagram' && 
                    <div className="flex justify-center mb-[-8px]">
                            <blockquote className="instagram-media w-full max-w-full " data-instgrm-permalink={link} data-instgrm-version="14">
                                <a href={!link.includes('embed&amp;utm_campaign=loading') ? link.replace('web_copy_link','embed&amp;utm_campaign=loading') : link}></a>    
                            </blockquote>  
                            </div>
                    }

                    {
                        cardType === 'web' && 
                        <div className="flex justify-center">
                            <a href={link} target="_blank">
                                {<WebPageDisplay  />}
                                <div className="text-center text-mon0 text-xl text-primaryButtonBlue mt-[-30px]">
                                    {link.substring(link.indexOf('www'),minEndingIndex(link)).split('https://')[1]}
                                </div>
                            </a>
                        </div>
                    }
                    
                    {note && <div className="px-2 cursor-default font-sans font-[440] text-slate-700 text-xl pt-4 px-3 text-justify">
                        {note}
                    </div>}
                    
                </div> 
                <div className="flex items-center gap-2 justify-center my-3">
                    <Tag name="science" id="hehe" />
                    <Tag name="science and technology" id="hehe" />
                    <Tag name="..." id="hehe" />
                </div>
                <div className="px-6 mb-4 cursor-default text-lg font-[400] text-slate-500">Added on {createdAt}</div>
            </div> 
    </div>

} 

 

