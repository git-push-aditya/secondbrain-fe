import { useEffect, useState } from "react";
import { useUserProfile } from "../recoil/user";
import { useVoteContent } from "../api/user/mutate";
import { getProfilePicPath } from "../utils/profilePhoto";
import { Avatar } from "./ui/avatar";
import { CardElement, type cardType } from "./card";
import React from "react";

interface communityCard {
    createdAt: string;
    title: string;
    link: string;
    layout: 'grid' | 'list';
    communityId: number;
    id: number;
    note: string;
    cardType: cardType; 
    posterName: string;
    isOwner: boolean;
    upVoteCount: number;
    downVoteCount: number;
    usersVote ?: vote; 
    profilePic : 'b1' | 'b2' | 'b3' | 'g1' | 'g2' | 'g3';
}

export type vote = 'upVote' | 'downVote' | 'NONE';

const CommunityCard = ({ createdAt, title, link, layout, communityId, id, note, cardType, posterName, isOwner, upVoteCount, downVoteCount, usersVote,profilePic }: communityCard) => {

    const [profilePhoto, setProfilePhoto] = useState<string>("");
    const [user, setUser] = useUserProfile();
    useEffect(() => {
        if (isOwner) {
            setProfilePhoto(user?.profilePic!);
        } else {
            setProfilePhoto(getProfilePicPath(profilePic ?? "b1"));
        }
    }, []);

    

    const [voteCount, setVoteCount] = useState<{ upVotes: number, downVotes: number }>({ upVotes: upVoteCount, downVotes: downVoteCount });
    const { mutate: voteContent } = useVoteContent();
    const [usersPrevVote, setUsersVote] = useState<vote>(usersVote ?? 'NONE');
    const upVoteDownVote = (vote: vote) => {
        try {
            voteContent({ vote, contentId: id, communityId });
            if (usersPrevVote === 'NONE') {
                if (vote === 'upVote') {
                    setVoteCount((prev) => ({ upVotes: prev.upVotes + 1, downVotes: prev.downVotes }));
                    setUsersVote('upVote');
                } else {
                    setVoteCount((prev) => ({ upVotes: prev.upVotes, downVotes: prev.downVotes + 1 }));
                    setUsersVote('downVote');
                }
            } else if (usersPrevVote === 'upVote') {
                if (vote === 'upVote') {
                    setVoteCount((prev) => ({ upVotes: prev.upVotes - 1, downVotes: prev.downVotes }));
                    setUsersVote('NONE');
                } else {
                    setVoteCount((prev) => ({ upVotes: prev.upVotes - 1, downVotes: prev.downVotes + 1 }));
                    setUsersVote('downVote');
                }
            } else {
                if (vote === 'upVote') {
                    setVoteCount((prev) => ({ upVotes: prev.upVotes + 1, downVotes: prev.downVotes - 1 }));
                    setUsersVote('upVote');
                } else {
                    setVoteCount((prev) => ({ upVotes: prev.upVotes , downVotes: prev.downVotes - 1 }));
                    setUsersVote('NONE');
                }
            } 

        } catch (e) {
            console.error(e)
        }
    }

    const btn = (v: 'upVote' | 'downVote') => `cursor-pointer border px-1.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] transition-colors ${usersPrevVote === v
        ? (v === 'upVote' ? "border-green-500 bg-green-50 text-green-600" : "border-red-500 bg-red-50 text-red-600")
        : "border-[var(--rule)] text-[#71717A] hover:border-[var(--accent)] hover:text-[var(--accent)]"}`;

    return <CardElement
        id={id}
        collectionId={communityId}
        title={title}
        cardType={cardType}
        link={link}
        note={note}
        createdAt={createdAt}
        layout={layout}
        shared={true}
        extra={{
            byline: <span className="flex min-w-0 shrink-0 items-center gap-1.5 text-[0.7rem] text-[#52525B]">
                <Avatar src={profilePhoto} alt={posterName} className="size-4 rounded-full" />
                <span className="truncate">by {isOwner ? "you" : posterName}</span>
            </span>,
            votes: <span className="flex shrink-0 gap-1">
                <button onClick={() => upVoteDownVote('upVote')} className={btn('upVote')}>▲ {voteCount.upVotes}</button>
                <button onClick={() => upVoteDownVote('downVote')} className={btn('downVote')}>▼ {voteCount.downVotes}</button>
            </span>,
        }}
    />;
};

export default React.memo(CommunityCard);
