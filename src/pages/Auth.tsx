import { useState, type SetStateAction } from "react";
import { ButtonEl } from "../components/button";
import type { AuthUser } from "../App";

interface AuthProps {
    user: AuthUser | null;
    setUser: React.Dispatch<SetStateAction<AuthUser | null>>
}

const Auth = ({ user, setUser }: AuthProps) => {

    const [emailUser, setEmailUser] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);

//on remember me sellect, save jwt as localstorage and not session storage
//pass in dummy data for username and password and auto click thesignin button and irrespective fo rememebr me clicked or not,save the cookie as session storage

    return <div className="h-screen flex w-screen overflow-hidden">
        <div className="w-[62%] h-full bg-[#E4E7E6] overflow-hidden border-r-3 border-slate-500" >
            <img src="/authBg.png" className="scale-125 object-none w-full h-full " />
        </div>
        <div className="h-full w-[38%] overflow-hidden cursor-default flex items-center">
            <div className="w-[65%] mx-auto">
                <div className="text-6xl font-[600] font-notoSans text-[#080B0A] ">Log in</div>
                <div className="text-md font-[600] mt-1 text-gray-600 font-roboto ">sign in to continue oraganizing</div>


                <div className="text-lg font-[600] mt-10 text-[#080B0A] font-roboto">Enter your email or username</div>
                <input type="text" placeholder="email@domain.com" onChange={(e) => setEmailUser(e.target.value)} value={emailUser} className="mt-3 px-3 shadow-md transition duration-200 ease-in-out border-2 border-white hover:border-black/60 hover:cursor-pointer w-full h-13 text-lg text-slate-800 font-[550] font-interr" />


                <div className="text-lg font-[600] mt-6 text-[#080B0A] font-roboto">Enter your secure password</div>
                <input type="password" placeholder="secret passkey" onChange={(e) => setPassword(e.target.value)} value={password} className="mt-3 px-3 shadow-md transition duration-200 ease-in-out border-2 border-white hover:border-black/60 hover:cursor-pointer w-full h-13 text-lg text-slate-800 font-[550] font-inter" />

                <div className="flex justify-between  items-center text-lg mt-7 px-2">
                    <label className="text-[#080B0A] cursor-pointer ">
                        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-[#94a3b8] mr-4 scale-160" /> Remember me
                    </label>
                    <div className=" text-[#030303] font-[510] cursor-pointer text-lg font-roboto">Forgot password?</div>
                </div>

                <ButtonEl onClickHandler={function (): void {
                    alert("clicked");
                }} buttonType={"authin"} placeholder="Sign in" particularStyle="mt-6" />

                <div className="flex w-full items-center mt-2">
                    <hr className="w-[46%] border-t-2 border-gray-300 " />
                    <div className="w-[8%] text-center text-lg">or</div>
                    <hr className="w-[46%] border-t-2 border-gray-300 " />
                </div>

                
                <ButtonEl onClickHandler={function (): void {
                    alert("clicked");
                }} buttonType={"authin"} placeholder="Continue as Guest" particularStyle="mt-2"/>
                

                <div className="mt-10 text-center text-gray-600 font-robot font-[410] text-lg">
                    New user ? Sign up now <a><b className="cursor-pointer">Sign up</b></a>
                </div>
            </div>

        </div>
    </div>
}

export default Auth;