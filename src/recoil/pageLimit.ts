import { atom, useRecoilState } from 'recoil';

const pageAtom = atom<number>({
    key : 'page',
    default : 1
})


const limitAtom = atom<number>({
    key : 'limit',
    default : 12
})

export const  usePageAtom = () => useRecoilState(pageAtom);
export const  useLimitAtom = () => useRecoilState(limitAtom);
