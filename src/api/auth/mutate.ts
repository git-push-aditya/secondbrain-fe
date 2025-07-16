import { useMutation, useQuery } from "@tanstack/react-query";
import axios from 'axios';

interface authInTypes{
    userName : String;
    password : String;
    rememberMe: Boolean;
}
 
interface authUpTypes extends authInTypes{
  email : string;
  gender : 'male' | 'female';
}


const logIn = ({userName,password,rememberMe}:authInTypes) => {
    return axios.post('http://localhost:2233/auth/signin',
        { userName, password, rememberMe},
        {withCredentials: true}
    )
}

const signUp = ({email, userName, password, rememberMe,gender}: authUpTypes) => {
  return axios.post('http://localhost:2233/auth/signup',
    {userName,email,rememberMe,password, gender},
    {withCredentials:true}
  )
}

const meRequest = () => {
  return axios.get('http://localhost:2233/me',{
    withCredentials:true
  })
}

const logout = () => { 
  return axios.post('http://localhost:2233/auth/logout',{},{
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
    mutationFn: ({email, userName, password, rememberMe, gender}: authUpTypes) =>
      signUp({email, userName, password, rememberMe , gender}) 
  })
}


export const useCheckMe = () => {
  return useQuery({
    queryKey: ['fetchMe'],
    queryFn: meRequest,
    enabled: true,
  }); 
}


export const useLogOutQuery = () => {
  return useMutation({
    mutationFn : logout,
    mutationKey : ["signup"]
  })
}