
//note collection dashboard is reffered as orimary; rest other shared collections are simply shared by the name of that collection
import { useLocation } from "react-router-dom"
import { CardElement } from "../components/card"
import { GridIcon, ListIcon } from "../icons/commonIcons"
import { LogoIcon } from "../icons/particularIcons"
import { usePopUpAtom } from "../recoil/clientStates"
import { useFEctchData, useSharedMetaData } from "../api/shared/query"
import { Fragment } from "react/jsx-runtime"
import { ButtonEl } from "../components/button" 

export const SharedCollection = ({layout,setLayout}:{layout: "grid" | "list",setLayout: React.Dispatch<React.SetStateAction<"grid" | "list">>}) => {
    const location =  useLocation();
    const hash = new URLSearchParams(location.search).get('id') || "";
    
    const [popUpLive, setPopUpLive] = usePopUpAtom()
    const layoutStyle = "hover:bg-[#F5F5F6] rounded-lg p-2 transition:hover duration-200 ease-in-out  cursor-pointer size-11 lg:size-13";

    const {data : metadata, isLoading : metadataLoading, isSuccess} = useSharedMetaData({hash});

    const {data: sharedData, isLoading: sharedDataLoading, hasNextPage, isFetchingNextPage, fetchNextPage} = useFEctchData({hash});

    return <div className="h-full w-full bg-mainComponentBg overflow-y-auto scrollbarMC flex flex-col items-center pt-5 pb-15 ">
        <div className="w-[90%] md:w-[75%] h-[15%] flex gap-4 lg:gap-8 items-center ">
            <div>
                <LogoIcon dim="30" style="size-20 md:size-25 xl:size-30" />
            </div>
            <div className="overflow-x-hidden">
                <div className="xl:text-5xl md:text-3xl text-xl  font-dashboardHeading font-extrabold cursor-default line-colaps-2 text-4xl font-bold text-gradient  ">
                    {
                        isSuccess && <span> {metadata.payload.userName}'s shared brain</span>
                    }
                    
                </div>
                <div className="md:text-2xl cursor-default text-slate-800 text-lg font-[550] text-subHead mt-0 md:mt-2 lg:mt-3">
                    {
                        isSuccess && <span> Collection: {metadata?.payload.collectionName}</span>
                    }       
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
                    {
                        sharedData?.pages.map((group,i) => (
                            <Fragment key={i}>
                                {   
                                    group?.data?.payload?.content?.map((cardData :any, idx : number) => (       <CardElement 
                                        title={cardData.content.title}
                                        key={idx}
                                        collectionId={group.data.payload.collectionId}
                                        id={cardData.content.id}
                                        note={cardData.content.note}
                                        createdAt={cardData.content.createdAt}
                                        tags={cardData.content.tags}
                                        cardType={cardData.content.type} 
                                        layout={layout}
                                        link={cardData.content.hyperlink} 
                                        shared={true}
                                        />
                                    ))
                                }
                            </Fragment>
                        ))
                    }
                </div> 
            </div>
            <div className="mt-14"><ButtonEl onClickHandler={() => fetchNextPage()} disabled={!hasNextPage} placeholder="Load more..." particularStyle={`${hasNextPage ? " hover:scale-105 " : " border-slate-300 bg-slate-100 text-slate-400 "} `} buttonType={"loadMore"} /></div>
        </div>

    </div>
}