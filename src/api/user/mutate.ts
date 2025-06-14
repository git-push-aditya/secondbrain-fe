import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios'; 
import { title } from "framer-motion/client";

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
    }).then(res=>res.data)
}


const addCollection = (data: addCollectionType) => {
    return axios.post('http://localhost:2233/user/createcollection', data, {
        withCredentials: true
    })
}

const sharebrain = async (data : shareBraintype) => {
    const res = await axios.patch('http://localhost:2233/user/generatelink', data, {
        withCredentials: true
    });
    return res.data;
}

const deleteCard = ({contentId}:{contentId:number}) =>  {
    return axios.post('http://localhost:2233/user/deletecontent',{
        contentId : contentId
    },{
       withCredentials: true
    })
}








//////////////////////////////////exported cutom hooks
export const useAddContentQuery = () => {
    const client = useQueryClient(); 
    return useMutation<any, Error, addContentType>({
        mutationFn: ({collectionId, title,hyperlink,note,type,existingTags,newTags}) => addContent({collectionId, title,hyperlink,note,type,existingTags,newTags}),
        onSuccess : (_, variables) => {
            client.invalidateQueries({ queryKey: ['fetchData',variables.collectionId] });
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


export const useShareBrain = ({collectionId} : shareBraintype) => {
    return useMutation<any, Error, shareBraintype>({
        mutationKey: ['sharebrain', collectionId],
        mutationFn : sharebrain
    })
}

export const useDeletecardQuery = ({contentId,collectionId } : {contentId: number,collectionId: number}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey :['deleteCard',contentId],
        mutationFn : () => deleteCard({contentId}),
        onSuccess : () => {
            queryClient.invalidateQueries({ queryKey: ['fetchData', variables.collectionId] });
            queryClient.setQueryData(['fetchData',collectionId],((prev :any) => {
                if (!prev) return [];
                return {...prev,
                    pages : prev.pages.map((page:any)=>{
                        return {
                        ...page,
                        payload : page.payload.content.filter((item :any)=> item.content.id !== contentId)
                    }})
                };
            }))
        }
    })
}
