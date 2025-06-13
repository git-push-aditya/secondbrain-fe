import { useQuery } from "@tanstack/react-query";
import axios from 'axios';


interface fetchContent {
    collectionId : number,
    page : number,
    limit : number
}

//query functions

const getLists = () => { 
    return axios.get('http://localhost:2233/user/communitycollectionlist',{
        withCredentials : true
    })
}


const fetchContent = ({collectionId, page,limit}: fetchContent) => {
    return axios.get('http://localhost:2233/user/fetchcontents',{
        withCredentials: true
    })
}














//custom query hooks


export const useGetListQuery = () => {
    return useQuery({
        queryKey : ['getList'],
        queryFn : getLists,
        enabled : true
    })
}

export const useFetchQuery = ({collectionId, page,limit}:fetchContent) => {
    return useQuery ({
        queryKey : ['fetchQuery',collectionId, pageXOffset,limit],
        queryFn : () => fetchContent({collectionId, page,limit}),
        enabled : false
    })
}