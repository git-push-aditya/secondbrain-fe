import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';

const getLists = () => {
    return axios.get(`${import.meta.env.VITE_BASE_URL}/user/communitycollectionlist`, {
        withCredentials: true
    })
}


const fetchContentCollection = async (pageParam: number, collectionId: number) => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/fetchcontents?collectionId=${collectionId}&page=${pageParam}&limit=${12}`, {
        withCredentials: true
    });
    return res.data;
}


const fetchContentCommunity = async (pageParam: number, communityId: number) => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/getcommunitycontent?communityId=${communityId}&page=${pageParam}&limit=${12}`, {
        withCredentials: true
    });
    return res.data;
}

 



//custom query hooks


export const useGetListQuery = () => {
    return useQuery({
        queryKey: ['getList'],
        queryFn: getLists,
        enabled: true,
        staleTime: Infinity
    })
}


/* /auth/signin, /auth/signup and /me all return the same {tagsList, collectionList,
   allCommunities} block that /communitycollectionlist does. Priming the cache with the auth
   response means the dashboard already knows its collectionId on first render, instead of
   waiting out a serial list request before it can even start fetching content. Combined with
   staleTime:Infinity above, the seeded value stops the request from firing at all. */
export const useSeedListCache = () => {
    const queryClient = useQueryClient();
    return (authResponse: unknown) => queryClient.setQueryData(['getList'], authResponse);
}

export const useFetchQueryCollection = ({ collectionId }: { collectionId: number }) => {
    return useInfiniteQuery({
        queryKey: ['fetchDataCollection', collectionId],
        queryFn: ({ pageParam = 1 }) => fetchContentCollection(pageParam, collectionId),
        initialPageParam: 1,
        enabled: collectionId !== -1,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10, 
        refetchOnWindowFocus: true,  
        refetchOnMount: false,
        refetchInterval: 300000,
        //polling a hidden tab every 5 minutes woke the backend and the DB for a view nobody
        //was looking at; refetchOnWindowFocus below already covers the come-back-to-it case
        refetchIntervalInBackground: false,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.payload.more ? allPages.length + 1 : undefined
    });
};


export const useFetchQueryCommunity = ({ communityId }: { communityId: number }) => {
    return useInfiniteQuery({
        queryKey: ['fetchDataCommunity', communityId],
        queryFn: ({ pageParam = 1 }) => fetchContentCommunity(pageParam, communityId),
        initialPageParam: 1,
        enabled: communityId !== -1,
        refetchInterval: 300000,
        //polling a hidden tab every 5 minutes woke the backend and the DB for a view nobody
        //was looking at; refetchOnWindowFocus below already covers the come-back-to-it case
        refetchIntervalInBackground: false,
        staleTime: 1000 * 60 * 5,  
        gcTime: 1000 * 60 * 10, 
        refetchOnWindowFocus: true,  
        refetchOnMount: false,

        getNextPageParam: (lastPage, allPages) =>
            lastPage.payload.more ? allPages.length + 1 : undefined
    });
};