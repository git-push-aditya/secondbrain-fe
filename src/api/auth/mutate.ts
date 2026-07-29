import { useMutation, useQuery } from "@tanstack/react-query";
import axios from 'axios'; 
import type {profilePicId} from "../../pages/Auth.tsx";

interface authInTypes{
    userName : String;
    password : String;
    rememberMe: Boolean;
}
 
interface authUpTypes extends authInTypes{
  email : string;
  profilePic : profilePicId;
}


const logIn = ({userName,password,rememberMe}:authInTypes) => {
    return axios.post(`${import.meta.env.VITE_BASE_URL}/auth/signin`  ,
        { userName, password, rememberMe},
        {withCredentials: true}
    )
}

const signUp = ({email, userName, password, rememberMe,profilePic}: authUpTypes) => {
  return axios.post(`${import.meta.env.VITE_BASE_URL}/auth/signup`,
    {userName,email,rememberMe,password, profilePic},
    {withCredentials:true}
  )
}

const meRequest = () => {
  return axios.get(`${import.meta.env.VITE_BASE_URL}/me`,{
    withCredentials:true
  })
}

const logout = () => { 
  return axios.post(`${import.meta.env.VITE_BASE_URL}/auth/logout`,{},{
    withCredentials: true
  });
}




/////////////////////////////
export const useAuthInQuery = ()=> {
  return useMutation<any, Error, authInTypes>({
    mutationFn: ({ userName, password, rememberMe }: authInTypes) =>
      logIn({ userName, password, rememberMe })
  });
};


export const useAuthUpQuery = () => {
  return useMutation<any, Error, authUpTypes>({
    mutationFn: ({email, userName, password, rememberMe, profilePic }: authUpTypes) =>
      signUp({email, userName, password, rememberMe , profilePic}) 
  })
}


export const useCheckMe = () => {
  return useQuery({
    queryKey: ['fetchMe'],
    queryFn: meRequest,
    enabled: true,
    /* A 401 here is the answer ("not logged in"), not a fault worth retrying —
       the default 3 retries with backoff delayed every visit, and stalled the
       auth page for ~10s whenever the backend was unreachable. */
    retry: false,
  }); 
}


export const useLogOutQuery = () => {
  return useMutation({
    mutationFn : logout,
    mutationKey : ["signup"]
  })
}