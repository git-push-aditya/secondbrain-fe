import { useQuery } from "@tanstack/react-query";
import axios from 'axios';


interface fetchContentType {
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


const fetchContent = async ({collectionId,page,limit}: fetchContentType) => {
    const res = await axios.get(`http://localhost:2233/user/fetchcontents?collectionId=${collectionId}&page=${page}&limit=${limit}`, {
        withCredentials: true
    });
    return res.data;
}














//custom query hooks


export const useGetListQuery = () => {
    return useQuery({
        queryKey : ['getList'],
        queryFn : getLists,
        enabled : true
    })
}

export const useFetchQuery = ({collectionId,page,limit} : fetchContentType) => { 
    return useQuery  ({ 
        queryKey : ['fetchData',collectionId, page,limit],
        queryFn : () => fetchContent({collectionId,page,limit}),
        enabled : true 
    })
}