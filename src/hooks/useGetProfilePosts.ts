import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { HttpService, useHttpRequestService } from "../service/HttpRequestService";
import { useParams } from "react-router-dom";

const httpService = new HttpService()
const staleTime = 1000 * 60 * 2 // 5 min

export const useGetMe = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["me"], 
    queryFn: httpService.service.me,
    staleTime: staleTime
  });

  return data
};

export const useGetRecommendedUsers = (limit: number, skip: number) => {
  const { data } = useSuspenseQuery({
    queryKey: ["recommendedUsers", limit, skip], 
    queryFn:  () => httpService.service.getRecommendedUsers(limit,skip),
    staleTime: staleTime, 
  });
  return data
}

export const useGetFollowers = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["followers"], 
    queryFn:  () => httpService.service.getFollowers(),
    staleTime: staleTime, 
  });
  return data
}

export const useGetFollowed = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["followed"], 
    queryFn:  () => httpService.service.getFollowings(),
    staleTime: staleTime, 
  });
  return data
}

export const useGetProfile = (id: string) => {
  const { data } = useSuspenseQuery({
    queryKey: ["profile", id], 
    queryFn:  () => httpService.service.getProfile(id),
    staleTime: staleTime, 
  });
  return data
}
export const useGetProfilePosts = () => {
  const id = useParams().id as string;
  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['profilePosts', id],
    queryFn: () => httpService.service.getPostsFromProfile(id),
    staleTime: staleTime, 
  })

  return {posts: data, loading: isLoading}
}