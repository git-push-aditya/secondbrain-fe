const profilePhotosMale = ["/dp/b1.png","/dp/b2.png","/dp/b3.png"]
const profilePhotoFemale = ["/dp/g1.png","/dp/g2.png","/dp/g3.png"]

const randomIndex = () => Math.floor(Math.random() * 3);

export const getGenderProfilePhoto = ( gender : 'male' | 'female') => {
    return gender === 'male' ? profilePhotosMale[randomIndex()] : profilePhotoFemale[randomIndex()]
} 