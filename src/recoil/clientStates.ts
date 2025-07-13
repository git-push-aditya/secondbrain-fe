import { atom, useRecoilState, useSetRecoilState } from 'recoil';

const tabAtom = atom<string>({
    key: 'tab',
    default: 'dashboard'
})

const popUpAtom = atom<boolean>({
    key: 'popUp',
    default: false
})

const popUpMessage = atom<string>({
    key: "message",
    default: "Link coppied to clipboard!!"
})

const cardsCount = atom<number>({
    key: "card-count",
    default: 0
})

const currentCollection = atom<{ name: string, id: number }>({
    key: "collection",
    default: { name: "", id: -1 }
})

const currentCommmunity = atom<{ name: string, id: number }>({
    key: "currentCommunity",
    default: { name: "", id: -1 }
})

export const useTabAtom = () => useRecoilState(tabAtom);

export const usePopUpAtom = () => useRecoilState(popUpAtom);

export const useCardCountAtom = () => useRecoilState(cardsCount);

export const usePopUpMessage = () => useRecoilState(popUpMessage);

export const useCurrentCommunity = () => useRecoilState(currentCommmunity);

export const useCurrentCollection = () => useRecoilState(currentCollection);