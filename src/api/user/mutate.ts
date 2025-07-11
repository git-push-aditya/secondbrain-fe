import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';

//////////query paramerets types
interface addContentType {
    title: string;
    hyperlink: string;
    note: string;
    type: 'WEB' | 'YOUTUBE' | 'REDDIT' | 'TWITTER' | 'INSTAGRAM';
    collectionId: number;
    existingTags: string[];
    newTags: string[];
}

interface addCollectionType {
    collectionName: string;
    collectionDesc: string;
}

interface shareBraintype {
    collectionId: number;
}


interface createCommunity {
    emailLead: string;
    name: string;
    descp: string;
    membersCanPost: boolean;
    password: string;
}

interface basicCommunity {
    communityId : number; 
}


///////////queryFuntionsss


const addContent = (data: addContentType) => {
    return axios.post('http://localhost:2233/user/addcontent', data, {
        withCredentials: true
    }).then(res => res.data)
}


const addCollection = (data: addCollectionType) => {
    return axios.post('http://localhost:2233/user/createcollection', data, {
        withCredentials: true
    })
}

const sharebrain = async (data: shareBraintype) => {
    const res = await axios.patch('http://localhost:2233/user/generatelink', data, {
        withCredentials: true
    });
    return res.data;
}

const deleteCard = ({ contentId }: { contentId: number }) => {
    return axios.post('http://localhost:2233/user/deletecontent', {
        contentId: contentId
    }, {
        withCredentials: true
    })
}

const deleteCollection = ({ collectionId }: { collectionId: number }) => {
    return axios.post('http://localhost:2233/user/deletecollection', {
        collectionId: collectionId
    }, {
        withCredentials: true
    }).then(res => res.data)
}

const removerShare = ({ collectionId }: { collectionId: number }) => {
    return axios.post('http://localhost:2233/user/removeshare', {
        collectionId: collectionId
    }, {
        withCredentials: true
    })
}


const createCommunityFn = (body: createCommunity) => {
    const { name, descp, password, membersCanPost, emailLead } = body;
    return axios.post('http://localhost:2233/user/createcommunity', {
        name, descp, password, membersCanPost, emailLead
    }, {
        headers : {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    }).then(res => res.data);
}


const joinCommunityFn = (body : {communityId : string}) => {
    const { communityId } = body;

    return axios.post('http://localhost:2233/user/joincommunity',{
        communityId
    },{
        withCredentials : true
    }).then(res => res.data )
}


const shareCommunityCred = async (body : basicCommunity) => {
    const {communityId} = body;
    console.log(communityId)
    console.log("mmmmmm")

    const res = await axios.post('http://localhost:2233/user/sharelogin', {
        communityId
    }, {
        withCredentials: true
    });
    return res.data;
}







//////////////////////////////////exported cutom hooks
export const useAddContentQuery = () => {
    const client = useQueryClient();
    return useMutation<any, Error, addContentType>({
        mutationFn: ({ collectionId, title, hyperlink, note, type, existingTags, newTags }) => addContent({ collectionId, title, hyperlink, note, type, existingTags, newTags }),
        onSuccess: (_, variables) => {
            client.invalidateQueries({ queryKey: ['fetchData', variables.collectionId] });
        }
    })
}


export const useCreateCollection = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, addCollectionType>({
        mutationFn: addCollection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getList'] })
        }
    })
}


export const useShareBrain = ({ collectionId }: shareBraintype) => {
    const client = useQueryClient();
    return useMutation<any, Error, shareBraintype>({
        mutationKey: ['sharebrain', collectionId],
        mutationFn: sharebrain,
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['getList'] });
        }
    })
}

export const useDeletecardQuery = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, { contentId: number, collectionId: number }>({
        mutationFn: ({ contentId, collectionId }: { contentId: number, collectionId: number }) => deleteCard({ contentId }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['fetchData', variables.collectionId] });
        }
    });
};


export const useDeleteCollectionQuery = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, { collectionId: number }>({
        mutationFn: ({ collectionId }) => deleteCollection({ collectionId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getList'] });
        }
    })
}



export const useRemoveShareQuery = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, { collectionId: number }>({
        mutationFn: ({ collectionId }) => removerShare({ collectionId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getList'] });
        }
    })
}



export const useCreateCommunity = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, createCommunity>({
        mutationFn: (body: createCommunity) => createCommunityFn(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getList'] });
        }
    })
}

//remove password from join community
export const useJoinCommunity = () => {
    const queryClient = useQueryClient();

    return useMutation<any , Error, {communityId : string}>({
        mutationFn : (body : {communityId : string}) => joinCommunityFn(body),
        onSuccess : () => {
            queryClient.invalidateQueries({ queryKey : ['getList']});
        }
    })
}


export const useShareCommunityLogin = () => {
    return useMutation<any, Error, basicCommunity>({
        mutationFn : (body : basicCommunity) => shareCommunityCred(body), 
        onSuccess : () => {
            console.log("on success called")
        }
    })
}