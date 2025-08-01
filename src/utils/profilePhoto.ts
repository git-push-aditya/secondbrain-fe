type profilePic = 'b1' | 'b2' | 'b3' | 'g1' | 'g2' | 'g3' ;

export const getProfilePicPath = (name : profilePic) => {
    return `/dp/${name}.png`
}