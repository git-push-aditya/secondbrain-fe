import { atom, useRecoilState } from 'recoil';

const tabAtom = atom<string>({
    key : 'tab',
    default : 'dashboard'
})

export const  useTabAtom = () => useRecoilState(tabAtom);
