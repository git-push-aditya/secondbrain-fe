

const profilePhotos = ["/dp/b1.png","/dp/b2.png","/dp/b3.png","/dp/g1.png","/dp/g2.png","/dp/g3.png"]

const randomIndex = () => Math.floor(Math.random() * profilePhotos.length);

export const getUserProfilePhoto = () => {
    return profilePhotos[randomIndex()]
}

export const getRandomProfilephoto = () => {
    return profilePhotos[randomIndex()]
}