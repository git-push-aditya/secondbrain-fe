import { useMutation } from "@tanstack/react-query";
import axios from 'axios';

interface authInTypes{
    userName : String;
    password : String;
    rememberMe: Boolean;
}
 
interface authUpTypes extends authInTypes{
  email : string;
}


const logIn = ({userName,password,rememberMe}:authInTypes) => {
    return axios.post('http://localhost:2233/auth/signin',
        { userName, password, rememberMe },
        {withCredentials: true}
    )
}

const signUp = ({email, userName, password, rememberMe}: authUpTypes) => {
  return axios.post('http://localhost:2233/auth/signup',
    {userName,email,rememberMe,password},
    {withCredentials:true}
  )
}


export const useAuthInQuery = ()=> {
  return useMutation<any, Error, authInTypes>({
    mutationFn: ({ userName, password, rememberMe }: authInTypes) =>
      logIn({ userName, password, rememberMe })
  });
};


export const useAuthUpQuery = () => {
  return useMutation<any, Error, authUpTypes>({
    mutationFn: ({email, userName, password, rememberMe}: authUpTypes) =>
      signUp({email, userName, password, rememberMe}) 
  })
}