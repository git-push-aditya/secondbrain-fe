import type { genIconStyle } from "./particularIcons"

export const DeleteIcon = ({style} : {style: string}) => {
    return  <svg   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className={style +" cursor-pointer"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
  
}

export const ShareIcon = ({style} : {style: string}) => {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={style + " cursor-pointer"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
  </svg>
  
}

export const PlusIcon = ({style, dim} : {style?: string, dim?: string}) => {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" height={dim} width={dim}  viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className={style +" cursor-pointer"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
  
}

export const DropdownIcon = ({dim, style} : genIconStyle) => {
  return<svg xmlns="http://www.w3.org/2000/svg" width={dim} height={dim} className={`${style}`} viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
    </svg>
}


export const DropUpIcon = ({dim, style} : genIconStyle) => {
  return <svg width={dim} height={dim} className={`${style ?? " "}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 15L12 9L18 15" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

}


export const GridIcon = ({dim, style} : genIconStyle) => {
  return <svg 
  fill="#000000" 
  viewBox="-3.2 -3.2 38.40 38.40" 
  height={dim}
  width={dim}
  className={`${style}`}
  version="1.1" 
  xmlns="http://www.w3.org/2000/svg">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M30 32h-10c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2h10c1.105 0 2 0.895 2 2v10c0 1.105-0.895 2-2 2zM30 20h-10v10h10v-10zM30 14h-10c-1.105 0-2-0.896-2-2v-10c0-1.105 0.895-2 2-2h10c1.105 0 2 0.895 2 2v10c0 1.104-0.895 2-2 2zM30 2h-10v10h10v-10zM12 32h-10c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2h10c1.104 0 2 0.895 2 2v10c0 1.105-0.896 2-2 2zM12 20h-10v10h10v-10zM12 14h-10c-1.105 0-2-0.896-2-2v-10c0-1.105 0.895-2 2-2h10c1.104 0 2 0.895 2 2v10c0 1.104-0.896 2-2 2zM12 2h-10v10h10v-10z"></path> </g></svg>
}

export const ListIcon = ({dim, style} : genIconStyle) => {
  return <svg 
  viewBox="0 0 24 24" 
  height={dim}
  width={dim}
  className={`${style}`}
  fill="none" 
  xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 6L21 6.00078M8 12L21 12.0008M8 18L21 18.0007M3 6.5H4V5.5H3V6.5ZM3 12.5H4V11.5H3V12.5ZM3 18.5H4V17.5H3V18.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
}

export const RedirectIcon = ({dim, style, link} : genIconStyle) =>{
  return <a href={link} target="_blank" rel="noopener noreferrer" ><svg 
  fill="#000000" 
  viewBox="0 0 32 32" 
  height={dim}
  width={dim}
  className={`${style}`}
  version="1.1" 
  xmlns="http://www.w3.org/2000/svg">
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1.060 29.448c0.010 0 0.022 0 0.034-0.001 0.506-0.017 0.825-0.409 0.868-0.913 0.034-0.371 1.030-9.347 15.039-9.337l0.032 5.739c0 0.387 0.223 0.739 0.573 0.904 0.346 0.166 0.764 0.115 1.061-0.132l12.968-10.743c0.233-0.191 0.366-0.475 0.365-0.774s-0.136-0.584-0.368-0.774l-12.967-10.643c-0.299-0.244-0.712-0.291-1.061-0.128-0.349 0.166-0.572 0.518-0.572 0.903l-0.032 5.614c-5.811 0.184-10.312 2.053-13.229 5.467-4.748 5.556-3.688 13.63-3.639 13.966 0.074 0.49 0.433 0.85 0.926 0.85zM18.033 17.182h-0.002c-10.007 0.006-13.831 3.385-16.015 6.37 0.32-2.39 1.252-5.273 3.281-7.626 2.698-3.128 7.045-4.777 12.736-4.777 0.552 0 1-0.447 1-1v-4.493l10.389 8.542-10.389 8.622v-4.637c0-0.265-0.105-0.52-0.294-0.708-0.187-0.187-0.441-0.293-0.706-0.293z"></path> </g></svg></a>
}

export const CrossIcon = ({dim, style} : genIconStyle) => {
  return<svg width={dim} height={dim} color="gray" className={style} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <line stroke="currentColor" x1="20" y1="20" x2="80" y2="80" strokeWidth="7" strokeLinecap="round"/>
  <line stroke="currentColor" x1="80" y1="20" x2="20" y2="80" strokeWidth="7" strokeLinecap="round"/>
</svg>

}

export const CopyIcon = ({dim, style} : genIconStyle) => {
  return <svg  fill="#fff" className={style} height={dim} width={dim} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" enable-background="new 0 0 64 64" xmlSpace="preserve" strokeWidth={0}
 transform="matrix(-1, 0, 0, -1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke="currentColor"  strokeWidth="2"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Text-files"> <path d="M53.9791489,9.1429005H50.010849c-0.0826988,0-0.1562004,0.0283995-0.2331009,0.0469999V5.0228 C49.7777481,2.253,47.4731483,0,44.6398468,0h-34.422596C7.3839517,0,5.0793519,2.253,5.0793519,5.0228v46.8432999 c0,2.7697983,2.3045998,5.0228004,5.1378999,5.0228004h6.0367002v2.2678986C16.253952,61.8274002,18.4702511,64,21.1954517,64 h32.783699c2.7252007,0,4.9414978-2.1725998,4.9414978-4.8432007V13.9861002 C58.9206467,11.3155003,56.7043495,9.1429005,53.9791489,9.1429005z M7.1110516,51.8661003V5.0228 c0-1.6487999,1.3938999-2.9909999,3.1062002-2.9909999h34.422596c1.7123032,0,3.1062012,1.3422,3.1062012,2.9909999v46.8432999 c0,1.6487999-1.393898,2.9911003-3.1062012,2.9911003h-34.422596C8.5049515,54.8572006,7.1110516,53.5149002,7.1110516,51.8661003z M56.8888474,59.1567993c0,1.550602-1.3055,2.8115005-2.9096985,2.8115005h-32.783699 c-1.6042004,0-2.9097996-1.2608986-2.9097996-2.8115005v-2.2678986h26.3541946 c2.8333015,0,5.1379013-2.2530022,5.1379013-5.0228004V11.1275997c0.0769005,0.0186005,0.1504021,0.0469999,0.2331009,0.0469999 h3.9682999c1.6041985,0,2.9096985,1.2609005,2.9096985,2.8115005V59.1567993z"></path> <path d="M38.6031494,13.2063999H16.253952c-0.5615005,0-1.0159006,0.4542999-1.0159006,1.0158005 c0,0.5615997,0.4544001,1.0158997,1.0159006,1.0158997h22.3491974c0.5615005,0,1.0158997-0.4542999,1.0158997-1.0158997 C39.6190491,13.6606998,39.16465,13.2063999,38.6031494,13.2063999z"></path> <path d="M38.6031494,21.3334007H16.253952c-0.5615005,0-1.0159006,0.4542999-1.0159006,1.0157986 c0,0.5615005,0.4544001,1.0159016,1.0159006,1.0159016h22.3491974c0.5615005,0,1.0158997-0.454401,1.0158997-1.0159016 C39.6190491,21.7877007,39.16465,21.3334007,38.6031494,21.3334007z"></path> <path d="M38.6031494,29.4603004H16.253952c-0.5615005,0-1.0159006,0.4543991-1.0159006,1.0158997 s0.4544001,1.0158997,1.0159006,1.0158997h22.3491974c0.5615005,0,1.0158997-0.4543991,1.0158997-1.0158997 S39.16465,29.4603004,38.6031494,29.4603004z"></path> <path d="M28.4444485,37.5872993H16.253952c-0.5615005,0-1.0159006,0.4543991-1.0159006,1.0158997 s0.4544001,1.0158997,1.0159006,1.0158997h12.1904964c0.5615025,0,1.0158005-0.4543991,1.0158005-1.0158997 S29.0059509,37.5872993,28.4444485,37.5872993z"></path> </g> </g></svg>
}


export const Dasboard = ({dim, style} : genIconStyle) => {
  return <svg viewBox="0 0 24 24" 
  width={dim} height={dim} className={style} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 12C13 11.4477 13.4477 11 14 11H19C19.5523 11 20 11.4477 20 12V19C20 19.5523 19.5523 20 19 20H14C13.4477 20 13 19.5523 13 19V12Z" stroke="#000000" stroke-width="2" strokeLinecap="round"></path> <path d="M4 5C4 4.44772 4.44772 4 5 4H9C9.55228 4 10 4.44772 10 5V12C10 12.5523 9.55228 13 9 13H5C4.44772 13 4 12.5523 4 12V5Z" stroke="#000000" stroke-width="2" strokeLinecap="round"></path> <path d="M4 17C4 16.4477 4.44772 16 5 16H9C9.55228 16 10 16.4477 10 17V19C10 19.5523 9.55228 20 9 20H5C4.44772 20 4 19.5523 4 19V17Z" stroke="#000000" stroke-width="2" strokeLinecap="round"></path> <path d="M13 5C13 4.44772 13.4477 4 14 4H19C19.5523 4 20 4.44772 20 5V7C20 7.55228 19.5523 8 19 8H14C13.4477 8 13 7.55228 13 7V5Z" stroke="#000000" stroke-width="2" strokeLinecap="round"></path> </g></svg>
}