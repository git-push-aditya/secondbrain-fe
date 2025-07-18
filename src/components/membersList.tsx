import { user, useUserProfile } from "../recoil/user";
import { getGenderProfilePhoto } from "../utils/profilePhoto"

interface memberType {
    userName: string;
    gender: 'male' | 'female';
    isFounder: boolean;
    id: number;
}

const Member = ({ userName, gender, isFounder, id }: memberType) => {
    const [user] = useUserProfile();

    const src =
        user && userName === user.userName && user.profilePic
            ? user.profilePic
            : getGenderProfilePhoto(gender) || '/dp/b1.png';

    return (
        <div
            title={`${userName} : ${isFounder ? "Founder" : "Member"}`}
            className="flex cursor-default items-center gap-2 px-2 h-[50px] w-60 bg-slate-100"
        >
            <img src={src} className="rounded-[2rem] size-10" />
            <div className="text-2xl font-[500] truncate">{userName}</div>
            {isFounder ? (
                <div className="rounded-[3rem] size-8 bg-blue-300 flex justify-center items-center text-lg font-400">
                    F
                </div>
            ) : null}
        </div>
    );
};



export const RenderMembers = ({ membersList }: { membersList: memberType[] }) => {
    return <div className="border-2 border-black rounded-lg max-h-[300px] scrollbarList overflow-y-auto overflow-x-hidden">
        {
            membersList.map((member: memberType, idx: number) => ( 
                <Member
                    userName={member.userName}
                    id={member.id ?? idx}
                    key={(member.id ?? idx).toString()}
                    isFounder={member.isFounder}
                    gender={member.gender}
                />
            ))
            
        }
        <Member userName={"abda"} gender={"male"} isFounder={false} id={90} />
        <Member userName={"abda"} gender={"female"} isFounder={false} id={34} />
        <Member userName={"abda"} gender={"male"} isFounder={false} id={109} />
        <Member userName={"abda"} gender={"female"} isFounder={false} id={34} />
        <Member userName={"abda"} gender={"male"} isFounder={false} id={109} />
    </div>
}

