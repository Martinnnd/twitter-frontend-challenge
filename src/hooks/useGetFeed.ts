import { useEffect, useState } from "react";
import { useHttpRequestService } from "../service/HttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useQuery } from "@tanstack/react-query";

export const useGetFeed = () => {
  const posts = useAppSelector((state: { user: { feed: any[]; query: string } }) => state.user.feed);
  const query = useAppSelector((state) => state.user.query);

  const dispatch = useAppDispatch();

  const service = useHttpRequestService();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", query],
    queryFn: async () => service.getPosts(query),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (data) {
      dispatch(updateFeed(data));
      dispatch(setLength(data.length));
    }
  }, [data, dispatch]);

  return { posts, isLoading, isError };
};
