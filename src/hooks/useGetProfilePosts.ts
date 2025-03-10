import { useEffect, useState } from "react";
import { useHttpRequestService } from "../service/HttpRequestService";
import { updateFeed } from "../redux/user";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useQuery } from "@tanstack/react-query";

export const useGetProfilePosts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const posts = useAppSelector((state) => state.user.feed);
  const dispatch = useAppDispatch();
  const id = useParams().id;
  const service = useHttpRequestService();
  const postsFromProfileQuery = useQuery({
    queryKey: ["postsByUser", id],
    enabled: id!==undefined,
    queryFn: () => id && service.getPostsFromProfile(id)
  })

  useEffect(() => {
    if (!id) return;
    if (postsFromProfileQuery.status === "success") {
      const validPosts = Array.isArray(posts) ? posts : [];
      const combinedPosts = Array.from(new Set([...validPosts, ...postsFromProfileQuery.data]))
      const updatedPosts = combinedPosts.filter((post) => post.authorId === id);
      dispatch(updateFeed(updatedPosts));
    }
  }, [postsFromProfileQuery.status, postsFromProfileQuery.data]);

  return { posts, loading: postsFromProfileQuery.isLoading, error: postsFromProfileQuery.isError };
};