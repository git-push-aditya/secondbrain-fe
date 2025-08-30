import { useEffect, useState, type SetStateAction } from "react";
import ButtonEl from "../components/button";
import type { AuthUser } from "../App";
import { useAuthInQuery, useAuthUpQuery, useCheckMe } from '../api/auth/mutate';
import { useNavigate } from "react-router-dom";
import { easeInOut, motion } from "framer-motion";
import { LogoIcon } from "../icons/particularIcons";
import { getProfilePicPath } from "../utils/profilePhoto";

export type profilePicId = 'b1' | 'b2' | 'b3' | 'g1' | 'g2' | 'g3';

interface AuthProps {
    user: AuthUser | null;
    setUser: React.Dispatch<SetStateAction<AuthUser | null>>
}

const Auth = ({ user, setUser }: AuthProps) => {
    const { data: meReqData, isSuccess: meIsSuccess, isError: meIsError } = useCheckMe();

    useEffect(() => {
        if (meIsSuccess && meReqData?.data.status) {
            setUser({ userName: meReqData.data.payload.userName, profilePic: getProfilePicPath(meReqData.data.payload.profilePic), email: meReqData.data.payload.email });
        }
    }, [meReqData, meIsSuccess, meIsError])

    const [emailUser, setEmailUser] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [authMode, setAuthMode] = useState<"logIn" | "signUp">("logIn");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [profilePic, setProfilePic] = useState<profilePicId | "">("");

    const navigate = useNavigate();

    const [userError, setUserError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");


    const inputStyle = "mt-3 px-3 shadow-lg/20 transition duration-200 ease-in-out border-2 border-white/0 rounded-md hover:border-black/80 hover:cursor-pointer w-full h-13 text-md text-slate-800 font-[600] font-inter bg-white";

    const { mutateAsync: logIN, isPending: inIsPending } = useAuthInQuery();
    const { mutateAsync: signUP, isPending: upIsPending } = useAuthUpQuery();


    const handleClick = async () => {
        const username = userName.trim();
        const pass = password.trim();

        if (authMode === "logIn") {


            if (username === "" || pass === "") {
                setUserError(true);
                setErrorMessage("Username and Password are required fields");
                return;
            }

            await logIN(
                {
                    userName, password, rememberMe
                }, {
                onSuccess: (data) => {
                    setUser({
                        userName: data.data.payload.userName,
                        profilePic: getProfilePicPath(data.data.payload.profilePic),
                        email: data.data.payload.email
                    });
                    setErrorMessage("");
                    setUserError(false);   
                }, onError: () => {
                    setUserError(true);
                    setErrorMessage("That didn’t match our records. Please try again.");
                    return;
                }
            }
            );
        } else {

            if (
                !(password.length >= 8) ||
                !(/[a-z]/.test(password)) ||    
                !(/[A-Z]/.test(password)) ||    
                !(/\d/.test(password)) ||       
                !(/[@$!%*?&]/.test(password))   
            ) {
                setUserError(true);
                setErrorMessage("Password too weak");
                return;
            }

            const profilePicSelected = profilePic !== "" ? profilePic : "b1";
            const email = emailUser.trim();
            if (email === "" || username === "" || pass === "") {
                setUserError(true);
                setErrorMessage("All field are necessary.");
                return;
            }
            await signUP(
                {
                    userName, password, email, rememberMe, profilePic: profilePicSelected
                }, {
                onSuccess: (data) => {
                    setUser({ userName: data.data.payload.userName, profilePic: getProfilePicPath(data.data.payload.profilePic), email: data.data.payload.email });
                    setErrorMessage("");
                    setUserError(false);
                }, onError: () => {
                    setUserError(true);
                    setErrorMessage("Either username or email already in use.");
                    return;
                }
            }
            );
        }
    }

    const chnageAuthMode = () => {
        setAuthMode((prev) => prev === "signUp" ? "logIn" : "signUp");
        setUserName("");
        setPassword("");
        setErrorMessage("");
        setUserError(false);
    }


    useEffect(() => {
        if (user) {
            navigate("/user");
        }
    }, [user, navigate]);



    const handleGuestLogIn = () => {
        logIN(
            {
                userName: 'randomuser',
                password: 'Qwer1234+-*/',
                rememberMe: true,
            }, {
            onSuccess: () => {
                setUser({
                    userName: 'randomuser',
                    profilePic: getProfilePicPath('b1'),
                    email: 'dummy@doom.com'
                });
            },
            onError: (err) => {
                console.error('Guest login failed', err);
            },
        }
        );
    };

    const profilePicStyle = "rounded-[4rem] size-18 scale-95 hover:cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out ";

    const selectProfilePic = (name: profilePicId) => {
        if (profilePic === name) {
            setProfilePic("");
        } else {
            setProfilePic(name);
        }

    }


    return <div className="h-screen flex w-screen ">
        <div className="relative flex justify-center items-center transition-all duration-300 ease-in-out hidden lg:block w-[62%] h-full bg-[#E4E7E6] overflow-hidden border-r-2 border-slate-500" >
            <video src="./brain.mp4" autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover" ></video>

            <div className="relative cursor-default flex flex-col justify-center items-center text-black h-full -translate-y-20">
                <div className="flex items-center overflow-hidden">
                    <motion.div initial={{ x: 200, scale: 1.2 }} animate={{ x: 0, scale: 1 }} transition={{ duration: 0.8, ease: easeInOut }} className="opacity-100 scale:90 authBreakPoint:scale:100"  ><LogoIcon dim="140" /></motion.div>
                    <motion.div initial={{ x: 200, width: '0%', opacity: 0.7 }} animate={{ width: '100%', opacity: 1, x: 0 }} transition={{ duration: 1, ease: easeInOut }} className="opacity-100 overflow-x-hidden whitespace-nowrap text-[3rem] authBreakPoint:text-[4rem] font-[600] text-white text-shadow-lg">Second Brain App</motion.div>
                </div>
                <motion.ul
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: easeInOut }}
                    className="list-disc list-inside space-y-2 mt-4 text-left text-xl font-[650] text-white"
                >
                    <li>Capture and Organize Your Thoughts Effortlessly</li>
                    <li>Access Anywhere, Anytime</li>
                    <li>Private, Secure, and Shareable</li>
                </motion.ul>

            </div>
        </div>
        <div className="min-h-screen transition-all duration-300 ease-in-out  w-full lg:w-[38%] bg-[#F5F5F6] lg:bg-white overflow-auto cursor-default  ">
            <div className="min-h-full flex items-center justify-center">
                <div className="w-[65%]  h-full py-8">
                    <div
                        className="text-6xl font-[550] font-welcome text-[#080B0A] ">{authMode == "logIn" ? "Log in" : "Sign up"}
                    </div>
                    <div
                        className="text-md font-[550] mt-2 text-gray-600 font-welcome ">
                        {authMode == "logIn" ? "sign in to continue oraganizing" : "Sign up and start organizing your ideas"}
                    </div>


                    {
                        authMode === "signUp" && <>
                            <div
                                className="text-xl ml-1 font-[600] mt-6 text-[#080B0A] font-roboto">
                                Enter email
                            </div>
                            <input
                                type="text"
                                placeholder="email@domain.com"
                                onChange={(e) => setEmailUser(e.target.value)}
                                value={emailUser}
                                className={inputStyle}
                            />
                        </>
                    }


                    <div 
                        className={`text-xl ml-1 font-[600] ${authMode === "signUp" ? "mt-6" : "mt-10"}  text-[#080B0A] font-roboto`}>
                            Enter username
                    </div>
                    <input 
                        type="text" 
                        placeholder="oliver.graystone" 
                        onChange={(e) => setUserName(e.target.value)} value={userName} 
                        className={inputStyle} 
                    />


                    <div
                        className="text-xl ml-1 font-[600] mt-6 text-[#080B0A] font-roboto">
                        Enter your secure password
                    </div>
                    <input
                        type="password"
                        placeholder={authMode === "signUp" ? "rajmaChawal123" : "secret passkey"} onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className={inputStyle}
                        title="Password must be 8+ characters with a mix of upper & lowercase letters, numbers, and a symbol."
                    />

                    {
                        authMode === 'signUp' && <div>
                            <div className={`text-xl ml-1 font-[600] mt-6 text-[#080B0A] font-roboto`}> Select profile photo</div>
                            <div>
                                <div className="flex justify-around mt-4 py-2 overflow-x-auto scrollbarSB-x gap-1 lg:gap-0">

                                    <img src="/dp/b2.png" onClick={() => selectProfilePic("b2")} className={`${profilePicStyle} ${profilePic === "b2" ? " scale-109" : profilePic !== "" ? " opacity-50 " : ""}`} />
                                    <img src="/dp/b3.png" onClick={() => selectProfilePic("b3")} className={`${profilePicStyle} ${profilePic === "b3" ? " scale-109" : profilePic !== "" ? " opacity-50 " : ""}`} />
                                    <img src="/dp/b1.png" onClick={() => selectProfilePic("b1")} className={`${profilePicStyle} ${profilePic === "b1" ? " scale-109" : profilePic !== "" ? " opacity-50 " : ""}`} />
                                    <img src="/dp/g1.png" onClick={() => selectProfilePic("g1")} className={`${profilePicStyle} ${profilePic === "g1" ? " scale-109" : profilePic !== "" ? " opacity-50 " : ""}`} />
                                    <img src="/dp/g2.png" onClick={() => selectProfilePic("g2")} className={`${profilePicStyle} ${profilePic === "g2" ? " scale-109" : profilePic !== "" ? " opacity-50 " : ""}`} />
                                    <img src="/dp/g3.png" onClick={() => selectProfilePic("g3")} className={`${profilePicStyle} ${profilePic === "g3" ? " scale-109" : profilePic !== "" ? " opacity-50 " : ""}`} />
                                </div>
                                <div></div>
                            </div>
                        </div>
                    }

                    <div className="flex justify-between  items-center text-lg mt-7 px-2">
                        <label className="text-[#080B0A] cursor-pointer ">
                            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-[#94a3b8] mr-4 scale-160 cursor-pointer" /> Remember me
                        </label>
                    </div>

                    <div
                        className="text-lg text-red-500 font-roboto text-center m-1">
                            {errorMessage}
                    </div>


                    <ButtonEl
                        onClickHandler={() => handleClick()}
                        buttonType={"authin"}
                        placeholder={authMode === "signUp" ? "Sign up" : "Sign in"}
                        particularStyle={`mt-6 rounded-sm font-inter ${(inIsPending || upIsPending) ? " animate-pulse " : " "}`}
                    />

                    <div className="flex w-full items-center mt-2">
                        <hr className="w-[46%] border-t-2 border-gray-300 " />
                        <div className="w-[8%] text-center text-lg">or</div>
                        <hr className="w-[46%] border-t-2 border-gray-300 " />
                    </div>


                    <ButtonEl
                        onClickHandler={() => handleGuestLogIn()}
                        buttonType={"authin"}
                        placeholder="Continue as Guest"
                        particularStyle="mt-2 rounded-sm text-inter"
                    />


                    <div
                        className="mt-10 text-center text-gray-600 font-inter font-[410] text-lg">{authMode === "logIn" ? "New user ? Sign up now" : "Already have an account ? "}
                        <a>
                            <b className="cursor-pointer" 
                                onClick={chnageAuthMode}
                            >
                                {authMode === "signUp" ? " Log In" : " Sign up"}
                            </b>
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </div>
}

export default Auth;