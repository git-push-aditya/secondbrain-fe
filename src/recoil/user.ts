import { atom, useRecoilState } from "recoil"; 
import type { AuthUser } from "../App";

export const user = atom<AuthUser | null>({
    key : "userProfile",
    default : null
})

export const useUserProfile = () => useRecoilState(user);
