import { atom, useRecoilState } from 'recoil';

const deleteId = atom<number>({
    key : 'deleteId',
    default : -1
})
 
export const useDeleteID = () => useRecoilState(deleteId);