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
    collectionId : number;
}



///////////queryFuntionsss


const addContent = (data: addContentType) => {
    return axios.post('http://localhost:2233/user/addcontent', data, {
        withCredentials: true
    })
}


const addCollection = (data: addCollectionType) => {
    return axios.post('http://localhost:2233/user/createcollection', data, {
        withCredentials: true
    })
}

const sharebrain = (data : shareBraintype) => {
    return axios.patch('http://localhost:2233/user/generatelink',data,{
        withCredentials : true
    }).then(res => res.data);
}




//////////////////////////////////exported cutom hooks
export const useAddContentQuery = () => {
    return useMutation<any, Error, addContentType>({
        mutationFn: addContent,
        //        onSuccess : --revalidate the content on the current content of current collection
    })
}


export const useCreateCollection = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, addCollectionType>({
        mutationFn: addCollection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getList'] });
        }
    })
}


export const useShareBrain = () => {
    return useMutation<any, Error, shareBraintype>({
        mutationFn : sharebrain
    })
}