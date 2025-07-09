import { useEffect, useState, type SetStateAction } from "react";
import { ButtonEl } from "../components/button";
import type { AuthUser } from "../App";
import { useAuthInQuery, useAuthUpQuery, useCheckMe } from '../api/auth/mutate';
import { useNavigate } from "react-router-dom";
import { easeInOut, motion } from "framer-motion";
import { LogoIcon } from "../icons/particularIcons";

interface AuthProps {
    user: AuthUser | null;
    setUser: React.Dispatch<SetStateAction<AuthUser | null>>
}

const Auth = ({ user, setUser }: AuthProps) => {
    const { data: meReqData, refetch, isSuccess: meIsSuccess, isError: meIsError } = useCheckMe();

    useEffect(() => {
        if (meIsSuccess && meReqData?.data.status) {
            setUser({ userName: meReqData.data.payload.userName, profilePic: "fewfe", email: meReqData.data.payload.email });
        } else { }
    }, [meReqData, meIsSuccess, meIsError])

    const [emailUser, setEmailUser] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [authMode, setAuthMode] = useState<"logIn" | "signUp">("logIn");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const navigate = useNavigate();


    const inputStyle = "mt-3 px-3 shadow-lg/20 transition duration-200 ease-in-out border-2 border-white/0 rounded-md hover:border-black/80 hover:cursor-pointer w-full h-13 text-md text-slate-800 font-[600] font-inter bg-white";

    const { mutateAsync: logIN, isError: inIsError, error: inError, isSuccess: inIsSuccess, data: inData, isPending: inIsPending } = useAuthInQuery();
    const { mutateAsync: signUP, isError: upIsError, error: upError, isSuccess: upIsSuccess, data: upData, isPending: upIsPending } = useAuthUpQuery();

    const handleClick = async () => {
        if (authMode === "logIn") {
            await logIN({ userName, password, rememberMe });
            if (inIsSuccess && inData?.data.status === "success") {
                setUser({ userName: inData.data.payload.userName, profilePic: "fewfe", email: inData.data.payload.email });
            }
        } else {
            await signUP({ userName, password, email: emailUser, rememberMe });
            if (upIsSuccess && upData?.data.status === "success") {
                setUser({ userName: upData.data.payload.userName, profilePic: "fewfe", email: upData.data.payload.email });
            }
        }
    }
 

    useEffect(() => {
        if (user) {
            navigate("/user");
        }
    }, [user, navigate]);



    const handleGuestLogIn = () => {
        logIN(
            {
                userName: 'aditya.Dubey',
                password: 'Qwer1234+-*/',
                rememberMe: false,
            },
            {
                onSuccess: () => {
                    setUser({
                        userName: 'randomuser',
                        profilePic: 'ubuono',
                        email: 'dummy@doom.com',
                    });
                },
                onError: (err) => {
                    console.error('Guest login failed', err);
                },
            }
        );
    };

  
 
    return <div className="h-screen flex w-screen overflow-hidden">
        <div className="relative flex justify-center items-center transition-all duration-300 ease-in-out hidden lg:block w-[62%] h-full bg-[#E4E7E6] overflow-hidden border-r-2 border-slate-500" >
            <img src="/authBg.png" className="absolute transition-all duration-300 ease-in-out scale:108 authBreakPoint:scale-125 object-none w-full h-full opacity-30 " />
            <div className="relative cursor-default flex flex-col justify-center items-center text-black h-full -translate-y-20">
                <div className="flex items-center overflow-hidden">
                    <motion.div initial={{x:200, scale:1.2}} animate={{x:0,scale:1}} transition={{duration:0.8,ease:easeInOut}} className="opacity-100 scale:90 authBreakPoint:scale:100"  ><LogoIcon dim="140" /></motion.div>
                    <motion.div initial={{x:200,width:'0%',opacity:0.7 }} animate={{width:'100%',opacity:1, x:0}} transition={{duration:1, ease:easeInOut}} className="opacity-100 overflow-x-hidden whitespace-nowrap text-[3rem] authBreakPoint:text-[4rem] font-[600] text-[#13141e] text-shadow-lg">Second Brain App</motion.div>
                </div>
                <motion.ul
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5 ,ease:easeInOut}}
                    className="list-disc list-inside space-y-2 mt-4 text-left text-xl font-[650] text-black"
                    >
                        <li>Capture and Organize Your Thoughts Effortlessly</li>
                        <li>Access Anywhere, Anytime</li>
                        <li>Private, Secure, and Shareable</li>
                </motion.ul> 

            </div>
        </div>
        <div className="h-full transition-all duration-300 ease-in-out  w-full lg:w-[38%] bg-[#F5F5F6] lg:bg-white overflow-hidden cursor-default flex  justify-center items-center">
            <div className="w-[65%] mx-auto">
                <div className="text-6xl font-[550] font-notoSans text-[#080B0A] ">{authMode == "logIn" ? "Log in" : "Sign up"}</div>
                <div className="text-md font-[550] mt-2 text-gray-600 font-roboto ">{authMode == "logIn" ? "sign in to continue oraganizing" : "Sign up and start organizing your ideas"}</div>


                {
                    authMode === "signUp" && <><div className="text-xl ml-1 font-[600] mt-10 text-[#080B0A] font-roboto">Enter email</div>
                        <input type="text" placeholder="email@domain.com" onChange={(e) => setEmailUser(e.target.value)} value={emailUser} className={inputStyle} /> 
                    </>
                }


                <div className={`text-xl ml-1 font-[600] ${authMode === "signUp" ? "mt-6" : "mt-10"}  text-[#080B0A] font-roboto`}>Enter username</div>
                <input type="text" placeholder="oliver.graystone" onChange={(e) => setUserName(e.target.value)} value={userName} className={inputStyle} />


                <div className="text-xl ml-1 font-[600] mt-6 text-[#080B0A] font-roboto">Enter your secure password</div>
                <input type="password" placeholder={authMode === "signUp" ? "rajmaChawal123" : "secret passkey"} onChange={(e) => setPassword(e.target.value)} value={password} className={inputStyle} />


                <div className="flex justify-between  items-center text-lg mt-7 px-2">
                    <label className="text-[#080B0A] cursor-pointer ">
                        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-[#94a3b8] mr-4 scale-160" /> Remember me
                    </label>
                    {authMode === "logIn" && <div className=" text-[#030303] font-[510] cursor-pointer text-md xl:text-lg font-roboto">Forgot password?</div>}
                </div>



                <ButtonEl onClickHandler={() => handleClick()} buttonType={"authin"} placeholder={authMode === "signUp" ? "Sign up" : "Sign in"} particularStyle={`mt-6 rounded-sm ${(inIsPending || upIsPending) ? " animate-pulse " : " "}`} />

                <div className="flex w-full items-center mt-2">
                    <hr className="w-[46%] border-t-2 border-gray-300 " />
                    <div className="w-[8%] text-center text-lg">or</div>
                    <hr className="w-[46%] border-t-2 border-gray-300 " />
                </div>


                <ButtonEl onClickHandler={() => handleGuestLogIn()} buttonType={"authin"} placeholder="Continue as Guest" particularStyle="mt-2 rounded-sm" />


                <div className="mt-10 text-center text-gray-600 font-robot font-[410] text-lg">{authMode === "logIn" ? "New user ? Sign up now" : "Already have an account ? "}
                    <a><b className="cursor-pointer" onClick={() => setAuthMode((prev) => prev === "signUp" ? "logIn" : "signUp")}>{authMode === "signUp" ? " Log In" : " Sign up"} </b></a>
                </div>
            </div>

        </div>
    </div>
}

export default Auth;