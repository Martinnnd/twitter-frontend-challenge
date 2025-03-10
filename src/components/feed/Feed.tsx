import React, { useEffect } from "react";
import { Post } from "../../service";
import { StyledContainer } from "../common/Container";
import Tweet from "../tweet/Tweet";
import Loader from "../loader/Loader";
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "@tanstack/react-query";

interface FeedProps {
  posts: Post[];
  loading: boolean;
  fetchNextPage?: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult<InfiniteData<{
    data: Post[];
    nextCursor: string | undefined;
  }, unknown>, Error>>;
  hasNextPage?: boolean;
  ref?: (node?: Element | null) => void;
  inView?: boolean;
}

const Feed = ({ posts, loading, fetchNextPage, hasNextPage }: FeedProps) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 1.0
  });
  
  const queryClient = useQueryClient(); // React Query Client
  
  useEffect(() => {
    if (inView && fetchNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  useEffect(() => {
    // Aquí puedes escuchar cuando la cache de posts es invalidada y hacer que se recargue el feed
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [queryClient]);

  return (
    <StyledContainer width={"100%"} alignItems={"center"}>
      {posts && posts
        .filter((post, index, self) => {
          return self.findIndex((p) => p.id === post.id) === index;
        })
        .map((post: Post) => (
          <Tweet key={post.id} post={post} />
        ))}
      <div ref={ref} />
      {loading && <Loader />}
    </StyledContainer>
  );
};

export default Feed;
