import { useEffect } from "react";
import { useHttpRequestService } from "../service/HttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { isEqual } from "lodash";

export const useGetFeed = () => {
  const posts = useAppSelector((state) => state.user.feed);
  const dispatch = useAppDispatch();
  const service = useHttpRequestService();
  
  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return service.getPosts("50");
    },
    getNextPageParam: (lastPage) => lastPage.info?.nextCursor || undefined,
    initialPageParam: undefined,
  });

  useEffect(() => {
    if (data) {
      const allPosts = data.pages.flatMap((page) => page.posts);
      if (!isEqual(allPosts, posts)) {
        dispatch(updateFeed(allPosts));
        dispatch(setLength(allPosts.length));
      }
    }
  }, [data, posts, dispatch]);

  return { posts, isLoading: isFetching, fetchNextPage, hasNextPage, isFetchingNextPage };
};
