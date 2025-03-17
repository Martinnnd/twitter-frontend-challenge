import React, { useEffect } from "react";
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

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <StyledContainer width={"100%"} alignItems={"center"}>
      {posts.length === 0 && <p>Uups...nothing down here...</p>}
      {posts &&
        posts
          .filter((post: Post) => post !== undefined) // Ensure undefined posts are filtered out
          .map((post: Post) => (
            <Tweet key={post.id} post={post} />
          ))}
      {(hasNextPage || loading) && (
        <div className="text-center mt-6 p-2">
          <button ref={ref}>
            <Loader />
          </button>
        </div>
      )}
    </StyledContainer>
  );
};

export default Feed;
