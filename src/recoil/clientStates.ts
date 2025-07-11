import { atom, useRecoilState, useSetRecoilState } from 'recoil';

const tabAtom = atom<string>({
    key : 'tab',
    default : 'dashboard'
})

const popUpAtom = atom<boolean>({
    key : 'popUp',
    default : false
})

const popUpMessage = atom<string>({
    key : "message",
    default : "Link coppied to clipboard!!"
})

const cardsCount = atom<number>({
    key : "card-count",
    default : 0
})



export const  useTabAtom = () => useRecoilState(tabAtom);

export const  usePopUpAtom = () => useRecoilState(popUpAtom);

export const useCardCountAtom = () => useRecoilState(cardsCount);

export const usePopUpMessage = () => useRecoilState(popUpMessage);