import { useEffect, useState, type SetStateAction } from "react";
import { ButtonEl } from "../components/button";
import type { AuthUser } from "../App";
import { useAuthInQuery,useAuthUpQuery } from '../api/auth/mutate';
import { useNavigate } from "react-router-dom";
 
interface AuthProps { 
    user: AuthUser | null;
    setUser: React.Dispatch<SetStateAction<AuthUser | null>>
}

const Auth = ({ user, setUser }: AuthProps) => {

    useEffect(()=>{
        
    },[]);

    const [emailUser, setEmailUser] = useState<string>("");
    const [userName,setUserName] = useState<string>("");
    const [authMode, setAuthMode] = useState<"logIn" | "signUp">("logIn");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const navigate = useNavigate();


    const inputStyle = "mt-3 px-3 shadow-lg/20 transition duration-200 ease-in-out border-2 border-white/0 rounded-md hover:border-black/80 hover:cursor-pointer w-full h-13 text-md text-slate-800 font-[600] font-inter bg-white";

    const { mutate:logIN , isError:inIsError, error:inError,isSuccess:inIsSuccess, data:inData, isPending: inIsPending } = useAuthInQuery();
    const { mutate:signUP , isError: upIsError, error:upError,isSuccess:upIsSuccess, data:upData, isPending:upIsPending } = useAuthUpQuery();

    const handleClick = () => {
        if(authMode === "logIn"){
            logIN({ userName, password, rememberMe });
        }else{
            signUP({userName,password,email:emailUser,rememberMe});
        }
    }

    useEffect(() => {
        if (inIsSuccess && inData?.data.status === "success") { 
            setUser({ userName:inData.data.payload.userName, profilePic:"fewfe", email:inData.data.payload.email });
        }
        if(upIsSuccess && upData?.data.status === "success"){
            setUser({userName:upData.data.payload.userName, profilePic:"fewfe", email:upData.data.payload.email});
        }
    }, [inIsSuccess,upIsSuccess,upData, inData]);

    useEffect(() => {
        if (user) {
            navigate("/user");
        }
    }, [user,navigate]);



    const handleGuestLogIn = () => {
        setUser({userName:'randomuser',profilePic:'ubuono',email:'dummy@doom.com'});
        logIN({userName:'randomuser',password:'Qwer1234+-*/',rememberMe:false});
    }


//on remember me sellect, save jwt as localstorage and not session storage
//pass in dummy data for username and password and auto click thesignin button and irrespective fo rememebr me clicked or not,save the cookie as session storage


//add bottom title or tob tile on image for large scree written second brain with logo and like a bottom flash flight(or top depending where name is ) and for small screens abovelogin or sign up
    return <div className="h-screen flex w-screen overflow-hidden">
        <div className="transition-all duration-300 ease-in-out hidden lg:block w-[62%] h-full bg-[#E4E7E6] overflow-hidden border-r-2 border-slate-500" >
            <img src="/authBg.png" className="transition-all duration-300 ease-in-out scale:108 authBreakPoint:scale-125 object-none w-full h-full " />
        </div>
        <div className="h-full transition-all duration-300 ease-in-out  w-full lg:w-[38%] bg-[#F5F5F6] lg:bg-white overflow-hidden cursor-default flex  justify-center items-center">
            <div className="w-[65%] mx-auto">
                <div className="text-6xl font-[550] font-notoSans text-[#080B0A] ">{authMode == "logIn" ? "Log in" : "Sign up"}</div>
                <div className="text-md font-[550] mt-2 text-gray-600 font-roboto ">{authMode == "logIn" ? "sign in to continue oraganizing" : "Sign up and start organizing your ideas"}</div>


                {authMode === "signUp" && <><div className="text-xl ml-1 font-[600] mt-10 text-[#080B0A] font-roboto">Enter email</div>
                <input type="text" placeholder="email@domain.com" onChange={(e) => setEmailUser(e.target.value)} value={emailUser} className={inputStyle} /> </>}


                <div className={`text-xl ml-1 font-[600] ${authMode === "signUp" ? "mt-6" : "mt-10"}  text-[#080B0A] font-roboto`}>Enter username</div>
                <input type="text" placeholder="oliver.graystone" onChange={(e) => setUserName(e.target.value)} value={userName} className={inputStyle} />

                
                <div className="text-xl ml-1 font-[600] mt-6 text-[#080B0A] font-roboto">Enter your secure password</div>
                <input type="password" placeholder={authMode === "signUp"? "rajmaChawal123" :"secret passkey"} onChange={(e) => setPassword(e.target.value)} value={password} className={inputStyle} />


                <div className="flex justify-between  items-center text-lg mt-7 px-2">
                    <label className="text-[#080B0A] cursor-pointer ">
                        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-[#94a3b8] mr-4 scale-160" /> Remember me
                    </label>
                    {authMode === "logIn" &&  <div className=" text-[#030303] font-[510] cursor-pointer text-md xl:text-lg font-roboto">Forgot password?</div>}
                </div>
                
               

                <ButtonEl onClickHandler={handleClick} buttonType={"authin"} placeholder={authMode === "signUp"?"Sign up" : "Sign in"}  particularStyle={`mt-6 rounded-sm ${(inIsPending || upIsPending) ? " animate-pulse " :  " " }`} />

                <div className="flex w-full items-center mt-2">
                    <hr className="w-[46%] border-t-2 border-gray-300 " />
                    <div className="w-[8%] text-center text-lg">or</div>
                    <hr className="w-[46%] border-t-2 border-gray-300 " />
                </div>

                
                <ButtonEl onClickHandler={handleGuestLogIn} buttonType={"authin"} placeholder="Continue as Guest" particularStyle="mt-2 rounded-sm"/>
                

                <div className="mt-10 text-center text-gray-600 font-robot font-[410] text-lg">{authMode === "logIn"? "New user ? Sign up now" : "Already have an account ? "}
                     <a><b className="cursor-pointer" onClick={() => setAuthMode((prev) => prev === "signUp" ? "logIn" : "signUp")}>{authMode === "signUp"?" Log In" :" Sign up"} </b></a>
                </div>
            </div>

        </div>
    </div>
}

export default Auth;