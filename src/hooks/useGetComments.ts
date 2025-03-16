import { useEffect } from "react";
import { useHttpRequestService } from "../service/HttpRequestService";
import { setLength, updateFeed } from "../redux/user";
import { useAppDispatch } from "../redux/hooks";
import { useQuery } from "@tanstack/react-query";

interface UseGetCommentsProps {
  postId: string;
}

export const useGetComments = ({ postId }: UseGetCommentsProps) => {
  const dispatch = useAppDispatch();
  const service = useHttpRequestService();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => service.getCommentsByPostId(postId),
    staleTime: 60000,
  });

  useEffect(() => {
    if (data) {
      dispatch(updateFeed(data));
      dispatch(setLength(data.length));
    }
  }, [data, dispatch]);

  return { 
    posts: data ?? [],
    loading: isLoading, 
    error: isError,
  };
};
