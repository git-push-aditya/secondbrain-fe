import { useEffect, useState } from "react";
import Dashboard from "./pages/dashboard"
import { SharedCollection } from "./pages/sharedCollection"
import { loadTwitterScript, redditScriptLoader, instagramScriptLoader } from "./scriptLoader";
import { AnimatePresence } from "framer-motion";
import { PopUp } from "./components/popUp";
import Auth from "./pages/Auth";

//<SharedCollection popUpLive={popUpLive} setPopUpLive={setPopUpLive} layout={layout} setLayout={setLayout}/>
//<Dashboard popUpLive={popUpLive} setPopUpLive={setPopUpLive} layout={layout} setLayout={setLayout} />
function App() {
  const [popUpLive, setPopUpLive] = useState<Boolean>(false);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

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
  }, [popUpLive])

  return (
    <>
      <AnimatePresence>
        {popUpLive && <PopUp placeholder="Link coppied to clipboard!!" />}
      </AnimatePresence>

      <Auth />
    </>
  )
}

export default App 