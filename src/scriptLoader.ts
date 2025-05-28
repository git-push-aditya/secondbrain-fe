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


let redditScriptloaded = false;

export const redditScriptLoader = () : Promise<void>=> {
    return new Promise((resolve, reject) => {
        if(redditScriptloaded || document.getElementById('reddit-wjs') ){
            resolve();
            return;
        } 

        const script = document.createElement('script') as HTMLScriptElement;
        script.async = true;
        script.id = 'reddit-wjs';
        script.src = "https://embed.reddit.com/widgets.js"
        script.charset ='utf-8';

        script.onload = () => {
            redditScriptloaded = true;
            resolve();
        };
        script.onerror = reject;
        document.body.appendChild(script);
        console.log('script appended : ',script);
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