import React, { useEffect, useCallback } from "react";
import { Post } from "../../service";
import { StyledContainer } from "../common/Container";
import Tweet from "../tweet/Tweet";
import Loader from "../loader/Loader";
import { useInView } from "react-intersection-observer";
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";

interface FeedProps {
  posts: Post[];
  loading: boolean;
  fetchNextPage: ((options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>) | (() => void);
  hasNextPage?: boolean;
}

const Feed = ({ posts, loading, fetchNextPage, hasNextPage }: FeedProps) => {
  const { ref, inView } = useInView();

  // Evita múltiples llamadas innecesarias a fetchNextPage
  const loadMore = useCallback(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return (
    <StyledContainer width="100%" alignItems="center">
      {posts?.length === 0 && <p>Uups...nothing down here...</p>}

      {posts?.map((post) => (
        <Tweet key={post.id} post={post} />
      ))}

      {loading && !hasNextPage && <Loader />} {/* Loader solo si ya no hay más páginas */}

      {hasNextPage && (
        <div className="text-center mt-6 p-2" ref={ref}>
          <Loader />
        </div>
      )}
    </StyledContainer>
  );
};

export default Feed;
