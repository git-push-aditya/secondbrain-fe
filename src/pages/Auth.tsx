import { useEffect, useRef, useState, type ReactElement, type SetStateAction } from "react";
import axios from "axios";
import type { AuthUser } from "../App";
import { useAuthInQuery, useAuthUpQuery, useCheckMe } from '../api/auth/mutate';
import { useSeedListCache } from '../api/user/query';
import { useNavigate } from "react-router-dom";
import Dither from "../components/Dither";
import DitherBranches from "../components/DitherBranches";
import { CardStack } from "../components/ui/card-stack";
import { Button01 } from "../components/ui/nextjsshop-button";
import { getProfilePicPath } from "../utils/profilePhoto";
import { authErrorMessage } from "../utils/authError";
import { THEMES, hexRgb, type profilePicId } from "../utils/theme";

export type { profilePicId };   // re-exported: api/auth/mutate.ts imports it from here

interface AuthProps {
    user: AuthUser | null;
    setUser: React.Dispatch<SetStateAction<AuthUser | null>>
}

const AVATARS: { id: profilePicId; title: string; imageSrc: string }[] = [
    { id: "b2", title: "Avatar b2", imageSrc: "/dp/b2.png" },
    { id: "b3", title: "Avatar b3", imageSrc: "/dp/b3.png" },
    { id: "b1", title: "Avatar b1", imageSrc: "/dp/b1.png" },
    { id: "g1", title: "Avatar g1", imageSrc: "/dp/g1.png" },
    { id: "g2", title: "Avatar g2", imageSrc: "/dp/g2.png" },
    { id: "g3", title: "Avatar g3", imageSrc: "/dp/g3.png" }
];

const GithubMark = () => <svg viewBox="0 0 24 24" className="size-full" fill="#171515"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>;

const YoutubeMark = () => <svg viewBox="0 0 24 24" className="size-full" fill="#FF0033"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;

const XMark = () => <svg viewBox="0 0 30 30" className="size-full" fill="#0B0B0F"><path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z" /></svg>;

// `at` is the card centre in stage coords (0..1) — the dithered branches grow
// from the brain's centre out to exactly these points.
const ORBIT = [
    { key: "youtube", mark: <YoutubeMark />, at: [0.74, 0.12], delay: "0s" },
    { key: "github", mark: <GithubMark />, at: [0.1, 0.38], delay: "0.9s" },
    { key: "x", mark: <XMark />, at: [0.82, 0.72], delay: "1.8s" },
    // kept as an <img> so its gradient ids stay scoped to the file
    { key: "reddit", mark: <img src="/dp/reddit-icon.svg" alt="" className="size-full object-contain" />, at: [0.2, 0.86], delay: "2.7s" }
];

const FEED_POINTS = ORBIT.map(o => o.at);

const Chevron = ({ left }: { left: boolean }) => <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d={left ? "M15 5 8 12l7 7" : "M9 5l7 7-7 7"} />
</svg>;

const EyeIcon = ({ off }: { off: boolean }) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M3 21 21 3" />}
</svg>;

