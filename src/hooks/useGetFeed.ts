import { useEffect, useState } from "react";
import { useHttpRequestService } from "../service/HttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Post } from "../service";

export const useGetFeed = () => {
  const query = useAppSelector((state) => state.user.query);
  const [feed, setFeed] = useState<Post[]>([]);
  const dispatch = useAppDispatch();
  const service = useHttpRequestService();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isError } =
  useInfiniteQuery({
    queryKey: ["infinitePosts", query],
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      const response = await service.getPosts(query, pageParam);
      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor ?? undefined;
    },
  });


useEffect(() => {
  if (data) {
    const allPosts = data.pages.flatMap((page) => page.data) ?? [];
    
    setFeed(allPosts);
    dispatch(updateFeed(allPosts));
    dispatch(setLength(allPosts.length));
  }
}, [data, isFetching, isLoading]);


  return {
    posts: feed,
    loading: isLoading,
    error: isError,
    fetchNextPage,
    hasNextPage,
    fetching: isFetching,
  };
};
