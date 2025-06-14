import { atom, useRecoilState } from 'recoil';

const tabAtom = atom<string>({
    key : 'tab',
    default : 'dashboard'
})

const popUpAtom = atom<boolean>({
    key : 'popUp',
    default : false
})



export const  useTabAtom = () => useRecoilState(tabAtom);

export const  usePopUpAtom = () => useRecoilState(popUpAtom);