const Field = ({ label, value, onValueChange, type = "text", placeholder, title, trailing }: {
    label: string;
    value: string;
    onValueChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    title?: string;
    trailing?: ReactElement;
}) => <div className="mt-4">
        <label className="block text-[0.8rem] font-[600] text-[#1A1A21] mb-1.5">{label}</label>
        <div className="relative">
            <input
                type={type}
                value={value}
                title={title}
                placeholder={placeholder}
                onChange={(e) => onValueChange(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3.5 pr-11 text-[0.9rem] font-[500] text-[#1A1A21] outline-none transition-colors duration-200 placeholder:text-gray-400 focus:border-[#4338E5]"
            />
            {trailing && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{trailing}</div>}
        </div>
    </div>;

const Auth = ({ user, setUser }: AuthProps) => {
    const { data: meReqData, isSuccess: meIsSuccess, isError: meIsError } = useCheckMe();
    const seedListCache = useSeedListCache();

    useEffect(() => {
        if (meIsSuccess && meReqData?.data.status) {
            seedListCache(meReqData);
            setUser({ userName: meReqData.data.payload.userName, profilePic: getProfilePicPath(meReqData.data.payload.profilePic), email: meReqData.data.payload.email });
        }
    }, [meReqData, meIsSuccess, meIsError])

    const [emailUser, setEmailUser] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [authMode, setAuthMode] = useState<"logIn" | "signUp">("logIn");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [profilePic, setProfilePic] = useState<profilePicId | "">("");
    const [step, setStep] = useState<"details" | "avatar">("details");
    const deck = useRef<{ prev: () => void; next: () => void } | null>(null);

    // the carousel sets profilePic as you scroll, so the panel retints live
    const theme = THEMES[profilePic || "b1"];

    const navigate = useNavigate();

    const [userError, setUserError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");


    const { mutateAsync: logIN, isPending: inIsPending } = useAuthInQuery();
    const { mutateAsync: signUP, isPending: upIsPending } = useAuthUpQuery();
    const { mutateAsync: guestLogIN, isPending: guestIsPending } = useAuthInQuery();


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
                    seedListCache(data);
                    setUser({
                        userName: data.data.payload.userName,
                        profilePic: getProfilePicPath(data.data.payload.profilePic),
                        email: data.data.payload.email
                    });
                    setErrorMessage("");
                    setUserError(false);
                }, onError: (err) => {
                    setUserError(true);
                    setErrorMessage(authErrorMessage(err, "That didn’t match our records. Please try again."));
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

            const email = emailUser.trim();
            if (email === "" || username === "" || pass === "") {
                setUserError(true);
                setErrorMessage("All field are necessary.");
                return;
            }

            // details check out -> pick an avatar; the account is created from that step
            setErrorMessage("");
            setUserError(false);
            setStep("avatar");
        }
    }

    const submitSignUp = async () => {
        await signUP(
            {
                userName, password, email: emailUser.trim(), rememberMe,
                profilePic: profilePic !== "" ? profilePic : "b1"
            }, {
            onSuccess: (data) => {
                seedListCache(data);
                setUser({ userName: data.data.payload.userName, profilePic: getProfilePicPath(data.data.payload.profilePic), email: data.data.payload.email });
                setErrorMessage("");
                setUserError(false);
            }, onError: (err) => {
                setUserError(true);
                setErrorMessage(authErrorMessage(err, "Either username or email already in use."));
                /* Only bounce back to the details step when the details are the
                   problem — on a network failure the avatar pick is still valid and
                   they can just retry. */
                if (axios.isAxiosError(err) && err.response) setStep("details");
            }
        }
        );
    }

    const chnageAuthMode = () => {
        setAuthMode((prev) => prev === "signUp" ? "logIn" : "signUp");
        setStep("details");
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
        guestLogIN(
            {
                userName: 'guest',
                password: 'Qwer1234+-*/',
                rememberMe: true,
            }, {
            onSuccess: (data) => {
                seedListCache(data);
                setUser({
                    userName: 'guest',
                    profilePic: getProfilePicPath('b1'),
                    email: 'guest@dummy.com'
                });
            },
            onError: (err) => {
                console.error('Guest login failed', err);
            },
        }
        );
    };


    /* h-screen first, then h-dvh: browsers without dvh keep the vh value, newer
       ones override it and stop the mobile toolbar clipping the panel. */
    return <div className="h-screen h-dvh w-full bg-[#F1F2F5] font-jakarta">
        <div className="flex h-full w-full overflow-hidden bg-white">

            {/* ---- form column ---- */}
            {/* Fluid, not a fixed half: the form takes what it needs and the panel
                absorbs the rest, so this holds from a phone up to an ultrawide
                without a breakpoint per size. min-w-0 lets it actually shrink. */}
            <div className="paper-rails scrollbar-hidden flex min-w-0 flex-1 flex-col overflow-y-auto cursor-default px-[clamp(1rem,5vw,3.5rem)] py-[clamp(1rem,3vh,2rem)] lg:max-w-[clamp(28rem,42%,40rem)]">
                <div className="flex flex-1 flex-col justify-center">
                    <div className="mx-auto w-full max-w-[clamp(17rem,88%,23rem)]">
                        {step === "details" ? <>
                        <h1 className="text-center text-[1.65rem] sm:text-[1.9rem] leading-tight font-[600] tracking-[-0.02em] text-[#1A1A21]">
                            {authMode === "logIn" ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="mt-2 text-center text-[0.85rem] font-[400] text-gray-500">
                            {authMode === "logIn"
                                ? "Enter your username and password to access your account."
                                : "Fill in your details to start your second brain."}
                        </p>

                        <div className="mt-8">
                            {authMode === "signUp" &&
                                <Field label="Email" placeholder="you@company.com"
                                    value={emailUser} onValueChange={setEmailUser} />
                            }

                            <Field label="Username" placeholder="oliver.graystone"
                                value={userName} onValueChange={setUserName} />

                            <Field label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder={authMode === "signUp" ? "8+ chars, A-z, 0-9, symbol" : "••••••••"}
                                title="Password must be 8+ characters with a mix of upper & lowercase letters, numbers, and a symbol."
                                value={password} onValueChange={setPassword}
                                trailing={
                                    <button type="button" onClick={() => setShowPassword(p => !p)}
                                        className="cursor-pointer hover:text-gray-600 transition-colors p-2 -m-2">
                                        <EyeIcon off={!showPassword} />
                                    </button>
                                } />

                            <label className="flex items-center gap-2 mt-3 text-[0.8rem] font-[500] text-gray-600 cursor-pointer w-fit">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="accent-[#4338E5] size-3.5 cursor-pointer" />
                                Remember Me
                            </label>

                            {errorMessage &&
                                <div className="mt-3 text-center text-[0.8rem] font-[500] text-red-500">{errorMessage}</div>
                            }

                            <Button01
                                label={authMode === "logIn" ? "Log In" : "Sign Up"}
                                onClick={() => handleClick()}
                                disabled={inIsPending || upIsPending}
                                className={`mt-4 ${(inIsPending || upIsPending) ? "animate-pulse" : ""}`}
                            />

                            <div className="flex items-center gap-3 mt-5">
                                <hr className="flex-1 border-t border-gray-200" />
                                <span className="text-[0.75rem] font-[500] text-gray-500 whitespace-nowrap">Or Login With</span>
                                <hr className="flex-1 border-t border-gray-200" />
                            </div>

                            <Button01
                                label="Continue as Guest"
                                variant="secondary"
                                onClick={() => handleGuestLogIn()}
                                disabled={guestIsPending}
                                className={`mt-4 ${guestIsPending ? "animate-pulse" : ""}`}
                            />

                            <p className="mt-5 text-center text-[0.8rem] font-[500] text-gray-600">
                                {authMode === "logIn" ? "Don't Have An Account? " : "Already Have An Account? "}
                                <button onClick={chnageAuthMode} className="text-[#4338E5] font-[600] cursor-pointer hover:underline">
                                    {authMode === "logIn" ? "Register Now." : "Log In."}
                                </button>
                            </p>
                        </div>
                        </> : <div style={{ "--foreground": "#1A1A21", "--background": "#ffffff" } as React.CSSProperties}>
                            <h1 className="text-center text-[1.65rem] sm:text-[1.9rem] leading-tight font-[600] tracking-[-0.02em] text-[#1A1A21]">
                                Pick your avatar
                            </h1>
                            <p className="mt-2 text-center text-[0.85rem] font-[400] text-gray-500">
                                This becomes your profile photo.
                            </p>

                            <div className="relative mt-4 scale-[0.82] sm:scale-100 origin-top">
                                {([true, false] as const).map((isLeft) => (
                                    <button key={String(isLeft)} type="button"
                                        aria-label={isLeft ? "Previous avatar" : "Next avatar"}
                                        onClick={() => isLeft ? deck.current?.prev() : deck.current?.next()}
                                        className={`absolute top-[52%] z-[120] -translate-y-1/2 grid place-items-center size-9 rounded-full border border-gray-200 bg-white/90 text-[#1A1A21] shadow-sm cursor-pointer transition-colors hover:bg-gray-100 ${isLeft ? "left-0" : "right-0"}`}>
                                        <Chevron left={isLeft} />
                                    </button>
                                ))}

                                <CardStack
                                    controlsRef={deck}
                                    className=""
                                    items={AVATARS}
                                    cardWidth={158}
                                    cardHeight={214}
                                    overlap={0.46}
                                    spreadDeg={22}
                                    maxVisible={5}
                                    depthPx={90}
                                    activeLiftPx={16}
                                    activeScale={1.05}
                                    inactiveScale={0.9}
                                    loop
                                    showDots
                                    onChangeIndex={(_i: number, item: typeof AVATARS[number]) => setProfilePic(item.id)}
                                    renderCard={(item: typeof AVATARS[number], { active }: { active: boolean }) => (
                                        <div className={`h-full w-full rounded-full overflow-hidden bg-[#F1F2F5] flex items-center justify-center transition-all duration-200 ${active ? "" : "ring-1 ring-gray-200"}`}>
                                            <img src={item.imageSrc} alt={item.title} draggable={false}
                                                className="h-full w-full object-cover object-top pointer-events-none" />
                                        </div>
                                    )}
                                />
                            </div>

                            {errorMessage &&
                                <div className="mt-3 text-center text-[0.8rem] font-[500] text-red-500">{errorMessage}</div>
                            }

                            <Button01
                                label="Create Account"
                                onClick={() => submitSignUp()}
                                disabled={upIsPending}
                                className={`mt-4 ${upIsPending ? "animate-pulse" : ""}`}
                            />

                            <Button01
                                label="Back to details"
                                variant="secondary"
                                onClick={() => setStep("details")}
                                className="mt-3"
                            />
                        </div>}
                    </div>
                </div>

                <div className="shrink-0 flex items-center justify-between gap-2 text-[0.65rem] sm:text-[0.75rem] font-[400] text-gray-400">
                    <span>Copyright © 2026 Second Brain.</span>
                    <span>Privacy Policy</span>
                </div>
            </div>

            {/* ---- showcase column ---- */}
            <div style={{ backgroundColor: theme.bg }}
                className="cursor-avatar relative hidden flex-1 flex-col overflow-hidden lg:flex">
                <div className="absolute inset-0">
                    <Dither
                        bgColor={hexRgb(theme.bg)}
                        waveColor={hexRgb(theme.wave)}
                        waveSpeed={0.04}
                        waveFrequency={3}
                        waveAmplitude={0.3}
                        colorNum={4}
                        pixelSize={2}
                        enableMouseInteraction={true}
                        mouseRadius={0.4}
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-transparent" />

                <div className="relative z-10 pointer-events-none flex flex-col h-full px-10 xl:px-14 py-14">
                    <h2 className="text-[1.9rem] xl:text-[2.15rem] leading-[1.25] font-[600] tracking-[-0.02em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
                        Capture everything.<br />Find it instantly.
                    </h2>
                    <p className="mt-4 text-[0.9rem] font-[400] text-white/90 max-w-[440px] [text-shadow:0_1px_8px_rgba(0,0,0,0.35)]">
                        Log in to save your links, organize them into collections, and pool
                        them with your community.
                    </p>

                    <div className="flex-1 flex items-center justify-center">
                        <div className="relative w-full max-w-[520px] aspect-[5/4]">

                            {/* dot-dithered branches, brain centre -> each card */}
                            <div className="absolute inset-0">
                                <DitherBranches
                                    origin={[0.5, 0.5]}
                                    targets={FEED_POINTS}
                                    color="255,255,255"
                                    dotSize={5}
                                    thickness={0.05}
                                    startAt={0.27}
                                    bend={0.2}
                                    speed={0.5}
                                />
                            </div>

                            <img src="/brain_main.png" alt="Second Brain"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] object-contain drop-shadow-2xl" />

                            {ORBIT.map(({ key, mark, at, delay }) => (
                                <div key={key}
                                    className="floaty absolute size-[52px] xl:size-[58px] -translate-x-1/2 -translate-y-1/2"
                                    style={{ left: `${at[0] * 100}%`, top: `${at[1] * 100}%`, animationDelay: delay }}>
                                    <div className="glass-card size-full flex items-center justify-center p-[24%]">
                                        {mark}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* the avatar now lives in the cursor (.cursor-avatar), so the glass card is parked here
                        <div className="glass-card w-[40%] aspect-square flex items-center justify-center p-[5%]">
                            <img src="/sb_avatar.png" alt="" className="w-full h-full object-contain" />
                        </div>
                        */}
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Auth;