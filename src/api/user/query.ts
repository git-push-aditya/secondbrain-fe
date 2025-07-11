import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from 'axios';
 

//query functions

const getLists = () => { 
    return axios.get('http://localhost:2233/user/communitycollectionlist',{
        withCredentials : true
    })
}


const fetchContentCollection = async (pageParam : number, collectionId: number) => {
    const res = await axios.get(`http://localhost:2233/user/fetchcontents?collectionId=${collectionId}&page=${pageParam}&limit=${12}`, {
        withCredentials: true
    });
    return res.data;
}


const fetchContentCommunity = async (pageParam : number, communityId : number) => {
    const res = await axios.get(`http://localhost:2233/user/getCommunityContent?communityId=${communityId}&page=${pageParam}&limit=${12}`, {
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

export const useFetchQueryCollection = ({ collectionId }: { collectionId: number }) => {
  return useInfiniteQuery({
    queryKey: ['fetchData', collectionId],
    queryFn: ({ pageParam = 1 }) => fetchContentCollection(pageParam, collectionId),
    initialPageParam: 1,
    enabled: collectionId !== -1,
    staleTime: 0, 
    getNextPageParam: (lastPage,allPages) =>
      lastPage.payload.more ? allPages.length + 1 : undefined
  });
};


export const useFetchQueryCommunity = ({ communityId }: { communityId: number }) => {
  return useInfiniteQuery({
    queryKey: ['fetchData', communityId],
    queryFn: ({ pageParam = 1 }) => fetchContentCommunity(pageParam, communityId),
    initialPageParam: 1,
    enabled: communityId !== -1,
    staleTime: 0, 
    getNextPageParam: (lastPage,allPages) =>
      lastPage.payload.more ? allPages.length + 1 : undefined
  });
};