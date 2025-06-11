import { useEffect, useState } from "react";
import Dashboard from "./pages/dashboard"
import { SharedCollection } from "./pages/sharedCollection"
import { loadTwitterScript, redditScriptLoader, instagramScriptLoader } from "./scriptLoader";
import { AnimatePresence } from "framer-motion";
import { PopUp } from "./components/popUp";
import Auth from "./pages/Auth";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

export interface AuthUser {
	userName: string;
	profilePic: string;
	email: string;
}


interface protectedRouteProp {
	user: AuthUser | null;
	redirectTo: string;
}


function App() {
	const [popUpLive, setPopUpLive] = useState<Boolean>(false);
	const [layout, setLayout] = useState<"grid" | "list">("grid");
	const [user, setuser] = useState<AuthUser | null>(null);

	useEffect(() => {
		loadTwitterScript().then(() => {
			window.twttr.widgets.load();
		})

		redditScriptLoader();
		instagramScriptLoader();
	}, [])

	useEffect(() => {
		window.twttr?.widgets?.load();
		redditScriptLoader();
		window.instgrm?.Embeds?.process();
	}, [layout])


	useEffect(() => {
		if (popUpLive) {
			const counter = setTimeout(() => { setPopUpLive(false); console.log("tik") }, 3000);
			return () => clearInterval(counter);
		}
	}, [popUpLive]);



	return (
			<QueryClientProvider client={queryClient}>
				<AnimatePresence>
					<BrowserRouter>
						{popUpLive && <PopUp placeholder="Link coppied to clipboard!!" />}
						<Routes>

							<Route path="/" element={<Auth user={user} setUser={setuser} />} />

							<Route element={<ProtectedRoute user={user} redirectTo="/" />}>
								<Route path="/user" element={<Dashboard user={user} popUpLive={popUpLive} setPopUpLive={setPopUpLive} layout={layout} setLayout={setLayout} />} />
							</Route>
							

							<Route path="/sharedbrain" element={<SharedCollection popUpLive={popUpLive} setPopUpLive={setPopUpLive} layout={layout} setLayout={setLayout} />} />

							<Route path="*" element={<p>There's nothing here: 404!</p>} />
						</Routes>
					</BrowserRouter>
				</AnimatePresence>
				<ReactQueryDevtools initialIsOpen={false} position="bottom" /> 
			</QueryClientProvider> 
	)
}


const ProtectedRoute = ({ user, redirectTo }: protectedRouteProp) => {
	if (!user) {
		return <Navigate to={redirectTo} replace />
	}
	return <Outlet />;
}


export default App;