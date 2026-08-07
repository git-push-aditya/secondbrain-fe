import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RecoilRoot } from 'recoil'

//fire-and-forget: wakes a sleeping Render dyno the moment the page loads, instead of the user's first real request paying for the cold start
fetch(`${import.meta.env.VITE_BASE_URL}/health`).catch(() => {});

createRoot(document.getElementById('root')!).render(
    <RecoilRoot>
        <App /> 
     </RecoilRoot>
)
