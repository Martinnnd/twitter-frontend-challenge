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

  const commentsQuery = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => service.getCommentsByPostId(postId),
    staleTime: 60000, 
  });

  useEffect(() => {
    if (commentsQuery.data) {
      dispatch(updateFeed(commentsQuery.data));
      dispatch(setLength(commentsQuery.data.length));
    }
  }, [commentsQuery.data, dispatch]);

  return { 
    posts: commentsQuery.data ?? [],
    loading: commentsQuery.isLoading, 
    error: commentsQuery.isError 
  };
};
