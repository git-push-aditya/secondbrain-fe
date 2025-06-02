let isTwitterScriptLoaded = false;

export function loadTwitterScript () : Promise<void> {
    return new Promise((resolve, reject) => {
        if(isTwitterScriptLoaded || document.getElementById('twitter-wjs')){
            isTwitterScriptLoaded = true;
            resolve();
            return;
        }
 

        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        script.id = 'twitter-wjs';
        
        script.onload = () => {
            isTwitterScriptLoaded = true;
            resolve();
        };
        script.onerror = reject;

        document.body.appendChild(script);
        console.log('loaded the script ',script)

    })
}


export const redditScriptLoader = () : Promise<void>=> {
    return new Promise((resolve, reject) => { 
        const script = document.createElement('script');
        script.src = 'https://embed.reddit.com/widgets.js';
        script.async = true;
        script.id = 'reddit-wjs';
        script.charset = 'utf-8';

        const oldScript = document.getElementById('reddit-wjs');
        if (oldScript) oldScript.remove();

        document.body.appendChild(script);
    })
}


let isInstagramScriptLoaded = false;

export const instagramScriptLoader = () : Promise<void>=> {
    return new Promise((resolve, reject) => {
        if(isInstagramScriptLoaded || document.getElementById('instagram-wjs')){
            isInstagramScriptLoaded = true;
            resolve();
            return;
        }

        const script = document.createElement('script') as HTMLScriptElement;
        script.id = 'instagram-wjs';
        script.async = true;
        script.src = "https://www.instagram.com/embed.js";

        script.onload = () => {
            isInstagramScriptLoaded = true;
            resolve();
        }
        script.charset = 'utf-8';
        script.onerror = () => reject();

        document.body.appendChild(script);
    })
    
}