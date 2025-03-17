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
      console.log("📢 Fetching page with cursor:", pageParam);
      const response = await service.getPosts(query, pageParam);
      console.log("📢 API Response:", response);
      return response;
    },
    getNextPageParam: (lastPage) => {
      console.log("📢 Last Page Data:", lastPage);
      console.log("📢 Next Cursor:", lastPage?.nextCursor);
      return lastPage?.nextCursor ?? undefined;
    },
  });


useEffect(() => {
  if (data) {
    console.log("📢 Páginas recibidas:", data.pages);
    const allPosts = data.pages.flatMap((page) => page.data) ?? [];
    console.log("📢 Total de posts cargados:", allPosts.length);
    
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
