import { useMutation, useQueryClient } from "@tanstack/react-query";
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