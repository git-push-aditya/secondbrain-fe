import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface sharedMetaData {
    hash : string
}

interface fetchedData extends sharedMetaData{
    pageParam : number;
    limit : number;
}

const sharedbrain = ({hash} : sharedMetaData) => {
    return axios.get(`http://localhost:2233/user/sharedbrain?id=${hash}`,{
        withCredentials : false
    }).then(res => res.data)
}

const fetchContent =({hash,pageParam,limit}:fetchedData) => {
    return axios.get(`http://localhost:2233/user/paginatedshareddata?hash=${hash}&page=${pageParam}&limit=${limit}`,{
        withCredentials : false
    })
}







export const useSharedMetaData = ({hash} : sharedMetaData) => { 
    return useQuery({
        queryKey : ['metadata',hash],
        queryFn : () =>  sharedbrain({hash}),
        enabled : !!hash
    })
}


export const useFEctchData = ({hash,limit=12}:{hash :string, limit ?: number}) => {
    return useInfiniteQuery({
        queryKey : ['shareddata',hash],
        queryFn : ({pageParam = 1}) => fetchContent({hash, pageParam,limit}),
        initialPageParam : 1,
        enabled : !!hash,
        getNextPageParam : (lastPage,allPages) => {
            return lastPage.data.payload.more ? allPages.length + 1 : undefined;
        }
    })
}