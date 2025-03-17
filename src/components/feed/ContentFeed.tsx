import React from "react";
import Feed from "./Feed";
import { useGetFeed } from "../../hooks/useGetFeed";

const ContentFeed = () => {
  const { posts, isLoading, fetchNextPage, hasNextPage } = useGetFeed();
  
  return <Feed posts={posts} loading={isLoading} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage}/>;
};
export default ContentFeed;