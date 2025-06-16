import { atom, useRecoilState } from 'recoil';

const tabAtom = atom<string>({
    key : 'tab',
    default : 'dashboard'
})

const popUpAtom = atom<boolean>({
    key : 'popUp',
    default : false
})

const cardsCount = atom<number>({
    key : "card-count",
    default : 0
})



export const  useTabAtom = () => useRecoilState(tabAtom);

export const  usePopUpAtom = () => useRecoilState(popUpAtom);

export const useCardCountAtom = () => useRecoilState(cardsCount);